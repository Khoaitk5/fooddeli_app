// dao/orderDetailDao.js
const GenericDao = require("./generic_dao");
const OrderDetail = require("../models/order_detail");

class OrderDetailDao extends GenericDao {
  constructor() {
    // gọi constructor của GenericDao, truyền tên bảng và model tương ứng
    super("order_details", OrderDetail);
  }

  /**
   * Lấy danh sách chi tiết đơn hàng theo order_id
   * @param {number} orderId - ID của đơn hàng
   * @returns {Promise<object[]>} - Danh sách các dòng chi tiết đơn hàng
   */
  async getByOrderId(orderId) {
    const query = `
      SELECT * FROM order_details
      WHERE order_id = $1
      ORDER BY created_at ASC;
    `;
    const result = await this.db.query(query, [orderId]);
    return result.rows;
  }

  /**
   * Cập nhật số lượng và tổng tiền cho một dòng sản phẩm trong đơn hàng
   * @param {number} detailId - ID dòng chi tiết
   * @param {number} quantity - Số lượng mới
   * @returns {Promise<object>} - Chi tiết đơn hàng sau khi cập nhật
   */
  async updateQuantity(detailId, quantity) {
    if (quantity <= 0) throw new Error("Số lượng phải lớn hơn 0");

    const query = `
      UPDATE order_details
      SET quantity = $1,
          line_total = unit_price * $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await this.db.query(query, [quantity, detailId]);
    return result.rows[0];
  }

  /**
   * Xóa tất cả chi tiết theo đơn hàng (khi huỷ đơn)
   * @param {number} orderId - ID đơn hàng
   * @returns {Promise<number>} - Số dòng chi tiết đã bị xóa
   */
  async deleteByOrderId(orderId) {
    const query = `
      DELETE FROM order_details
      WHERE order_id = $1;
    `;
    const result = await this.db.query(query, [orderId]);
    return result.rowCount;
  }
}

module.exports = new OrderDetailDao();
