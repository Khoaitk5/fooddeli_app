const GenericDao = require("./generic_dao");
const Payment = require("../models/payment");
const pool = require("../config/db");

class PaymentDao extends GenericDao {
  constructor() {
    super("payments", Payment);
    pool = pool;
  }

  /**
   * 🔍 Lấy danh sách thanh toán theo order_id
   * (Trường hợp mỗi đơn hàng có nhiều giao dịch)
   */
  async getPaymentsByOrderId(orderId) {
    const query = `
      SELECT * FROM payments
      WHERE order_id = $1
      ORDER BY paid_at DESC NULLS LAST;
    `;
    const result = await pool.query(query, [orderId]);
    return result.rows.map(row => new Payment(row));
  }

  /**
   * 💳 Cập nhật trạng thái thanh toán
   * @param {number} paymentId
   * @param {string} status - 'pending' | 'success' | 'failed' | 'refunded'
   * @param {Date|null} paidAt - thời điểm thanh toán (nếu success)
   */
  async updateStatus(paymentId, status, paidAt = null) {
    const allowedStatuses = ["pending", "success", "failed", "refunded"];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid payment status: ${status}`);
    }

    const query = `
      UPDATE payments
      SET status = $1,
          paid_at = $2,
          amount = amount, -- giữ nguyên amount
          transaction_code = transaction_code, -- giữ nguyên mã giao dịch
          provider = provider, -- giữ nguyên provider
          order_id = order_id, -- giữ nguyên order
          -- (updated_at có thể thêm nếu bạn muốn theo dõi)
          -- updated_at = NOW(),
          id = id
      WHERE id = $3
      RETURNING *;
    `;

    const result = await pool.query(query, [status, paidAt, paymentId]);
    return result.rows[0] ? new Payment(result.rows[0]) : null;
  }

  /**
   * 💰 Lấy tất cả giao dịch thành công
   * Dành cho admin hoặc thống kê doanh thu
   */
  async getSuccessfulPayments() {
    const query = `
      SELECT * FROM payments
      WHERE status = 'success'
      ORDER BY paid_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows.map(row => new Payment(row));
  }
}

module.exports = new PaymentDao();
