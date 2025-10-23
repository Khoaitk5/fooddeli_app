const FirestoreDao = require("./firestore_dao");
const Payment = require("../models/payment");
const admin = require("../config/firebase");

class PaymentDao extends FirestoreDao {
  constructor() {
    super("payments", Payment);
  }

  /**
   * 🔍 Lấy danh sách thanh toán theo order_id
   * (Trường hợp mỗi đơn hàng có nhiều giao dịch)
   */
  async getPaymentsByOrderId(orderId) {
    const conditions = [{ field: "order_id", operator: "==", value: orderId }];
    return this.findWithConditions(conditions, "paid_at", "desc");
  }

  /**
   * 💳 Cập nhật trạng thái thanh toán
   * @param {string} paymentId
   * @param {string} status - 'pending' | 'success' | 'failed' | 'refunded'
   * @param {Date|null} paidAt - thời điểm thanh toán (nếu success)
   */
  async updateStatus(paymentId, status, paidAt = null) {
    const allowedStatuses = ["pending", "success", "failed", "refunded"];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid payment status: ${status}`);
    }

    const updateData = { status };
    if (paidAt) {
      updateData.paid_at = admin.firestore.Timestamp.fromDate(new Date(paidAt));
    }

    return this.update(paymentId, updateData);
  }

  /**
   * 💰 Lấy tất cả giao dịch thành công
   * Dành cho admin hoặc thống kê doanh thu
   */
  async getSuccessfulPayments() {
    const conditions = [{ field: "status", operator: "==", value: "success" }];
    return this.findWithConditions(conditions, "paid_at", "desc");
  }
}

module.exports = new PaymentDao();
