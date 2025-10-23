// dao/orderVoucherDao.js
const FirestoreDao = require("./firestore_dao");
const OrderVoucher = require("../models/order_voucher");

class OrderVoucherDao extends FirestoreDao {
  constructor() {
    super("order_vouchers", OrderVoucher);
  }

  /**
   * Lấy danh sách voucher áp dụng cho một đơn hàng
   * @param {string} orderId - ID đơn hàng
   * @returns {Promise<object[]>} - Danh sách voucher đã áp dụng
   */
  async getVouchersByOrderId(orderId) {
    const conditions = [{ field: "order_id", operator: "==", value: orderId }];
    return this.findWithConditions(conditions);
  }

  /**
   * Thêm voucher vào đơn hàng
   * @param {string} orderId - ID đơn hàng
   * @param {string} voucherId - ID voucher
   * @returns {Promise<object>} - Bản ghi vừa tạo
   */
  async addVoucherToOrder(orderId, voucherId) {
    return this.create({
      order_id: orderId,
      voucher_id: voucherId,
    });
  }

  /**
   * Xoá toàn bộ voucher áp dụng cho một đơn hàng
   * @param {string} orderId - ID đơn hàng
   * @returns {Promise<number>} - Số bản ghi đã xóa
   */
  async deleteByOrderId(orderId) {
    try {
      const vouchers = await this.getVouchersByOrderId(orderId);
      let count = 0;

      for (const voucher of vouchers) {
        await this.delete(voucher.id);
        count++;
      }

      return count;
    } catch (err) {
      console.error("❌ Error in deleteByOrderId:", err.message);
      throw err;
    }
  }
}

module.exports = new OrderVoucherDao();
