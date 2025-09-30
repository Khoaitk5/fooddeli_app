// dao/userDao.js
const pool = require("../config/db");
const GenericDao = require("./generic_dao");
const User = require("../models/user");

// Create an instance for the "users" collection
const userDao = new GenericDao("users", User);

/**
 * Lock a user account (change status from 'active' to 'inactive')
 * @param {string} userId - ID of the user to lock
 * @returns {Promise<object>} - Returns the updated user or throws an error
 */
userDao.lockUserAccount = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status !== "active") {
      throw new Error("Only active users can be locked");
    }

    user.status = "inactive";
    await user.save();

    return user;
  } catch (error) {
    console.error("Error locking user account:", error.message);
    throw error;
  }
};

// 🔍 Tìm user theo username
userDao.findByUsername = async (username) => {
  const res = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  return res.rows[0] ? new User(res.rows[0]) : null;
};

// 🔍 Tìm user theo email (nếu đăng nhập bằng email)
userDao.findByEmail = async (email) => {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return res.rows[0] ? new User(res.rows[0]) : null;
};

module.exports = userDao;
