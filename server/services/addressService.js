const addressDao = require("../dao/addressDao");
const userAddressDao = require("../dao/user_addressDao");

/**
 * @class AddressService
 * @description Xử lý nghiệp vụ liên quan đến địa chỉ của người dùng và cửa hàng
 */
class AddressService {
  /**
  * @async
  * @function createAddressForUser
  * @description Tạo một địa chỉ mới (dạng JSON) và gán cho người dùng
  * @param {number} userId - ID người dùng
  * @param {object} addressData - Dữ liệu địa chỉ (street, ward, district, city, province, lat_lon, note, address_type)
  * @param {boolean} [isPrimary=false] - Có đặt làm địa chỉ chính hay không
  * @returns {Promise<object>} - Địa chỉ mới được tạo
  */
  async createAddressForUser(userId, addressData, isPrimary = false) {
    try {
      // 🧱 1️⃣ Chuẩn hóa dữ liệu địa chỉ để lưu dạng JSON
      const addressJSON = {
        street: addressData.street ?? "",
        ward: addressData.ward ?? "",
        district: addressData.district ?? "",
        city: addressData.city ?? "",
        province: addressData.province ?? "",
      };

      // 🧭 2️⃣ Tạo bản ghi địa chỉ mới trong bảng addresses
      const address = await addressDao.create({
        address_line: addressJSON, // ✅ lưu JSON
        lat_lon: addressData.lat_lon ?? null,
        note: addressData.note ?? "",
        address_type: addressData.address_type ?? "Nhà",
      });

      // 🔗 3️⃣ Gán địa chỉ cho user trong bảng user_addresses
      await userAddressDao.create({
        user_id: userId,
        address_id: address.address_id,
        is_primary: isPrimary,
      });

      // ✅ 4️⃣ Trả về thông tin địa chỉ đã tạo
      return address;
    } catch (err) {
      console.error("❌ Error creating address for user:", err.message);
      throw new Error("Không thể tạo địa chỉ mới cho người dùng.");
    }
  }

  /**
   * @async
   * @function getAllAddressesByUserId
   * @description Lấy toàn bộ địa chỉ của user
   * @param {number} userId - ID người dùng
   * @returns {Promise<object[]>} - Danh sách địa chỉ
   */
  async getAllAddressesByUserId(userId) {
    try {
      const addresses = await userAddressDao.getAllAddressesByUserId(userId);
      return addresses;
    } catch (err) {
      console.error("❌ Error fetching addresses:", err.message);
      throw new Error("Không thể lấy danh sách địa chỉ người dùng.");
    }
  }

  /**
   * @async
   * @function getPrimaryAddressByUserId
   * @description Lấy địa chỉ chính của user
   * @param {number} userId - ID người dùng
   * @returns {Promise<object|null>} - Địa chỉ chính hoặc null nếu chưa có
   */
  async getPrimaryAddressByUserId(userId) {
    try {
      const address = await userAddressDao.getPrimaryAddressByUserId(userId);
      return address;
    } catch (err) {
      console.error("❌ Error fetching primary address:", err.message);
      throw new Error("Không thể lấy địa chỉ chính của người dùng.");
    }
  }

  /**
   * @async
   * @function updateAddress
   * @description Cập nhật thông tin một địa chỉ
   * @param {number} addressId - ID địa chỉ cần cập nhật
   * @param {object} data - Dữ liệu cần cập nhật
   * @returns {Promise<object>} - Địa chỉ sau khi cập nhật
   */
  async updateAddress(addressId, data) {
    try {
      const updated = await addressDao.update("address_id", addressId, data);
      return updated;
    } catch (err) {
      console.error("❌ Error updating address:", err.message);
      throw new Error("Không thể cập nhật địa chỉ.");
    }
  }

  /**
   * @async
   * @function deleteAddress
   * @description Xóa một địa chỉ và quan hệ với người dùng
   * @param {number} addressId - ID địa chỉ cần xóa
   * @returns {Promise<object>} - Địa chỉ đã bị xóa
   */
  async deleteAddress(addressId) {
    try {
      const deleted = await addressDao.delete("address_id", addressId);
      return deleted;
    } catch (err) {
      console.error("❌ Error deleting address:", err.message);
      throw new Error("Không thể xóa địa chỉ.");
    }
  }

  /**
   * @async
   * @function setPrimaryAddress
   * @description Đặt một địa chỉ làm địa chỉ chính của user
   * @param {number} userId - ID người dùng
   * @param {number} addressId - ID địa chỉ
   * @returns {Promise<void>}
   */
  async setPrimaryAddress(userId, addressId) {
    const client = require("../config/db");
    const queryRunner = client; // sử dụng pool.query tạm cho transaction

    try {
      await queryRunner.query("BEGIN");

      // 1️⃣ Bỏ địa chỉ chính hiện tại
      await queryRunner.query(
        `UPDATE user_addresses SET is_primary = FALSE WHERE user_id = $1`,
        [userId]
      );

      // 2️⃣ Đặt địa chỉ mới làm chính
      await queryRunner.query(
        `UPDATE user_addresses SET is_primary = TRUE WHERE user_id = $1 AND address_id = $2`,
        [userId, addressId]
      );

      await queryRunner.query("COMMIT");
    } catch (err) {
      await queryRunner.query("ROLLBACK");
      console.error("❌ Error setting primary address:", err.message);
      throw new Error("Không thể đặt địa chỉ chính cho người dùng.");
    }
  }
}

module.exports = new AddressService();
