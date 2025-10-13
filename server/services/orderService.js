const orderDao = require("../dao/orderDao");

const orderService = {
  /**
   * ➕ Tạo đơn hàng mới
   * @param {object} orderData - { user_id, shop_id, food_price, delivery_fee, total_price, payment_method, ... }
   */
  async createOrder(orderData) {
    // Tự tính chia tiền (nếu cần)
    const merchant_commission_rate = orderData.merchant_commission_rate || 0.25;
    const shipper_commission_rate = orderData.shipper_commission_rate || 0.15;

    const merchant_earn = (orderData.food_price || 0) * (1 - merchant_commission_rate);
    const shipper_earn = (orderData.delivery_fee || 0) * (1 - shipper_commission_rate);
    const admin_earn = (orderData.total_price || 0) - (merchant_earn + shipper_earn);

    return await orderDao.create({
      ...orderData,
      merchant_commission_rate,
      shipper_commission_rate,
      merchant_earn,
      shipper_earn,
      admin_earn,
    });
  },

  /**
   * 📦 Lấy đơn hàng theo ID
   */
  async getOrderById(orderId) {
    return await orderDao.findById("order_id", orderId);
  },

  /**
   * 📜 Lấy tất cả đơn hàng
   */
  async getAllOrders() {
    return await orderDao.findAll();
  },

  /**
   * 📍 Lấy đơn hàng của user
   */
  async getOrdersByUserId(userId) {
    return await orderDao.getOrdersByUserId(userId);
  },

  /**
   * 🏪 Lấy đơn hàng của shop
   */
  async getOrdersByShopId(shopId) {
    return await orderDao.getOrdersByShopId(shopId);
  },

  /**
   * 🚚 Lấy đơn hàng của shipper
   */
  async getOrdersByShipperId(shipperId) {
    return await orderDao.getOrdersByShipperId(shipperId);
  },

  /**
   * ✏️ Cập nhật thông tin đơn hàng
   */
  async updateOrder(orderId, updateData) {
    const updated = await orderDao.update("order_id", orderId, updateData);
    if (!updated) throw new Error("Đơn hàng không tồn tại");
    return updated;
  },

  /**
   * 🗑️ Xóa đơn hàng
   */
  async deleteOrder(orderId) {
    const deleted = await orderDao.delete("order_id", orderId);
    if (!deleted) throw new Error("Đơn hàng không tồn tại");
    return deleted;
  },

  /**
   * 🔄 Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(orderId, status) {
    const updated = await orderDao.updateStatus(orderId, status);
    if (!updated) throw new Error("Đơn hàng không tồn tại hoặc không thể cập nhật trạng thái");
    return updated;
  },

  /**
   * 🚚 Gán shipper cho đơn hàng
   */
  async assignShipper(orderId, shipperId) {
    const updated = await orderDao.assignShipper(orderId, shipperId);
    if (!updated) throw new Error("Đơn hàng không tồn tại hoặc không thể gán shipper");
    return updated;
  },

  /**
   * 💰 Cập nhật trạng thái thanh toán
   */
  async updatePaymentStatus(orderId, paymentStatus, paymentId = null) {
    const updated = await orderDao.updatePaymentStatus(orderId, paymentStatus, paymentId);
    if (!updated) throw new Error("Không thể cập nhật trạng thái thanh toán");
    return updated;
  },

  /**
   * ✅ Đánh dấu đơn hàng đã settle (chia tiền xong)
   */
  async markSettled(orderId) {
    const updated = await orderDao.markSettled(orderId);
    if (!updated) throw new Error("Không thể đánh dấu settle cho đơn hàng");
    return updated;
  },
};

module.exports = orderService;
