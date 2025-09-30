// controllers/authController.js
const authService = require("../services/authService");

// 🆕 Đăng ký tài khoản mới (bằng email hoặc SĐT)
exports.register = async (req, res) => {
  try {
    const newUser = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "✅ Đăng ký tài khoản thành công",
      user: {
        id: newUser.id,
        username: newUser.username,
        full_name: newUser.full_name,
        phone: newUser.phone,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err.message);
    res.status(400).json({
      success: false,
      message: err.message || "Đăng ký thất bại",
    });
  }
};

// 🔑 Đăng nhập bằng số điện thoại
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Vui lòng nhập đầy đủ số điện thoại và mật khẩu",
      });
    }

    const user = await authService.login(phone, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "❌ Sai số điện thoại hoặc mật khẩu",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Đăng nhập thành công",
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Lỗi server",
    });
  }
};

// 🔴 Đăng xuất (nếu dùng JWT thì xoá token ở đây)
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "👋 Đăng xuất thành công",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Lỗi khi đăng xuất",
    });
  }
};
