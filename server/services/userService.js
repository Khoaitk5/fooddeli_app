// server/services/userService.js
const userDao = require("../dao/userDao");

const userService = {
  async createUser(userData) {
    return await userDao.create(userData);
  },
  /**
   * 📌 Lấy thông tin người dùng theo ID
   */
  async getUserById(userId) {
    return await userDao.findById(userId);
  },

  /**
   * 📌 Lấy tất cả người dùng
   */
  async getAllUsers() {
    return await userDao.findAll();
  },

  /**
   * 📌 Cập nhật thông tin người dùng
   */
  async updateUser(userId, updateData) {
    return await userDao.update("id", userId, updateData);
  },

  /**
   * 📌 Xóa người dùng theo ID
   */
  async deleteUser(userId) {
    return await userDao.delete("id", userId);
  },

  /**
   * 🔐 Khóa tài khoản người dùng
   */
  async lockUserAccount(userId) {
    return await userDao.lockUserAccount(userId);
  },

  /**
   * 🔍 Tìm người dùng theo username
   */
  async getUserByUsername(username) {
    return await userDao.findByUsername(username);
  },

  /**
   * 🔍 Tìm người dùng theo email
   */
  async getUserByEmail(email) {
    return await userDao.findByEmail(email);
  },

  /**
   * 🔍 Tìm người dùng theo số điện thoại
   */
  async getUserByPhone(phone) {
    return await userDao.findByPhone(phone);
  },
};

module.exports = userService;
