// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();

// ✅ Import controller
let userController;
try {
  userController = require("../controllers/userController");
  console.log("✅ userController.js loaded!");
  console.log("✅ Controller path:", require.resolve("../controllers/userController"));
} catch (err) {
  console.error("❌ Lỗi khi require userController.js:", err);
}

// 📡 Route test – dùng để xác minh router có hoạt động
router.get("/ping", (req, res) => {
  res.send("✅ userRoutes hoạt động!");
});

// 📌 Lấy tất cả user (chỉ admin mới được dùng nếu cần)
router.get("/", userController.getAllUsers);

// 📌 Lấy thông tin user hiện tại từ session
router.get("/me", userController.getCurrentUser);

// 📌 Cập nhật thông tin user hiện tại
router.put("/me", userController.updateCurrentUser);

// 📌 Xoá tài khoản user hiện tại
router.delete("/me", userController.deleteCurrentUser);

// 📌 Khoá tài khoản user hiện tại
router.post("/me/lock", userController.lockCurrentUser);

// 📌 Tìm user theo username
router.get("/username/:username", userController.getUserByUsername);

// 📌 Tìm user theo email
router.get("/email/:email", userController.getUserByEmail);

// 📌 Tìm user theo số điện thoại
router.get("/phone/:phone", userController.getUserByPhone);

module.exports = router;
