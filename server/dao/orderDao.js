// dao/orderDao.js
const GenericDao = require("./generic_dao");
const Order = require("../models/order");

class OrderDao extends GenericDao {
  constructor() {
    // Gọi constructor của GenericDao, truyền tên bảng và model tương ứng
    super("orders", Order);
  }

  /**
   * Lấy tất cả đơn hàng của 1 user (khách hàng)
   * @param {number} userId - ID người dùng
   * @returns {Promise<object[]>} - Danh sách đơn hàng
   */
  async getOrdersByUserId(userId) {
    const query = `
      SELECT * FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [userId]);
    return result.rows;
  }

  /**
   * Lấy tất cả đơn hàng của 1 shop
   * @param {number} shopId - ID shop
   * @returns {Promise<object[]>}
   */
  async getOrdersByShopId(shopId) {
    const query = `
      SELECT * FROM orders
      WHERE shop_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [shopId]);
    return result.rows;
  }

  /**
   * Lấy tất cả đơn hàng của 1 shipper
   * @param {number} shipperId - ID shipper
   * @returns {Promise<object[]>}
   */
  async getOrdersByShipperId(shipperId) {
    const query = `
      SELECT * FROM orders
      WHERE shipper_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [shipperId]);
    return result.rows;
  }

  /**
   * Cập nhật trạng thái đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @param {string} status - Trạng thái mới ('pending','cooking','shipping','completed','cancelled')
   * @returns {Promise<object>} - Đơn hàng sau khi cập nhật
   */
  async updateStatus(orderId, status) {
    const allowedStatuses = ['pending', 'cooking', 'shipping', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
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
    return result.rows[0];
  }

  /**
   * Gán shipper cho đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @param {number} shipperId - ID shipper
   * @returns {Promise<object>} - Đơn hàng sau khi cập nhật
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
    return result.rows[0];
  }
}

module.exports = new OrderDao();
