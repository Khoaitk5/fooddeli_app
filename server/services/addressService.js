const addressDao = require("../dao/addressDao");
const userAddressDao = require("../dao/user_addressDao");

/**
 * @class AddressService
 * @description Xử lý nghiệp vụ liên quan đến địa chỉ của người dùng và cửa hàng
 */
class AddressService {
  /**
   * Tạo một địa chỉ mới cho người dùng
   */
  async createAddressForUser(userId, addressData, isPrimary = false) {
    try {
      const raw = addressData.address_line || {};

      const addressJSON = {
        detail: raw.detail ?? "",
        ward: raw.ward ?? "",
        district: raw.district ?? "",
        city: raw.city ?? "",
      };

      const safeAddressJSON = JSON.stringify(addressJSON);

      const address = await addressDao.create({
        address_line: safeAddressJSON,
        lat_lon: addressData.lat_lon ?? null,
        note: addressData.note ?? "",
        address_type: addressData.address_type ?? "Nhà",
      });

      await userAddressDao.create({
        user_id: userId,
        address_id: address.address_id,
        is_primary: isPrimary,
      });

      return address;
    } catch (err) {
      console.error("❌ [AddressService] Lỗi createAddressForUser:", err.message);
      throw new Error("Không thể tạo địa chỉ mới cho người dùng.");
    }
  }

  /**
   * Lấy toàn bộ địa chỉ của user
   */
  async getUserAddresses(userId) {
    try {
      return await userAddressDao.getAddressesByUserId(userId);
    } catch (err) {
      console.error("❌ [AddressService] Lỗi getUserAddresses:", err.message);
      throw new Error("Không thể lấy danh sách địa chỉ người dùng.");
    }
  }

  /**
   * Lấy địa chỉ mặc định (is_primary = true)
   */
  async getDefaultAddress(userId) {
    try {
      return await userAddressDao.getDefaultAddressByUserId(userId);
    } catch (err) {
      console.error("❌ [AddressService] Lỗi getDefaultAddress:", err.message);
      throw new Error("Không thể lấy địa chỉ mặc định của người dùng.");
    }
  }

  /**
   * Cập nhật địa chỉ (và quan hệ user-address nếu cần)
   */
  async updateAddress(addressId, updateData) {
    try {
      const safeAddressJSON =
        typeof updateData.address_line === "object"
          ? JSON.stringify(updateData.address_line)
          : updateData.address_line || "{}";

      const updated = await addressDao.update("address_id", addressId, {
        address_line: safeAddressJSON,
        note: updateData.note ?? "",
        address_type: updateData.address_type ?? "Nhà",
      });

      if (updateData.is_default !== undefined) {
        await userAddressDao.updateByAddressId(addressId, {
          is_primary: updateData.is_default,
        });
      }

      return updated;
    } catch (err) {
      console.error("❌ [AddressService] Lỗi updateAddress:", err.message);
      throw new Error("Không thể cập nhật địa chỉ.");
    }
  }
  
    /**
   * 🧭 Lấy 1 địa chỉ theo ID (kèm parse JSON)
   */
  async getAddressById(addressId) {
    try {
      // const addr = await addressDao.getById(addressId);
      const addr = await addressDao.findById("address_id", addressId);
      if (!addr) return null;

      return {
        address_id: addr.address_id,
        address_line:
          typeof addr.address_line === "string"
            ? JSON.parse(addr.address_line)
            : addr.address_line,
        lat_lon:
          typeof addr.lat_lon === "string"
            ? JSON.parse(addr.lat_lon)
            : addr.lat_lon,
        note: addr.note,
        address_type: addr.address_type,
      };
    } catch (err) {
      console.error("❌ [AddressService] Lỗi getAddressById:", err.message);
      throw new Error("Không thể lấy địa chỉ theo ID.");
    }
  }

  /**
   * 🧩 Chuẩn hoá danh sách địa chỉ của user (đã parse JSON sẵn)
   */
  async getNormalizedUserAddresses(userId) {
    try {
      const rawAddrs = await this.getUserAddresses(userId);
      return rawAddrs.map((addr) => ({
        address_id: addr.address_id,
        address_line:
          typeof addr.address_line === "string"
            ? JSON.parse(addr.address_line)
            : addr.address_line,
        lat_lon:
          typeof addr.lat_lon === "string"
            ? JSON.parse(addr.lat_lon)
            : addr.lat_lon,
        note: addr.note,
        address_type: addr.address_type,
        is_primary: addr.is_primary,
      }));
    } catch (err) {
      console.error("❌ [AddressService] Lỗi getNormalizedUserAddresses:", err.message);
      throw new Error("Không thể chuẩn hoá danh sách địa chỉ người dùng.");
    }
  }

}

module.exports = new AddressService();
