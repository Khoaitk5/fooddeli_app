// services/orderService.js
const orderDao = require("../dao/orderDao");

const orderService = {
  /**
   * ➕ Tạo đơn hàng mới
   * @param {object} orderData - { user_id, shop_id, total_price, status, payment_method }
   * @returns {Promise<object>}
   */
  async createOrder(orderData) {
    return await orderDao.create(orderData);
  },

  /**
   * 📦 Lấy đơn hàng theo ID
   * @param {number} orderId
   * @returns {Promise<object|null>}
   */
  async getOrderById(orderId) {
    return await orderDao.findById(orderId);
  },

  /**
   * 📜 Lấy tất cả đơn hàng
   * @returns {Promise<object[]>}
   */
  async getAllOrders() {
    return await orderDao.findAll();
  },

  /**
   * 📍 Lấy tất cả đơn hàng của 1 user (khách hàng)
   * @param {number} userId
   * @returns {Promise<object[]>}
   */
  async getOrdersByUserId(userId) {
    return await orderDao.getOrdersByUserId(userId);
  },

  /**
   * 🏪 Lấy tất cả đơn hàng của 1 shop
   * @param {number} shopId
   * @returns {Promise<object[]>}
   */
  async getOrdersByShopId(shopId) {
    return await orderDao.getOrdersByShopId(shopId);
  },

  /**
   * 🚚 Lấy tất cả đơn hàng của 1 shipper
   * @param {number} shipperId
   * @returns {Promise<object[]>}
   */
  async getOrdersByShipperId(shipperId) {
    return await orderDao.getOrdersByShipperId(shipperId);
  },

  /**
   * ✏️ Cập nhật thông tin đơn hàng
   * @param {number} orderId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateOrder(orderId, updateData) {
    const existing = await orderDao.findById(orderId);
    if (!existing) {
      throw new Error("Đơn hàng không tồn tại");
    }
    return await orderDao.update(orderId, updateData);
  },

  /**
   * 🗑️ Xóa đơn hàng
   * @param {number} orderId
   * @returns {Promise<boolean>}
   */
  async deleteOrder(orderId) {
    const existing = await orderDao.findById(orderId);
    if (!existing) {
      throw new Error("Đơn hàng không tồn tại");
    }
    return await orderDao.delete(orderId);
  },

  /**
   * 🔄 Cập nhật trạng thái đơn hàng
   * @param {number} orderId
   * @param {string} status - ('pending','cooking','shipping','completed','cancelled')
   * @returns {Promise<object>}
   */
  async updateOrderStatus(orderId, status) {
    const existing = await orderDao.findById(orderId);
    if (!existing) {
      throw new Error("Đơn hàng không tồn tại");
    }
    return await orderDao.updateStatus(orderId, status);
  },

  /**
   * 🚚 Gán shipper cho đơn hàng
   * @param {number} orderId
   * @param {number} shipperId
   * @returns {Promise<object>}
   */
  async assignShipper(orderId, shipperId) {
    const existing = await orderDao.findById(orderId);
    if (!existing) {
      throw new Error("Đơn hàng không tồn tại");
    }
    return await orderDao.assignShipper(orderId, shipperId);
  },
};

module.exports = orderService;
