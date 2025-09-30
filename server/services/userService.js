// server/services/userService.js
const userDao = require("../dao/userDao");

const userService = {
  /**
   * 📌 Lấy thông tin người dùng theo ID
   * @param {number} userId - ID của người dùng
   * @returns {Promise<Object|null>} - Thông tin người dùng hoặc null nếu không có
   */
  async getUserById(userId) {
    return await userDao.findById(userId);
  },

  /**
   * 📌 Lấy tất cả người dùng
   * @returns {Promise<Array>} - Danh sách tất cả người dùng
   */
  async getAllUsers() {
    return await userDao.findAll();
  },

  /**
   * 📌 Cập nhật thông tin người dùng
   * @param {number} userId - ID người dùng cần cập nhật
   * @param {object} updateData - Dữ liệu cập nhật
   * @returns {Promise<Object|null>} - Người dùng sau khi cập nhật hoặc null nếu không tồn tại
   */
  async updateUser(userId, updateData) {
    return await userDao.update("id", userId, updateData);
  },

  /**
   * 📌 Xóa người dùng theo ID
   * @param {number} userId - ID người dùng cần xóa
   * @returns {Promise<Object|null>} - Người dùng đã bị xóa hoặc null nếu không tồn tại
   */
  async deleteUser(userId) {
    return await userDao.delete("id", userId);
  }
};

module.exports = userService;
