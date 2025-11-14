const addressDao = require("../dao/addressDao");
const userAddressDao = require("../dao/user_addressDao");

/**
 * @class AddressService
 * @description Nghiệp vụ xử lý địa chỉ người dùng & cửa hàng
 */
class AddressService {
  /**
   * 🏗️ Tạo địa chỉ mới cho user
   */
  async createAddressForUser(userId, addressData, isPrimary = false) {
    try {
      const raw = addressData.address_line || {};
      const addressJSON = {
        detail: raw.detail ?? "",
        ward: raw.ward ?? "",
        province: raw.province ?? "", // Không còn district
      };

      const address = await addressDao.create({
        address_line: JSON.stringify(addressJSON),
        lat_lon: addressData.lat_lon ? JSON.stringify(addressData.lat_lon) : null,
        note: addressData.note ?? "",
        address_type: addressData.address_type ?? "Nhà",
      });

      await userAddressDao.createRelation(userId, address.address_id, isPrimary);
      return address;
    } catch (err) {
      console.error("❌ [AddressService] createAddressForUser:", err.message);
      throw new Error("Không thể tạo địa chỉ mới cho người dùng.");
    }
  }

  /**
   * 📋 Lấy tất cả địa chỉ user
   */
  async getUserAddresses(userId) {
    try {
      return await userAddressDao.getAddressesByUserId(userId);
    } catch (err) {
      console.error("❌ [AddressService] getUserAddresses:", err.message);
      throw new Error("Không thể lấy danh sách địa chỉ người dùng.");
    }
  }

  /**
   * ⭐ Lấy địa chỉ mặc định (is_primary = true)
   */
  async getDefaultAddress(userId) {
    try {
      return await userAddressDao.getDefaultAddressByUserId(userId);
    } catch (err) {
      console.error("❌ [AddressService] getDefaultAddress:", err.message);
      throw new Error("Không thể lấy địa chỉ mặc định của người dùng.");
    }
  }

  /**
   * 🔄 Cập nhật địa chỉ (và cả bảng user_addresses nếu có is_primary)
   */
  async updateAddress(addressId, updateData) {
    try {
      const existing = await addressDao.findById("address_id", addressId);
      if (!existing) {
        console.warn(`[WARN] Không tìm thấy địa chỉ ID=${addressId}`);
        return null;
      }

      const safeAddressJSON =
        typeof updateData.address_line === "object"
          ? JSON.stringify(updateData.address_line)
          : existing.address_line;

      const updated = await addressDao.update("address_id", addressId, {
        address_line: safeAddressJSON,
        note: updateData.note ?? existing.note,
        address_type: updateData.address_type ?? existing.address_type,
      });

      // Nếu có thay đổi is_primary → update bảng user_addresses
      if (updateData.is_primary !== undefined) {
        await userAddressDao.updateByAddressId(addressId, {
          is_primary: updateData.is_primary,
        });
      }

      return updated;
    } catch (err) {
      console.error("❌ [AddressService] updateAddress:", err.message);
      throw new Error("Không thể cập nhật địa chỉ.");
    }
  }

  /**
   * 🧭 Lấy địa chỉ theo ID (đã parse JSON)
   */
  async getAddressById(addressId) {
    try {
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
      console.error("❌ [AddressService] getAddressById:", err.message);
      throw new Error("Không thể lấy địa chỉ theo ID.");
    }
  }

  /**
   * 🧩 Trả danh sách địa chỉ chuẩn hóa (đã parse JSON)
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
      console.error("❌ [AddressService] getNormalizedUserAddresses:", err.message);
      throw new Error("Không thể chuẩn hoá danh sách địa chỉ người dùng.");
    }
  }
}

module.exports = new AddressService();
