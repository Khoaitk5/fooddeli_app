// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 📌 Lấy thông tin user theo ID (vd: id = 4)
router.get("/:id", userController.getUserById);

// 📌 Cập nhật thông tin user theo ID
router.put("/:id", userController.updateUser);

module.exports = router;
