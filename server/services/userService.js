// services/userService.js
const userDao = require("../dao/userDao");
const bcrypt = require("bcrypt");

const userService = {
  /**
   * ➕ Tạo người dùng mới
   * @param {object} userData - { username, password, full_name, phone, email, role }
   * @returns {Promise<object>}
   */
  async createUser(userData) {
    if (!userData.username || !userData.password) {
      throw new Error("Thiếu username hoặc password");
    }

    // 🔐 Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await userDao.create({ ...userData, password: hashedPassword });
  },

  /**
   * 📦 Lấy thông tin người dùng theo ID
   * @param {number} userId
   * @returns {Promise<object|null>}
   */
  async getUserById(userId) {
    return await userDao.findById(userId);
  },

  /**
   * 📜 Lấy danh sách tất cả người dùng
   * @returns {Promise<object[]>}
   */
  async getAllUsers() {
    return await userDao.findAll();
  },

  /**
   * ✏️ Cập nhật thông tin người dùng
   * @param {number} userId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateUser(userId, updateData) {
    const existing = await userDao.findById(userId);
    if (!existing) {
      throw new Error("Người dùng không tồn tại");
    }

    // Nếu có cập nhật mật khẩu → hash lại
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return await userDao.update(userId, updateData);
  },

  /**
   * 🗑️ Xóa người dùng theo ID
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  async deleteUser(userId) {
    const existing = await userDao.findById(userId);
    if (!existing) {
      throw new Error("Người dùng không tồn tại");
    }
    return await userDao.delete(userId);
  },

  /**
   * 🔐 Khóa tài khoản người dùng
   * @param {number} userId
   * @returns {Promise<object>}
   */
  async lockUserAccount(userId) {
    return await userDao.lockUserAccount(userId);
  },

  /**
   * 🔍 Tìm user theo username
   * @param {string} username
   * @returns {Promise<object|null>}
   */
  async getUserByUsername(username) {
    return await userDao.findByUsername(username);
  },

  /**
   * 🔍 Tìm user theo email
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  async getUserByEmail(email) {
    return await userDao.findByEmail(email);
  },

  /**
   * 🔍 Tìm user theo số điện thoại
   * @param {string} phone
   * @returns {Promise<object|null>}
   */
  async getUserByPhone(phone) {
    return await userDao.findByPhone(phone);
  },

  /**
   * 📊 Cập nhật điểm đánh giá trung bình của người dùng
   * @param {number} userId
   * @param {number} newRating
   * @returns {Promise<object>}
   */
  async updateUserRating(userId, newRating) {
    return await userDao.updateRating(userId, newRating);
  },

  /**
   * 📜 Lấy danh sách người dùng theo vai trò
   * @param {"user"|"shop"|"shipper"|"admin"} role
   * @returns {Promise<object[]>}
   */
  async getUsersByRole(role) {
    return await userDao.getUsersByRole(role);
  },

};

module.exports = userService;
