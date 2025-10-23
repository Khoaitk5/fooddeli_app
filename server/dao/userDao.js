const FirestoreDao = require("./firestore_dao");
const User = require("../models/user");

/**
 * @class UserDao
 * @extends FirestoreDao
 * @description Data Access Object cho collection `users`
 */
class UserDao extends FirestoreDao {
  constructor() {
    super("users", User);
  }

  /**
   * @async
   * @function findByUsername
   * @description Tìm user theo username
   * @param {string} username - Tên đăng nhập của user
   * @returns {Promise<User|null>} User hoặc null nếu không tìm thấy
   */
  async findByUsername(username) {
    return this.findOneByField("username", username);
  }

  /**
   * @async
   * @function findByPhone
   * @description Tìm user theo số điện thoại
   * @param {string} phone - Số điện thoại của user
   * @returns {Promise<User|null>} User hoặc null nếu không tìm thấy
   */
  async findByPhone(phone) {
    return this.findOneByField("phone", phone);
  }

  /**
   * @async
   * @function getUserByEmail
   * @description Tìm user theo email
   * @param {string} email - Email của user
   * @returns {Promise<User|null>} User hoặc null nếu không tồn tại
   */
  async getUserByEmail(email) {
    return this.findOneByField("email", email);
  }

  /**
   * @async
   * @function lockUserAccount
   * @description Đổi trạng thái của user từ 'active' sang 'inactive'
   * @param {string} id - ID của user cần khóa
   * @returns {Promise<User|null>} User đã cập nhật hoặc null nếu không tồn tại
   */
  async lockUserAccount(id) {
    const user = await this.findById(id);
    if (user && user.status === "active") {
      return this.update(id, { status: "inactive" });
    }
    return null;
  }

  /**
   * @async
   * @function updateRating
   * @description Cập nhật điểm đánh giá (rating) của user
   * @param {string} id - ID của user
   * @param {number} rating - Điểm đánh giá mới (0–5)
   * @returns {Promise<User|null>} User đã cập nhật hoặc null nếu không tồn tại
   */
  async updateRating(id, rating) {
    return this.update(id, { rating });
  }

  /**
   * @async
   * @function getRoleById
   * @description Lấy vai trò (role) của user theo id
   * @param {string} id - ID của user
   * @returns {Promise<string|null>} Vai trò ('user','shop','shipper','admin') hoặc null
   */
  async getRoleById(id) {
    const user = await this.findById(id);
    return user ? user.role : null;
  }
}

module.exports = new UserDao();
