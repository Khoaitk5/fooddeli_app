const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// 📝 Tạo đánh giá cho đơn hàng
router.post("/order", reviewController.createOrderReview);

// 🚚 Tạo đánh giá cho shipper
router.post("/shipper", reviewController.createShipperReview);

// � Tạo đánh giá cho customer (từ shipper)
router.post("/user", reviewController.createUserReview);

// �📋 Lấy đánh giá của tôi
router.get("/my-reviews", reviewController.getMyReviews);

// 📊 Lấy thống kê đánh giá cho shop
router.get("/shop/:shopId/stats", reviewController.getShopReviewStats);

// 📊 Lấy thống kê đánh giá cho shipper
router.get("/shipper/:shipperId/stats", reviewController.getShipperReviewStats);

// 📊 Lấy thống kê đánh giá cho user
router.get("/user/:userId/stats", reviewController.getUserReviewStats);

// ✅ Kiểm tra trạng thái đánh giá cho đơn hàng
router.get("/order/:orderId/status", reviewController.checkOrderReviewStatus);

module.exports = router;