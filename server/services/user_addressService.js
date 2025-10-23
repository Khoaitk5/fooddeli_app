const userAddressDao = require("../dao/user_addressDao");
const addressDao = require("../dao/addressDao");

/**
 * @class UserAddressService
 * @description Xử lý nghiệp vụ liên quan đến bảng trung gian user_addresses
 */
class UserAddressService {
  /**
   * @async
   * @function addAddressToUser
   * @description Gán một địa chỉ có sẵn vào người dùng
   * @param {number} userId - ID người dùng
   * @param {number} addressId - ID địa chỉ
   * @param {boolean} [isPrimary=false] - Có phải địa chỉ chính không
   * @returns {Promise<object>} - Quan hệ user_address mới tạo
   */
  async addAddressToUser(userId, addressId, isPrimary = false) {
    try {
      const data = { user_id: userId, address_id: addressId, is_primary: isPrimary };
      return await userAddressDao.create(data);
    } catch (err) {
      console.error("❌ Error adding address to user:", err.message);
      throw new Error("Không thể gán địa chỉ cho người dùng.");
    }
  }

  /**
   * @async
   * @function getAllAddressesByUser
   * @description Lấy tất cả địa chỉ của người dùng
   * @param {number} userId - ID người dùng
   * @returns {Promise<object[]>} - Danh sách địa chỉ
   */
  async getAllAddressesByUser(userId) {
    try {
      return await userAddressDao.getAllAddressesByUserId(userId);
    } catch (err) {
      console.error("❌ Error getting addresses by user:", err.message);
      throw new Error("Không thể lấy danh sách địa chỉ người dùng.");
    }
  }

  /**
   * @async
   * @function getPrimaryAddress
   * @description Lấy địa chỉ chính của người dùng
   * @param {number} userId - ID người dùng
   * @returns {Promise<object|null>} - Địa chỉ chính hoặc null
   */
  async getPrimaryAddress(userId) {
    try {
      return await userAddressDao.getPrimaryAddressByUserId(userId);
    } catch (err) {
      console.error("❌ Error getting primary address:", err.message);
      throw new Error("Không thể lấy địa chỉ chính của người dùng.");
    }
  }

  /**
   * @async
   * @function setPrimaryAddress
   * @description Cập nhật địa chỉ chính cho người dùng (chuyển is_primary)
   * @param {number} userId - ID người dùng
   * @param {number} addressId - ID địa chỉ cần đặt làm chính
   * @returns {Promise<void>}
   */
  async setPrimaryAddress(userId, addressId) {
    try {
      // 1. Tìm tất cả user_addresses của user này
      const allUserAddresses = await userAddressDao.findByField("user_id", userId);
      
      // 2. Set tất cả is_primary = false
      for (const ua of allUserAddresses) {
        await userAddressDao.update(ua.id, { is_primary: false });
      }
      
      // 3. Set địa chỉ được chọn = true
      const targetUA = allUserAddresses.find(ua => ua.address_id === addressId);
      if (targetUA) {
        await userAddressDao.update(targetUA.id, { is_primary: true });
      } else {
        throw new Error("Không tìm thấy địa chỉ trong danh sách của user");
      }
    } catch (err) {
      console.error("❌ Error setting primary address:", err.message);
      throw new Error("Không thể đặt địa chỉ chính cho người dùng.");
    }
  }

  /**
   * @async
   * @function removeAddressFromUser
   * @description Xóa liên kết giữa người dùng và địa chỉ (nhưng không xóa address)
   * @param {number} userId - ID người dùng
   * @param {number} addressId - ID địa chỉ
   * @returns {Promise<object>} - Kết quả xóa
   */
  async removeAddressFromUser(userId, addressId) {
    try {
      // Tìm user_address record
      const allUserAddresses = await userAddressDao.findByField("user_id", userId);
      const targetUA = allUserAddresses.find(ua => ua.address_id === addressId);
      
      if (!targetUA) {
        throw new Error("Không tìm thấy liên kết địa chỉ với user");
      }
      
      // Xóa record
      const deleted = await userAddressDao.delete(targetUA.id);
      return deleted;
    } catch (err) {
      console.error("❌ Error removing user address link:", err.message);
      throw new Error("Không thể gỡ địa chỉ khỏi người dùng.");
    }
  }
}

module.exports = new UserAddressService();
