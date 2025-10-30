// routes/shipperRoutes.js
const express = require("express");
const router = express.Router();
const shipperController = require("../controllers/shipperController");

// ➕ Đăng ký shipper mới
router.post("/register", shipperController.createShipper);

// 📄 Lấy danh sách shipper
router.get("/list", shipperController.getAllShippers);

// 👤 Lấy thông tin shipper profile của user hiện tại
router.get("/me", shipperController.getMyShipperProfile);

// 📊 Lấy thống kê hiệu suất của shipper
router.get("/stats/:shipperId", shipperController.getShipperStats);

// 💰 Lấy doanh thu theo khoảng thời gian
router.get("/earnings/:shipperId", shipperController.getShipperEarnings);

// 🔍 Lấy shipper theo ID
router.get("/:id", shipperController.getShipperById);

// ✏️ Cập nhật shipper
router.put("/:id", shipperController.updateShipper);

// ❌ Xóa shipper
router.delete("/:id", shipperController.deleteShipper);

module.exports = router;
