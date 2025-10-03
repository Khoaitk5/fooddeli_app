// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 🟢 Đăng ký tài khoản mới
router.post("/register", authController.register);

// 🔑 Đăng nhập
router.post("/login", authController.login);

// 🔴 Đăng xuất (tuỳ chọn)
router.post("/logout", authController.logout);

router.post("/verify-res-phone", authController.verifyResPhone);

router.post("/verify-phone", authController.verifyPhone);

module.exports = router;
