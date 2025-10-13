const paymentDao = require("../dao/paymentDao");
const orderService = require("./orderService");

const paymentService = {
  /**
   * ➕ Tạo giao dịch thanh toán mới
   * @param {object} data - { order_id, provider, transaction_code, amount, status }
   * @returns {Promise<object>} - Payment record
   */
  async createPayment(data) {
    if (!data.order_id || !data.provider || !data.amount) {
      throw new Error("Thiếu thông tin bắt buộc: order_id, provider, amount");
    }

    // Đảm bảo status hợp lệ
    const allowedStatuses = ["pending", "success", "failed", "refunded"];
    if (data.status && !allowedStatuses.includes(data.status)) {
      throw new Error(`Trạng thái thanh toán không hợp lệ: ${data.status}`);
    }

    const payment = await paymentDao.create({
      ...data,
      status: data.status || "pending",
    });

    // Nếu thanh toán thành công ngay, cập nhật luôn order
    if (payment.status === "success") {
      await orderService.updatePaymentStatus(payment.order_id, "paid", payment.id);
    }

    return payment;
  },

  /**
   * 🔍 Lấy thông tin thanh toán theo ID
   * @param {number} paymentId
   */
  async getPaymentById(paymentId) {
    return await paymentDao.findById("id", paymentId);
  },

  /**
   * 📦 Lấy danh sách thanh toán theo đơn hàng
   * @param {number} orderId
   */
  async getPaymentsByOrderId(orderId) {
    return await paymentDao.getPaymentsByOrderId(orderId);
  },

  /**
   * 💰 Lấy tất cả giao dịch thanh toán thành công
   */
  async getSuccessfulPayments() {
    return await paymentDao.getSuccessfulPayments();
  },

  /**
   * 🔄 Cập nhật trạng thái thanh toán
   * Khi VNPay / MoMo callback kết quả, gọi hàm này.
   * @param {number} paymentId
   * @param {string} status - 'pending' | 'success' | 'failed' | 'refunded'
   * @param {Date|null} paidAt
   */
  async updatePaymentStatus(paymentId, status, paidAt = null) {
    const updated = await paymentDao.updateStatus(paymentId, status, paidAt);
    if (!updated) {
      throw new Error("Không tìm thấy giao dịch thanh toán để cập nhật");
    }

    // Nếu giao dịch thành công → cập nhật trạng thái đơn hàng
    if (status === "success") {
      await orderService.updatePaymentStatus(updated.order_id, "paid", paymentId);
    }

    // Nếu hoàn tiền → cập nhật lại đơn hàng
    if (status === "refunded") {
      await orderService.updatePaymentStatus(updated.order_id, "refunded", paymentId);
    }

    return updated;
  },

  /**
   * 🧾 Hoàn tiền (refund)
   * @param {number} paymentId
   */
  async refundPayment(paymentId) {
    const payment = await paymentDao.findById("id", paymentId);
    if (!payment) throw new Error("Không tìm thấy giao dịch để hoàn tiền");

    if (payment.status !== "success") {
      throw new Error("Chỉ có thể hoàn tiền cho giao dịch thành công");
    }

    const refunded = await paymentDao.updateStatus(paymentId, "refunded", new Date());
    await orderService.updatePaymentStatus(payment.order_id, "refunded", paymentId);

    return refunded;
  },
};

module.exports = paymentService;
