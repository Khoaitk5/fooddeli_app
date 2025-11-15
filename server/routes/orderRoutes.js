const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// tất cả route đều dùng POST để không lộ id trên URL
router.post("/get", orderController.getFull);
router.post("/list-mine", orderController.listMine);
router.post("/create", orderController.createEmpty);
router.post("/assign-me", orderController.assignMeAsShipper);
router.post("/update-status", orderController.updateStatus);
router.post("/update-payment-status", orderController.updatePaymentStatus);
router.post("/settled", orderController.markSettled);

// order details
router.post("/details/list", orderController.listDetails);
router.post("/details/add-bulk", orderController.addItems);
router.post("/details/update-quantity", orderController.updateDetailQuantity);
router.post("/details/delete-all", orderController.deleteDetailsByOrder);

// 🆕 Tạo đơn hàng tiền mặt
router.post("/create-cash", orderController.createCashOrder);

// 🆕 Hủy đơn hàng
router.post("/cancel", orderController.cancelOrder);

// 📦 Lấy danh sách orders của shipper (POST để không lộ ID trên URL)
router.post("/shipper/orders", orderController.getOrdersByShipperId);

module.exports = router;
