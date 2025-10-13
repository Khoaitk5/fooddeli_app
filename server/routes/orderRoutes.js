const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// CRUD
router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

// Các API đặc biệt
router.get("/user/:userId", orderController.getOrdersByUser);
router.get("/shop/:shopId", orderController.getOrdersByShop);
router.get("/shipper/:shipperId", orderController.getOrdersByShipper);
router.patch("/:id/status", orderController.updateOrderStatus);
router.patch("/:id/assign", orderController.assignShipper);

module.exports = router;
