const voucherService = require("../services/voucherService");

/**
 * 📋 Lấy toàn bộ voucher
 */
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await voucherService.getAllVouchers();
    res.json({ success: true, vouchers });
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách voucher:", err);
    res.status(500).json({ success: false, message: "Không thể lấy danh sách voucher." });
  }
};

/**
 * ✅ Lấy voucher còn hiệu lực
 */
exports.getActiveVouchers = async (req, res) => {
  try {
    const vouchers = await voucherService.getActiveVouchers();
    res.json({ success: true, vouchers });
  } catch (err) {
    console.error("❌ Lỗi lấy voucher còn hiệu lực:", err);
    res.status(500).json({ success: false, message: "Không thể lấy voucher còn hiệu lực." });
  }
};

/**
 * 🔍 Tìm voucher theo mã
 */
exports.getVoucherByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const voucher = await voucherService.getVoucherByCode(code);
    if (!voucher) {
      return res.status(404).json({ success: false, message: "Không tìm thấy voucher." });
    }
    res.json({ success: true, voucher });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * 🧮 Kiểm tra hợp lệ voucher theo giá trị đơn hàng
 */
exports.validateVoucher = async (req, res) => {
  try {
    const { code, orderValue } = req.query;
    const voucher = await voucherService.validateVoucher(code, parseFloat(orderValue || 0));
    res.json({ success: true, voucher });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * ➕ Tạo voucher mới
 */
exports.createVoucher = async (req, res) => {
  try {
    const newVoucher = await voucherService.createVoucher(req.body);
    res.json({ success: true, message: "Tạo voucher thành công", voucher: newVoucher });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * ✏️ Cập nhật voucher
 */
exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await voucherService.updateVoucher(id, req.body);
    res.json({ success: true, message: "Cập nhật thành công", voucher: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * 🗑️ Xóa voucher
 */
exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    await voucherService.deleteVoucher(id);
    res.json({ success: true, message: "Xóa voucher thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * 🚫 Vô hiệu hóa voucher
 */
exports.disableVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await voucherService.disableVoucher(id);
    res.json({ success: true, voucher });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * ⏰ Hết hạn tự động voucher quá hạn
 */
exports.expireOutdatedVouchers = async (req, res) => {
  try {
    const count = await voucherService.expireOutdatedVouchers();
    res.json({ success: true, message: `Đã hết hạn ${count} voucher quá hạn.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Không thể cập nhật trạng thái voucher." });
  }
};
