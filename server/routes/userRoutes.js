// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();

// ✅ Import controller
let userController;
try {
  userController = require("../controllers/userController");
  // console.log("✅ userController.js loaded!");
} catch (err) {
  console.error("❌ Lỗi khi require userController.js:", err);
}

// 📦 Kiểm tra các hàm chính có tồn tại không
// console.log("📦 typeof getUserById:", typeof userController?.getUserById);
// console.log("📦 typeof updateUser:", typeof userController?.updateUser);

// 📡 Route test – dùng để xác minh router có hoạt động
router.get("/ping", (req, res) => {
  res.send("✅ userRoutes hoạt động!");
});

// 📌 Lấy toàn bộ user
router.get("/", async (req, res) => {
  return userController.getAllUsers(req, res);
});

// 📌 Lấy thông tin user theo ID
router.get("/:id", async (req, res) => {
  return userController.getUserById(req, res);
});

// 📌 Cập nhật thông tin user theo ID
router.put("/:id", async (req, res) => {
  return userController.updateUser(req, res);
});

// 📌 Xóa user theo ID
router.delete("/:id", async (req, res) => {
  return userController.deleteUser(req, res);
});

// 📌 Khóa tài khoản user
router.post("/:id/lock", async (req, res) => {
  return userController.lockUserAccount(req, res);
  return userController.lockUserAccount(req, res);
});

// 📌 Tìm user theo username
router.get("/username/:username", async (req, res) => {
  return userController.getUserByUsername(req, res);
});

// 📌 Tìm user theo email
router.get("/email/:email", async (req, res) => {
  return userController.getUserByEmail(req, res);
  return userController.getUserByEmail(req, res);
});

// 📌 Tìm user theo số điện thoại
router.get("/phone/:phone", async (req, res) => {
  return userController.getUserByPhone(req, res);
});


// ✅ Export router
module.exports = router;
