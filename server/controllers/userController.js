const userService = require("../services/userService");

// 📌 Lấy toàn bộ người dùng (chỉ nên dùng cho admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("⚠️ Lỗi getAllUsers:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Lỗi server khi lấy danh sách người dùng.",
      });
  }
};

// 📌 Lấy thông tin user hiện tại từ session
const getCurrentUser = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    console.log("📥 Cookie gửi lên:", req.headers.cookie);
    console.log("📥 Toàn bộ session server lưu:", req.sessionStore.sessions);
    console.log("📥 Session hiện tại tìm thấy:", req.session);

    if (!sessionUser) {
      return res
        .status(401)
        .json({
          success: false,
          message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
        });
    }

    const user = await userService.getUserById(sessionUser.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Không tìm thấy người dùng." });
    }

    const { password, ...safeUser } = user; // xoá password nếu có
    return res.status(200).json({ success: true, user: safeUser });
  } catch (error) {
    console.error("⚠️ Lỗi getCurrentUser:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Lỗi server khi lấy thông tin người dùng.",
      });
  }
};

// 📌 Cập nhật thông tin user hiện tại
const updateCurrentUser = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res
        .status(401)
        .json({
          success: false,
          message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
        });
    }

    const updatedUser = await userService.updateUser(sessionUser.id, req.body);
    if (!updatedUser) {
      return res
        .status(404)
        .json({
          success: false,
          message: "❌ Không tìm thấy người dùng để cập nhật.",
        });
    }

    const { password, ...safeUser } = updatedUser;
    return res
      .status(200)
      .json({
        success: true,
        message: "✅ Cập nhật thành công",
        user: safeUser,
      });
  } catch (error) {
    console.error("⚠️ Lỗi updateCurrentUser:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server khi cập nhật người dùng." });
  }
};

// 📌 Xoá tài khoản user hiện tại
const deleteCurrentUser = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res
        .status(401)
        .json({
          success: false,
          message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
        });
    }

    const deletedUser = await userService.deleteUser(sessionUser.id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({
          success: false,
          message: "❌ Không tìm thấy người dùng để xoá.",
        });
    }

    return res
      .status(200)
      .json({ success: true, message: "✅ Tài khoản đã được xoá thành công." });
  } catch (error) {
    console.error("⚠️ Lỗi deleteCurrentUser:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xoá người dùng." });
  }
};

// 📌 Khoá tài khoản user hiện tại
const lockCurrentUser = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res
        .status(401)
        .json({
          success: false,
          message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
        });
    }

    const lockedUser = await userService.lockUserAccount(sessionUser.id);
    if (!lockedUser) {
      return res
        .status(404)
        .json({
          success: false,
          message: "❌ Không tìm thấy người dùng để khoá.",
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "🔐 Tài khoản đã bị khoá thành công.",
        user: lockedUser,
      });
  } catch (error) {
    console.error("⚠️ Lỗi lockCurrentUser:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server khi khoá tài khoản." });
  }
};

// 📌 Tìm người dùng theo username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "❌ Không tìm thấy người dùng với username này!",
        });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByUsername:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Lỗi server khi tìm người dùng theo username.",
      });
  }
};

// 📌 Tìm người dùng theo email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "❌ Không tìm thấy người dùng với email này!",
        });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByEmail:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Lỗi server khi tìm người dùng theo email.",
      });
  }
};

// 📌 Tìm người dùng theo số điện thoại
const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await userService.getUserByPhone(phone);
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "❌ Không tìm thấy người dùng với số điện thoại này!",
        });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByPhone:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Lỗi server khi tìm người dùng theo số điện thoại.",
      });
  }
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  lockCurrentUser,
  getUserByUsername,
  getUserByEmail,
  getUserByPhone,
};
