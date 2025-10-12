// console.log("📁 Đã load file authController.js từ:", __filename);

const authService = require("../services/authService");
const userService = require("../services/userService");
const {
  getUserById,
  getUserByEmail,
  getUserByPhone,
} = require("../services/userService");
const jwt = require("jsonwebtoken");
const { createSession } = require("../services/sessionService");

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
    const body = { ...req.body };

    // 🧩 Nếu FE gửi address dạng object (FE AddAddress)
    if (typeof body.address === "object" && body.address !== null) {
      const {
        address_line,
        note,
        addressType,
        address_type,
        is_primary,
      } = body.address;

      // 🔍 DEBUG: In ra dữ liệu thô từ FE
      // console.log("🕵️‍♀️ [DEBUG] Raw address từ FE:", JSON.stringify(body.address, null, 2));
      // console.log("📍 [DEBUG] address_line nhận từ FE:", JSON.stringify(address_line, null, 2));

      // ✅ Nếu FE gửi address_line là object, gán đúng cấu trúc
      if (typeof address_line === "object" && address_line !== null) {
        const { detail, ward, district, city } = address_line;

        // console.log("📍 [DEBUG] Các trường detail/ward/district/city:");
        // console.log("   • detail:", detail);
        // console.log("   • ward:", ward);
        // console.log("   • district:", district);
        // console.log("   • city:", city);

        body.address_line = {
          detail: detail || "",
          ward: ward || "",
          district: district || "",
          city: city || "",
        };
      }

      body.note = note || "";
      body.address_type = addressType || address_type || "Nhà";
      body.is_primary = is_primary ?? false;

      delete body.address; // dọn sạch payload
    }

    // console.log("🧩 [DEBUG] Body gửi sang service:", JSON.stringify(body, null, 2));


    // 🧩 Gọi service xử lý đăng ký
    const newUser = await authService.register(body);

    // ✅ Tạo session
    createSession(req, newUser);

    // ✅ Trả kết quả về cho FE
    res.status(201).json({
      success: true,
      message: "✅ Đăng ký tài khoản thành công",
      user: {
        id: newUser.id,
        username: newUser.username,
        full_name: newUser.fullname,
        phone: newUser.phone,
        email: newUser.email,
        address: newUser.address, // JSON hoặc null
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
 * 🔐 Đăng nhập bằng số điện thoại và mật khẩu
 */
exports.loginWithPassword = async (req, res) => {
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
        message: "❌ Số điện thoại hoặc mật khẩu không chính xác",
      });
    }

    // ✅ Tạo JWT
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Tạo session
    createSession(req, user);

    return res.status(200).json({
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
      token,
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server. Vui lòng thử lại sau.",
    });
  }
};

/**
 * 🔑 Tạo JWT
 */
const generateJwt = (user) => {
  return jwt.sign(
    { id: user.id || user._id, phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * 📞 Xác thực số điện thoại bằng Firebase
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
    const user = await getUserByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "📱 Tài khoản chưa tồn tại. Vui lòng đăng ký trước.",
      });
    }

    // ✅ Tạo session & JWT
    createSession(req, user);
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
 * 🌐 Đăng nhập bằng Google
 */
exports.loginWithGoogle = async (req, res) => {
  const { token } = req.body;

  try {
    if (!admin) {
      return res.status(500).json({
        success: false,
        message: "Firebase Admin chưa được khởi tạo.",
      });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;
    const name = decoded.name;
    const picture = decoded.picture;

    console.log("✅ Firebase xác thực thành công:", { email, name });

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "❌ Tài khoản Google này chưa tồn tại trong hệ thống.",
      });
    }

    createSession(req, user);

    return res.status(200).json({
      success: true,
      message: "✅ Đăng nhập Google thành công",
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        avatar: picture,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi đăng nhập Google:", error);
    return res.status(401).json({
      success: false,
      message: "❌ Token Google không hợp lệ hoặc đã hết hạn.",
    });
  }
};

/**
 * 🌱 Đăng ký tài khoản mới bằng Google
 */
exports.registerWithGoogle = async (req, res) => {
  const { token } = req.body;

  try {
    if (!admin) {
      return res.status(500).json({
        success: false,
        message: "Firebase Admin chưa được khởi tạo.",
      });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;
    const name = decoded.name;
    const picture = decoded.picture;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Tài khoản Google này đã tồn tại, hãy đăng nhập thay vì đăng ký.",
      });
    }

    const newUser = await authService.register({
      username: email.split("@")[0],
      fullname: name,
      email,
      password: Math.random().toString(36).slice(-8),
      role: "user",
    });

    createSession(req, newUser);

    return res.status(201).json({
      success: true,
      message: "✅ Đăng ký Google thành công. Vui lòng nhập thêm thông tin.",
      user: {
        id: newUser.id,
        full_name: name,
        email,
        avatar: picture,
      },
      needAdditionalInfo: true,
    });
  } catch (error) {
    console.error("❌ Lỗi đăng ký Google:", error);
    return res.status(401).json({
      success: false,
      message: "Token Google không hợp lệ hoặc hết hạn.",
    });
  }
};

/**
 * 🔴 Đăng xuất
 */
exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Lỗi khi xóa session:", err);
        return res.status(500).json({
          success: false,
          message: "Lỗi khi đăng xuất",
        });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({
        success: true,
        message: "👋 Đăng xuất thành công",
      });
    });
  } catch (err) {
    console.error("❌ Lỗi logout:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đăng xuất",
    });
  }
};

/**
 * ✉️ Gửi OTP qua email
 */
exports.sendOtpEmail = async (req, res) => {
  const nodemailer = require("nodemailer");
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email là bắt buộc" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
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
    return res.json({
      success: true,
      message: "OTP đã được gửi tới email của bạn",
    });
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    return res
      .status(500)
      .json({ success: false, message: "Không gửi được OTP" });
  }
};

/**
 * 📨 Xác minh OTP Email
 */
exports.verifyOtpEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu email hoặc OTP" });
  }

  const record = global.otpStore?.[email];
  if (!record) {
    return res
      .status(400)
      .json({ success: false, message: "Không tìm thấy OTP cho email này" });
  }

  if (Date.now() > record.expires) {
    delete global.otpStore[email];
    return res.status(400).json({ success: false, message: "OTP đã hết hạn" });
  }

  if (record.otp !== otp) {
    return res
      .status(400)
      .json({ success: false, message: "OTP không chính xác" });
  }

  delete global.otpStore[email];
  return res.json({ success: true, message: "OTP hợp lệ" });
};
