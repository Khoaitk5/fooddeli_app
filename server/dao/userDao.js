const GenericDao = require("./generic_dao");
const User = require("../models/user");
const pool = require("../config/db");

/**
 * @class UserDao
 * @extends GenericDao
 * @description Data Access Object cho bảng `users`
 */
class UserDao extends GenericDao {
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
    const res = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
    return res.rows[0] ? new User(res.rows[0]) : null;
  }

  /**
   * @async
   * @function findByPhone
   * @description Tìm user theo số điện thoại
   * @param {string} phone - Số điện thoại của user
   * @returns {Promise<User|null>} User hoặc null nếu không tìm thấy
   */
  async findByPhone(phone) {
    const res = await pool.query(`SELECT * FROM users WHERE phone = $1`, [phone]);
    return res.rows[0] ? new User(res.rows[0]) : null;
  }

  /**
   * @async
   * @function findById
   * @description Ghi đè hàm findById từ GenericDao để dùng trực tiếp id của bảng users
   * @param {number} id - ID của user
   * @returns {Promise<User|null>} User hoặc null nếu không tồn tại
   */
  async findById(id) {
    const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return res.rows[0] ? new User(res.rows[0]) : null;
  }

  /**
   * @async
   * @function lockUserAccount
   * @description Đổi trạng thái của user từ 'active' sang 'inactive'
   * @param {number} id - ID của user cần khóa
   * @returns {Promise<User|null>} User đã cập nhật hoặc null nếu không tồn tại
   */
  async lockUserAccount(id) {
    const res = await pool.query(
      `UPDATE users SET status = 'inactive', updated_at = NOW() WHERE id = $1 AND status = 'active' RETURNING *`,
      [id]
    );
    return res.rows[0] ? new User(res.rows[0]) : null;
  }

  /**
   * @async
   * @function updateRating
   * @description Cập nhật điểm đánh giá (rating) của user
   * @param {number} id - ID của user
   * @param {number} rating - Điểm đánh giá mới (0–5)
   * @returns {Promise<User|null>} User đã cập nhật hoặc null nếu không tồn tại
   */
  async updateRating(id, rating) {
    const res = await pool.query(
      `UPDATE users SET rating = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [rating, id]
    );
    return res.rows[0] ? new User(res.rows[0]) : null;
  }

  /**
   * @async
   * @function getRoleById
   * @description Lấy vai trò (role) của user theo id
   * @param {number} id - ID của user
   * @returns {Promise<string|null>} Vai trò ('user','shop','shipper','admin') hoặc null
   */
  async getRoleById(id) {
    const res = await pool.query(`SELECT role FROM users WHERE id = $1`, [id]);
    return res.rows[0] ? res.rows[0].role : null;
  }
}

module.exports = new UserDao();
