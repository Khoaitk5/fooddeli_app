const GenericDao = require("./generic_dao");
const Order = require("../models/order");
const pool = require("../config/db");

class OrderDao extends GenericDao {
  constructor() {
    super("orders", Order);
    this.db = pool;
  }

  /**
   * 🔍 Lấy tất cả đơn hàng của 1 user (khách hàng)
   */
  async getOrdersByUserId(userId) {
    const query = `
      SELECT * FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [userId]);
    return result.rows.map(row => new Order(row));
  }

  /**
   * 🔍 Lấy tất cả đơn hàng của 1 shop
   */
  async getOrdersByShopId(shopId) {
    const query = `
      SELECT * FROM orders
      WHERE shop_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [shopId]);
    return result.rows.map(row => new Order(row));
  }

  /**
   * 🔍 Lấy tất cả đơn hàng của 1 shipper
   */
  async getOrdersByShipperId(shipperId) {
    const query = `
      SELECT * FROM orders
      WHERE shipper_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [shipperId]);
    return result.rows.map(row => new Order(row));
  }

  /**
   * 🚚 Gán shipper cho đơn hàng
   */
  async assignShipper(orderId, shipperId) {
    const query = `
      UPDATE orders
      SET shipper_id = $1,
          updated_at = NOW()
      WHERE order_id = $2
      RETURNING *;
    `;
    const result = await this.db.query(query, [shipperId, orderId]);
    return result.rows[0] ? new Order(result.rows[0]) : null;
  }

  /**
   * 🔁 Cập nhật trạng thái đơn hàng
   */
  async updateStatus(orderId, status) {
    const allowed = ['pending', 'cooking', 'shipping', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const query = `
      UPDATE orders
      SET status = $1,
          updated_at = NOW()
      WHERE order_id = $2
      RETURNING *;
    `;
    const result = await this.db.query(query, [status, orderId]);
    return result.rows[0] ? new Order(result.rows[0]) : null;
  }

  /**
   * 💰 Cập nhật trạng thái thanh toán
   */
  async updatePaymentStatus(orderId, paymentStatus, paymentId = null) {
    const allowed = ['unpaid', 'paid', 'refunded'];
    if (!allowed.includes(paymentStatus)) {
      throw new Error(`Invalid payment status: ${paymentStatus}`);
    }

    const query = `
      UPDATE orders
      SET payment_status = $1,
          payment_id = COALESCE($2, payment_id),
          updated_at = NOW()
      WHERE order_id = $3
      RETURNING *;
    `;
    const result = await this.db.query(query, [paymentStatus, paymentId, orderId]);
    return result.rows[0] ? new Order(result.rows[0]) : null;
  }

  /**
   * ✅ Đánh dấu đơn hàng đã settle (chia tiền xong)
   */
  async markSettled(orderId) {
    const query = `
      UPDATE orders
      SET is_settled = TRUE,
          settled_at = NOW(),
          updated_at = NOW()
      WHERE order_id = $1
      RETURNING *;
    `;
    const result = await this.db.query(query, [orderId]);
    return result.rows[0] ? new Order(result.rows[0]) : null;
  }
}

module.exports = new OrderDao();
