// dao/userDao.js
const pool = require("../config/db");
const GenericDao = require("./generic_dao");
const User = require("../models/user");

// 📦 Tạo instance GenericDao cho bảng "users"
const userDao = new GenericDao("users", User);

/**
 * 🔐 Khóa tài khoản người dùng (chuyển status từ 'active' sang 'inactive')
 * @param {string} userId - ID của người dùng cần khóa
 * @returns {Promise<object>} - Trả về user sau khi cập nhật hoặc lỗi nếu không tìm thấy
 */
userDao.lockUserAccount = async (userId) => {
  try {
    // ✅ dùng hàm findById đã fix
    const user = await userDao.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status !== "active") {
      throw new Error("Only active users can be locked");
    }

    // 🔁 Cập nhật trạng thái
    const updated = await pool.query(
      `UPDATE users SET status = 'inactive' WHERE id = $1 RETURNING *`,
      [userId]
    );

    return new User(updated.rows[0]);
  } catch (error) {
    console.error("Error locking user account:", error.message);
    throw error;
  }
};

/**
 * 🔍 Tìm user theo ID (✅ đã sửa không còn tự gọi chính nó)
 */
userDao.findById = async (id) => {
  return await GenericDao.prototype.findById.call(userDao, "id", id);
};

/**
 * 🔍 Tìm user theo username
 */
userDao.findByUsername = async (username) => {
  const res = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return res.rows[0] ? new User(res.rows[0]) : null;
};

/**
 * 🔍 Tìm user theo email
 */
userDao.findByEmail = async (email) => {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return res.rows[0] ? new User(res.rows[0]) : null;
};

userDao.findByPhone = async (phone) => {
  const res = await pool.query(
    "SELECT * FROM users WHERE phone = $1",
    [phone]
  );
  return res.rows[0] || null;
};

module.exports = userDao;
