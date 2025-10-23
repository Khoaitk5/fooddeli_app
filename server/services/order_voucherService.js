// services/orderVoucherService.js
const orderVoucherDao = require("../dao/order_voucherDAO");

const orderVoucherService = {
  /**
   * ➕ Thêm voucher vào đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @param {number} voucherId - ID voucher
   * @returns {Promise<object>}
   */
  async addVoucherToOrder(orderId, voucherId) {
    if (!orderId || !voucherId) {
      throw new Error("orderId và voucherId là bắt buộc");
    }
    return await orderVoucherDao.addVoucherToOrder(orderId, voucherId);
  },

  /**
   * 📜 Lấy tất cả voucher áp dụng cho một đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @returns {Promise<object[]>}
   */
  async getVouchersByOrderId(orderId) {
    return await orderVoucherDao.getVouchersByOrderId(orderId);
  },

  /**
   * 🗑️ Xóa toàn bộ voucher áp dụng cho một đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @returns {Promise<number>} - Số bản ghi đã xóa
   */
  async deleteVouchersByOrderId(orderId) {
    return await orderVoucherDao.deleteByOrderId(orderId);
  },

  /**
   * 🗑️ Xóa một voucher cụ thể khỏi đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @param {number} voucherId - ID voucher
   * @returns {Promise<boolean>}
   */
  async deleteSpecificVoucher(orderId, voucherId) {
    const vouchers = await orderVoucherDao.getVouchersByOrderId(orderId);
    const target = vouchers.find(v => v.voucher_id === voucherId);
    
    if (!target) {
      throw new Error("Voucher này không áp dụng cho đơn hàng");
    }

    await orderVoucherDao.delete(target.id);
    return true;
  }
};

module.exports = orderVoucherService;
