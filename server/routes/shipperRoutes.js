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

// 📊 Lấy điểm và xếp hạng của shipper hiện tại
router.get("/score/me", shipperController.getMyShipperScore);

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

// lấy toàn bộ đơn của shipper kèm chi tiết, user, shop
router.post("/orders/nearby", shipperController.listNearbyCookingFull);

// lấy orders của 1 shipper (enriched: details, shop, customer, distances/durations)
router.post("/orders/by-shipper", shipperController.listOrdersByShipperFull);

// routes/shipperRoutes.js
router.post("/orders/accept", shipperController.acceptOrder); // ➕ thêm dòng này

router.post('/orders/pickup', shipperController.pickupOrder);

router.post("/orders/complete", shipperController.completeOrder);

// 🗺️ Lấy thông tin quãng đường và thời gian
router.post("/route-info", shipperController.getRouteInfo);

module.exports = router;
