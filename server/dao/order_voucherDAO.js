// dao/orderVoucherDao.js
const GenericDao = require("./generic_dao");
const OrderVoucher = require("../models/order_voucher");

class OrderVoucherDao extends GenericDao {
  constructor() {
    // gọi constructor của GenericDao, truyền tên bảng và model tương ứng
    super("order_vouchers", OrderVoucher);
  }

  /**
   * Lấy danh sách voucher áp dụng cho một đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @returns {Promise<object[]>} - Danh sách voucher đã áp dụng
   */
  async getVouchersByOrderId(orderId) {
    const query = `
      SELECT v.*
      FROM order_vouchers ov
      JOIN vouchers v ON ov.voucher_id = v.voucher_id
      WHERE ov.order_id = $1;
    `;
    const result = await this.db.query(query, [orderId]);
    return result.rows;
  }

  /**
   * Thêm voucher vào đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @param {number} voucherId - ID voucher
   * @returns {Promise<object>} - Bản ghi vừa tạo
   */
  async addVoucherToOrder(orderId, voucherId) {
    const query = `
      INSERT INTO order_vouchers (order_id, voucher_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await this.db.query(query, [orderId, voucherId]);
    return result.rows[0];
  }

  /**
   * Xoá toàn bộ voucher áp dụng cho một đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @returns {Promise<number>} - Số bản ghi đã xóa
   */
  async deleteByOrderId(orderId) {
    const query = `
      DELETE FROM order_vouchers
      WHERE order_id = $1;
    `;
    const result = await this.db.query(query, [orderId]);
    return result.rowCount;
  }
}

module.exports = new OrderVoucherDao();
