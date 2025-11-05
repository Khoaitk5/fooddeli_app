// routes/shopRoutes.js
const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

// 🏪 Tạo cửa hàng mới (dành cho user có role = 'shop')
router.post("/create", shopController.createShopProfile);

// 🔍 Lấy thông tin shop của user hiện tại
router.get("/me", shopController.getMyShop);

// 📋 Lấy danh sách tất cả cửa hàng
router.get("/list", shopController.getAllShops);

// 🍱 Lấy shops theo loại món ăn (query: ?foodType=Đồ Ăn Nhanh)
router.get("/by-food-type", shopController.getShopsByFoodType);

// 🔍 Lấy chi tiết cửa hàng (ẩn ID khỏi URL)
router.post("/detail", shopController.getShopDetail);

// ✏️ Cập nhật thông tin cửa hàng
router.put("/update", shopController.updateShopInfo);

// 🔄 Cập nhật trạng thái cửa hàng (open/closed/pending)
router.put("/update-status", shopController.updateShopStatus);

// 📍 Lấy danh sách cửa hàng gần người dùng
router.post("/nearby", shopController.getNearbyShops);

// 🏠 Gán địa chỉ cho cửa hàng
router.post("/assign-address", shopController.assignAddressToShop);

// ❌ Xóa cửa hàng (ẩn ID)
router.delete("/delete", shopController.deleteShop);

module.exports = router;
