const GenericDao = require("./generic_dao"); // ✅ thêm dòng này đầu file
const Payment = require("../models/payment");
const pool = require("../config/db");

class PaymentDao extends GenericDao {
  constructor() {
    super("payments", Payment);
    this.pool = pool;
  }

  async getPaymentsByOrderId(orderId) {
    const query = `
      SELECT * FROM payments
      WHERE order_id = $1
      ORDER BY paid_at DESC NULLS LAST;
    `;
    const result = await this.pool.query(query, [orderId]);
    return result.rows.map(row => new Payment(row));
  }

  async updateStatus(paymentId, status, paidAt = null) {
    const allowedStatuses = ["pending", "success", "failed", "refunded"];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid payment status: ${status}`);
    }

    const query = `
      UPDATE payments
      SET status = $1, paid_at = $2
      WHERE id = $3
      RETURNING *;
    `;
    const result = await this.pool.query(query, [status, paidAt, paymentId]);
    return result.rows[0] ? new Payment(result.rows[0]) : null;
  }

  async getSuccessfulPayments() {
    const query = `
      SELECT * FROM payments
      WHERE status = 'success'
      ORDER BY paid_at DESC;
    `;
    const result = await this.pool.query(query);
    return result.rows.map(row => new Payment(row));
  }
}

module.exports = new PaymentDao();
