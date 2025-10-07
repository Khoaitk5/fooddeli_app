console.log("📁 Đã load file authController.js từ:", __filename);

const authService = require("../services/authService");
const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

// ✅ Khởi tạo Firebase Admin toàn cục
let admin;
try {
  admin = require("../config/firebase");
  console.log("✅ Firebase admin loaded thành công");
} catch (e) {
  console.error("❌ Lỗi khi require firebase:", e);
}

/**
 * 📱 Bước 1 - xác thực số điện thoại và mật khẩu (chưa tạo user)
 */
exports.verifyResPhone = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Vui lòng nhập đầy đủ số điện thoại và mật khẩu",
      });
    }

    // ✅ Gọi service để kiểm tra tồn tại
    const isPhoneTaken = await userService.getUserByPhone(phone);
    if (isPhoneTaken) {
      return res.status(400).json({
        success: false,
        message: "📱 Số điện thoại này đã tồn tại",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Số điện thoại hợp lệ, tiếp tục đăng ký bước 2",
    });
  } catch (err) {
    console.error("❌ Lỗi verifyPhone:", err);
    res.status(500).json({
      success: false,
      message: "❌ Lỗi server khi xác thực số điện thoại",
    });
  }
};

/**
 * 🆕 Đăng ký tài khoản mới
 */
exports.register = async (req, res) => {
  try {
    const newUser = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "✅ Đăng ký tài khoản thành công",
      user: {
        id: newUser.id,
        username: newUser.username,
        full_name: newUser.fullname,
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

/**
 * 🔑 Đăng nhập bằng số điện thoại
 */
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

/**
 * 🔐 Tạo JWT cho user
 */
const generateJwt = (user) => {
  return jwt.sign(
    { id: user.id || user._id, phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * 📞 Xác thực số điện thoại bằng Firebase ID Token
 */
exports.verifyPhone = async (req, res) => {
  const { token } = req.body;

  try {
    console.log("📩 Nhận request verify-phone:", req.body);

    if (!admin) {
      return res.status(500).json({
        success: false,
        error: "Firebase Admin chưa được khởi tạo. Kiểm tra cấu hình.",
      });
    }

    // ✅ Xác thực token từ Firebase
    const decoded = await admin.auth().verifyIdToken(token);
    const phoneNumber = decoded.phone_number;

    console.log("📞 Firebase xác thực thành công:", phoneNumber);

    // ✅ Kiểm tra user tồn tại
    const user = await userService.getUserByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "📱 Tài khoản chưa tồn tại. Vui lòng đăng ký trước.",
      });
    }

    // ✅ Tạo JWT
    const jwtToken = generateJwt(user);
    return res.status(200).json({
      success: true,
      message: "📱 Xác thực thành công",
      token: jwtToken,
      user,
    });
  } catch (error) {
    console.error("❌ Lỗi xác thực token:", error);
    return res.status(401).json({
      success: false,
      error: "❌ Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

/**
 * 🔴 Đăng xuất (xóa JWT nếu có)
 */
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

console.log("📦 Export keys của authController:", Object.keys(module.exports));
