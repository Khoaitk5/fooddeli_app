// login, logout, register, refreshToken
// controllers/authController.js
const authService = require("../services/authService");

// 🟢 Đăng ký tài khoản mới
exports.register = async (req, res) => {
  try {
    const newUser = await authService.register(req.body);

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "❌ Username hoặc email đã tồn tại",
      });
    }

    res.status(201).json({
      success: true,
      message: "✅ Đăng ký thành công",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔑 Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Vui lòng nhập đầy đủ username và password",
      });
    }

    const user = await authService.login(username, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "❌ Sai tài khoản hoặc mật khẩu",
      });
    }

    // ✅ Nếu muốn trả token JWT, bạn có thể thêm logic tạo token ở service rồi trả về ở đây

    res.status(200).json({
      success: true,
      message: "✅ Đăng nhập thành công",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔴 Đăng xuất (tuỳ chọn – nếu có quản lý token/session)
exports.logout = async (req, res) => {
  try {
    // nếu bạn lưu refreshToken/session, có thể xóa ở đây
    res.status(200).json({ success: true, message: "👋 Đăng xuất thành công" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
