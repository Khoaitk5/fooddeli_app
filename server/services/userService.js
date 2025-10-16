const userDao = require("../dao/userDao");
const shopProfileService = require("./shop_profileService");

/**
 * @class UserService
 * @description Xử lý nghiệp vụ liên quan đến người dùng (user)
 */
class UserService {
  /**
   * @async
   * @function createUser
   * @description Tạo người dùng mới
   * @param {object} userData - Thông tin người dùng (username, password, email, phone, role, ...)
   * @returns {Promise<object>} - User mới tạo
   */
  async createUser(userData) {
    try {
      const newUser = await userDao.create(userData);
      return newUser;
    } catch (err) {
      console.error("❌ Error creating user:", err.message);
      throw new Error("Không thể tạo người dùng mới.");
    }
  }

  /**
  * @async
  * @function getUserById
  * @description Lấy thông tin người dùng theo ID (bao gồm shop_profile nếu có)
  * @param {number} id - ID người dùng
  * @returns {Promise<object|null>} - Thông tin user hoặc null nếu không có
  */
  async getUserById(id) {
    try {
      const user = await userDao.findById(id);
      if (!user) return null;

      if (user.role === "shop") {
        const shopProfile = await shopProfileService.getShopByUserId(id);
        if (shopProfile) user.shop_profile = shopProfile;
      }

      return user;
    } catch (err) {
      console.error("❌ Error fetching user by ID:", err.message);
      throw new Error("Không thể lấy thông tin người dùng.");
    }
  }

  /**
   * @async
   * @function getUserByUsername
   * @description Lấy người dùng theo username
   * @param {string} username - Tên đăng nhập
   * @returns {Promise<object|null>}
   */
  async getUserByUsername(username) {
    try {
      return await userDao.findByUsername(username);
    } catch (err) {
      console.error("❌ Error fetching user by username:", err.message);
      throw new Error("Không thể tìm người dùng theo tên đăng nhập.");
    }
  }

  /**
   * @async
   * @function getUserByPhone
   * @description Lấy người dùng theo số điện thoại
   * @param {string} phone - Số điện thoại
   * @returns {Promise<object|null>}
   */
  async getUserByPhone(phone) {
    try {
      return await userDao.findByPhone(phone);
    } catch (err) {
      console.error("❌ Error fetching user by phone:", err.message);
      throw new Error("Không thể tìm người dùng theo số điện thoại.");
    }
  }

  /**
   * @async
   * @function updateUser
   * @description Cập nhật thông tin người dùng
   * @param {number} id - ID người dùng
   * @param {object} updateData - Dữ liệu cần cập nhật
   * @returns {Promise<object>} - User sau khi cập nhật
   */
  async updateUser(id, updateData) {
    try {
      return await userDao.update("id", id, updateData);
    } catch (err) {
      console.error("❌ Error updating user:", err.message);
      throw new Error("Không thể cập nhật thông tin người dùng.");
    }
  }

  /**
   * @async
   * @function lockUserAccount
   * @description Khóa tài khoản người dùng (đổi status -> inactive)
   * @param {number} id - ID người dùng
   * @returns {Promise<object>} - User sau khi bị khóa
   */
  async lockUserAccount(id) {
    try {
      return await userDao.lockUserAccount(id);
    } catch (err) {
      console.error("❌ Error locking user:", err.message);
      throw new Error("Không thể khóa tài khoản người dùng.");
    }
  }

  /**
   * @async
   * @function updateRating
   * @description Cập nhật điểm đánh giá người dùng
   * @param {number} id - ID người dùng
   * @param {number} rating - Điểm đánh giá mới
   * @returns {Promise<object>} - User sau khi cập nhật
   */
  async updateRating(id, rating) {
    try {
      if (rating < 0 || rating > 5) throw new Error("Rating không hợp lệ.");
      return await userDao.updateRating(id, rating);
    } catch (err) {
      console.error("❌ Error updating user rating:", err.message);
      throw new Error("Không thể cập nhật điểm đánh giá người dùng.");
    }
  }

  /**
   * @async
   * @function getRoleById
   * @description Lấy vai trò (role) của người dùng
   * @param {number} id - ID người dùng
   * @returns {Promise<string|null>} - Role ('user', 'shop', 'shipper', 'admin')
   */
  async getRoleById(id) {
    try {
      return await userDao.getRoleById(id);
    } catch (err) {
      console.error("❌ Error fetching role:", err.message);
      throw new Error("Không thể lấy vai trò người dùng.");
    }
  }

  /**
   * @async
   * @function deleteUser
   * @description Xóa người dùng
   * @param {number} id - ID người dùng
   * @returns {Promise<object>} - Người dùng đã bị xóa
   */
  async deleteUser(id) {
    try {
      return await userDao.delete("id", id);
    } catch (err) {
      console.error("❌ Error deleting user:", err.message);
      throw new Error("Không thể xóa người dùng.");
    }
  }

  /**
 * @async
 * @function getUserByEmail
 * @description Lấy người dùng theo email
 * @param {string} email - Địa chỉ email của người dùng
 * @returns {Promise<object|null>} - User hoặc null nếu không tồn tại
 */
  async getUserByEmail(email) {
    try {
      return await userDao.getUserByEmail(email);
    } catch (err) {
      console.error("❌ Error fetching user by email:", err.message);
      throw new Error("Không thể tìm người dùng theo email.");
    }
  }
}


module.exports = new UserService();
