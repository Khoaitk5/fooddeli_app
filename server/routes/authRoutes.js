// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 🟢 Đăng ký tài khoản mới
router.post("/register", authController.register);

// 🔑 Đăng nhập
router.post("/login-password", authController.loginWithPassword);

// 🔴 Đăng xuất (tuỳ chọn)
router.post("/logout", authController.logout);


// 📲 Bước 2 - xác minh OTP và tạo JWT
router.post("/verify-phone", authController.verifyPhone);

// 📩 Gửi OTP email
router.post("/send-otp-email", authController.sendOtpEmail);

// ✅ Xác minh OTP email
router.post("/verify-otp-email", authController.verifyOtpEmail);

router.post("/google", authController.loginWithGoogle);

router.post("/google-register", authController.registerWithGoogle);

router.post("/check-phone", authController.checkPhoneExists);

router.post("/check-email", authController.checkEmailExists);




module.exports = router;
