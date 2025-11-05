const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");

// 📋 Lấy tất cả voucher
router.get("/", voucherController.getAllVouchers);

// ✅ Lấy voucher còn hiệu lực
router.get("/active", voucherController.getActiveVouchers);

// 🔍 Tìm voucher theo code
router.get("/code/:code", voucherController.getVoucherByCode);

// 🧮 Kiểm tra voucher hợp lệ (theo đơn hàng)
router.get("/validate", voucherController.validateVoucher);

// ➕ Tạo mới voucher
router.post("/", voucherController.createVoucher);

// ✏️ Cập nhật voucher
router.put("/:id", voucherController.updateVoucher);

// 🗑️ Xóa voucher
router.delete("/:id", voucherController.deleteVoucher);

// 🚫 Vô hiệu hóa voucher
router.post("/:id/disable", voucherController.disableVoucher);

// ⏰ Hết hạn tự động
router.post("/expire", voucherController.expireOutdatedVouchers);

module.exports = router;
