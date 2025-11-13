// dao/voucherDao.js
const GenericDao = require("./generic_dao");
const Voucher = require("../models/voucher");
const pool = require("../config/db");

class VoucherDao extends GenericDao {
  constructor() {
    super("vouchers", Voucher);
  }

  /**
   * 🔍 Tìm voucher theo mã code
   * @param {string} code - Mã voucher
   * @returns {Promise<object|null>} - Voucher nếu tồn tại, null nếu không
   */
  async findByCode(code) {
    const query = `
      SELECT * FROM vouchers
      WHERE code = $1
      LIMIT 1;
    `;
    const result = await pool.query(query, [code]);
    return result.rows[0] || null;
  }

  /**
   * 📜 Lấy danh sách voucher đang còn hiệu lực
   * @returns {Promise<object[]>} - Danh sách voucher còn hiệu lực
   */
  async getActiveVouchers() {
    const query = `
      SELECT * FROM vouchers
      WHERE status = 'active'
      AND NOW() BETWEEN start_date AND end_date
      ORDER BY start_date DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * ✅ Kiểm tra voucher có hợp lệ cho đơn hàng hay không
   * @param {string} code - Mã voucher
   * @param {number} orderValue - Giá trị đơn hàng
   * @returns {Promise<object>} - Voucher nếu hợp lệ, ngược lại throw lỗi
   */
  async validateVoucher(code, orderValue) {
    const voucher = await this.findByCode(code);
    if (!voucher) {
      throw new Error("Voucher không tồn tại");
    }
    if (voucher.status !== "active") {
      throw new Error("Voucher không còn hoạt động");
    }
    const now = new Date();
    if (now < new Date(voucher.start_date) || now > new Date(voucher.end_date)) {
      throw new Error("Voucher đã hết hạn hoặc chưa bắt đầu");
    }
    if (voucher.min_order_value && orderValue < voucher.min_order_value) {
      throw new Error(
        `Đơn hàng chưa đủ giá trị tối thiểu (${voucher.min_order_value}) để áp dụng voucher`
      );
    }
    return voucher;
  }

  /**
   * 🚫 Vô hiệu hóa một voucher
   * @param {number} voucherId - ID voucher
   * @returns {Promise<object>} - Voucher sau khi cập nhật
   */
  async disableVoucher(voucherId) {
    const query = `
      UPDATE vouchers
      SET status = 'disabled',
          updated_at = NOW()
      WHERE voucher_id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [voucherId]);
    return result.rows[0];
  }

  /**
   * 📉 Hết hạn tự động tất cả voucher quá hạn
   * @returns {Promise<number>} - Số lượng voucher đã cập nhật
   */
  async expireOutdatedVouchers() {
    const query = `
      UPDATE vouchers
      SET status = 'expired'
      WHERE end_date < NOW() AND status = 'active';
    `;
    const result = await pool.query(query);
    return result.rowCount;
  }
}

module.exports = new VoucherDao();
