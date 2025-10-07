// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();


const authController = require("../controllers/authController");

// 🟢 Đăng ký tài khoản mới
router.post("/register", authController.register);

// 🔑 Đăng nhập
router.post("/login", authController.login);

// 🔴 Đăng xuất (tuỳ chọn)
router.post("/logout", authController.logout);

// 📱 Bước 1 - xác minh số điện thoại trước khi đăng ký
router.post("/verify-res-phone", authController.verifyResPhone);

// 📲 Bước 2 - xác minh OTP và tạo JWT
router.post("/verify-phone", authController.verifyPhone);

// 📡 Kiểm tra kết nối router
router.get("/ping", (req, res) => {
  res.send("✅ authRoutes hoạt động!");
});



module.exports = router;
