const FirestoreDao = require("./firestore_dao");
const Order = require("../models/order");
const admin = require("../config/firebase");

class OrderDao extends FirestoreDao {
  constructor() {
    super("orders", Order);
  }

  /**
   * 🔍 Lấy tất cả đơn hàng của 1 user (khách hàng)
   */
  async getOrdersByUserId(userId) {
    const conditions = [{ field: "user_id", operator: "==", value: userId }];
    return this.findWithConditions(conditions, "created_at", "desc");
  }

  /**
   * 🔍 Lấy tất cả đơn hàng của 1 shop
   */
  async getOrdersByShopId(shopId) {
    const conditions = [{ field: "shop_id", operator: "==", value: shopId }];
    return this.findWithConditions(conditions, "created_at", "desc");
  }

  /**
   * 🔍 Lấy tất cả đơn hàng của 1 shipper
   */
  async getOrdersByShipperId(shipperId) {
    const conditions = [{ field: "shipper_id", operator: "==", value: shipperId }];
    return this.findWithConditions(conditions, "created_at", "desc");
  }

  /**
   * 🚚 Gán shipper cho đơn hàng
   */
  async assignShipper(orderId, shipperId) {
    return this.update(orderId, { shipper_id: shipperId });
  }

  /**
   * 🔁 Cập nhật trạng thái đơn hàng
   */
  async updateStatus(orderId, status) {
    const allowed = ['pending', 'cooking', 'shipping', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    return this.update(orderId, { status });
  }

  /**
   * 💰 Cập nhật trạng thái thanh toán
   */
  async updatePaymentStatus(orderId, paymentStatus, paymentId = null) {
    const allowed = ['unpaid', 'paid', 'refunded'];
    if (!allowed.includes(paymentStatus)) {
      throw new Error(`Invalid payment status: ${paymentStatus}`);
    }

    const updateData = { payment_status: paymentStatus };
    if (paymentId) updateData.payment_id = paymentId;

    return this.update(orderId, updateData);
  }

  /**
   * ✅ Đánh dấu đơn hàng đã settle (chia tiền xong)
   */
  async markSettled(orderId) {
    return this.update(orderId, {
      is_settled: true,
      settled_at: admin.firestore.Timestamp.now(),
    });
  }
}

module.exports = new OrderDao();
