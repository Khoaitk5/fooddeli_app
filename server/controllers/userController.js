// server/controllers/userController.js
const userService = require("../services/userService");

// 📌 Lấy thông tin user theo ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id || 4; // mặc định là 4 nếu không truyền
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "❌ Không tìm thấy người dùng!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("⚠️ Lỗi getUserById:", error);
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu người dùng." });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("⚠️ Lỗi getAllUsers:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng." });
  }
};
// 📌 Cập nhật thông tin user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id || 4;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ message: "❌ Không thể cập nhật - Người dùng không tồn tại!" });
    }

    res.status(200).json({
      message: "✅ Cập nhật thông tin thành công!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("⚠️ Lỗi updateUser:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin người dùng." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "❌ Người dùng không tồn tại!" });
    }

    res.status(200).json({
      message: "✅ Đã xóa người dùng thành công!",
      user: deletedUser,
    });
  } catch (error) {
    console.error("⚠️ Lỗi deleteUser:", error);
    res.status(500).json({ message: "Lỗi server khi xóa người dùng." });
  }
};

/**
 * 🔐 Khóa tài khoản người dùng
 */
const lockUserAccount = async (req, res) => {
  try {
    const userId = req.params.id;
    const lockedUser = await userService.lockUserAccount(userId);

    res.status(200).json({
      message: "🔐 Tài khoản đã bị khóa thành công!",
      user: lockedUser,
    });
  } catch (error) {
    console.error("⚠️ Lỗi lockUserAccount:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * 🔍 Tìm người dùng theo username
 */
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "❌ Không tìm thấy người dùng với username này!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("⚠️ Lỗi getUserByUsername:", error);
    res.status(500).json({ message: "Lỗi server khi tìm người dùng theo username." });
  }
};

/**
 * 🔍 Tìm người dùng theo email
 */
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "❌ Không tìm thấy người dùng với email này!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("⚠️ Lỗi getUserByEmail:", error);
    res.status(500).json({ message: "Lỗi server khi tìm người dùng theo email." });
  }
};

/**
 * 🔍 Tìm người dùng theo số điện thoại
 */
const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await userService.getUserByPhone(phone);

    if (!user) {
      return res.status(404).json({ message: "❌ Không tìm thấy người dùng với số điện thoại này!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("⚠️ Lỗi getUserByPhone:", error);
    res.status(500).json({ message: "Lỗi server khi tìm người dùng theo số điện thoại." });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  lockUserAccount,
  getUserByUsername,
  getUserByEmail,
  getUserByPhone,
};
