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


exports.sendOtpEmail = async (req, res) => {
  const nodemailer = require("nodemailer");

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email là bắt buộc" });
  }

  // ✅ Sinh mã OTP 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // ✅ Lưu OTP tạm thời (5 phút) — production thì nên dùng DB hoặc Redis
  if (!global.otpStore) global.otpStore = {};
  global.otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Xác thực tài khoản" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Mã OTP xác thực",
      text: `Mã OTP của bạn là: ${otp}. Có hiệu lực trong 5 phút.`,
    });

    console.log(`✅ Gửi OTP ${otp} tới ${email}`);
    return res.json({ success: true, message: "OTP đã được gửi tới email của bạn" });
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    return res.status(500).json({ success: false, message: "Không gửi được OTP" });
  }
};

// ✅ Xác minh OTP email
exports.verifyOtpEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Thiếu email hoặc OTP" });
  }

  const record = global.otpStore?.[email];
  if (!record) {
    return res.status(400).json({ success: false, message: "Không tìm thấy OTP cho email này" });
  }

  if (Date.now() > record.expires) {
    delete global.otpStore[email];
    return res.status(400).json({ success: false, message: "OTP đã hết hạn" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: "OTP không chính xác" });
  }

  // ✅ OTP hợp lệ → xóa khỏi store
  delete global.otpStore[email];
  return res.json({ success: true, message: "OTP hợp lệ" });
};
