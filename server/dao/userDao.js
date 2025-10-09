// dao/userDao.js
const pool = require("../config/db");
const GenericDao = require("./generic_dao");
const User = require("../models/user");

class UserDao extends GenericDao {
  constructor() {
    super("users", User);
  }

  /**
   * 🔐 Khóa tài khoản người dùng (chuyển status từ 'active' sang 'inactive')
   * @param {number} userId - ID người dùng cần khóa
   * @returns {Promise<object>} - User sau khi cập nhật
   * @throws {Error} - Nếu user không tồn tại hoặc không ở trạng thái 'active'
   */
  async lockUserAccount(userId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.status !== "active") {
      throw new Error("Only active users can be locked");
    }

    const query = `
      UPDATE users
      SET status = 'inactive', updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [userId]);
    return new User(result.rows[0]);
  }

  /**
   * 🔍 Tìm user theo ID
   * @param {number} id - ID người dùng
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    return await super.findById("id", id); // Gọi hàm gốc từ GenericDao
  }

  /**
   * 🔍 Tìm user theo username
   * @param {string} username - tên đăng nhập
   * @returns {Promise<object|null>}
   */
  async findByUsername(username) {
    const res = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    return res.rows[0] ? new User(res.rows[0]) : null;
  }

  /**
   * 🔍 Tìm user theo email
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  async findByEmail(email) {
    const res = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return res.rows[0] ? new User(res.rows[0]) : null;
  }

  /**
   * 🔍 Tìm user theo số điện thoại
   * @param {string} phone
   * @returns {Promise<object|null>}
   */
  async findByPhone(phone) {
    const res = await pool.query(
      `SELECT * FROM users WHERE phone = $1`,
      [phone]
    );
    return res.rows[0] ? new User(res.rows[0]) : null;
  }

  /**
   * 📊 Cập nhật điểm đánh giá trung bình (rating)
   * @param {number} userId - ID người dùng
   * @param {number} newRating - điểm rating trung bình mới
   * @returns {Promise<object>} - User sau khi cập nhật
   */
  async updateRating(userId, newRating) {
    if (newRating < 0 || newRating > 5) {
      throw new Error("Rating must be between 0 and 5");
    }

    const query = `
      UPDATE users
      SET rating = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [newRating, userId]);
    return new User(result.rows[0]);
  }

  /**
   * 📜 Lấy danh sách người dùng theo vai trò
   * @param {"user"|"shop"|"shipper"|"admin"} role - Vai trò
   * @returns {Promise<object[]>} - Danh sách user
   */
  async getUsersByRole(role) {
    const query = `
      SELECT * FROM users
      WHERE role = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [role]);
    return result.rows.map(row => new User(row));
  }
}

module.exports = new UserDao();
