// dao/voucherDao.js
const FirestoreDao = require("./firestore_dao");
const Voucher = require("../models/voucher");
const admin = require("../config/firebase");

class VoucherDao extends FirestoreDao {
  constructor() {
    super("vouchers", Voucher);
  }

  /**
   * 🔍 Tìm voucher theo mã code
   * @param {string} code - Mã voucher
   * @returns {Promise<object|null>} - Voucher nếu tồn tại, null nếu không
   */
  async findByCode(code) {
    return this.findOneByField("code", code);
  }

  /**
   * 📜 Lấy danh sách voucher đang còn hiệu lực
   * @returns {Promise<object[]>} - Danh sách voucher còn hiệu lực
   */
  async getActiveVouchers() {
    try {
      const now = admin.firestore.Timestamp.now();
      const allVouchers = await this.findAll();
      
      // Lọc voucher đang active
      const activeVouchers = allVouchers.filter(v => {
        if (v.status !== "active") return false;
        
        const startDate = v.start_date?.toDate?.() || new Date(0);
        const endDate = v.end_date?.toDate?.() || new Date(9999, 0, 0);
        const nowDate = now.toDate?.() || new Date();
        
        return nowDate >= startDate && nowDate <= endDate;
      });
      
      // Sắp xếp theo start_date
      activeVouchers.sort((a, b) => {
        const aTime = a.start_date?.toDate?.() || new Date(0);
        const bTime = b.start_date?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      
      return activeVouchers;
    } catch (err) {
      console.error("❌ Error in getActiveVouchers:", err.message);
      throw err;
    }
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
    const startDate = voucher.start_date?.toDate?.() || new Date(0);
    const endDate = voucher.end_date?.toDate?.() || new Date(9999, 0, 0);
    
    if (now < startDate || now > endDate) {
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
   * @param {string} voucherId - ID voucher
   * @returns {Promise<object>} - Voucher sau khi cập nhật
   */
  async disableVoucher(voucherId) {
    return this.update(voucherId, { status: "disabled" });
  }

  /**
   * 📉 Hết hạn tự động tất cả voucher quá hạn
   * @returns {Promise<number>} - Số lượng voucher đã cập nhật
   */
  async expireOutdatedVouchers() {
    try {
      const now = new Date();
      const allVouchers = await this.findAll();
      
      let count = 0;
      for (const voucher of allVouchers) {
        const endDate = voucher.end_date?.toDate?.() || new Date(9999, 0, 0);
        
        if (endDate < now && voucher.status === "active") {
          await this.update(voucher.id, { status: "expired" });
          count++;
        }
      }
      
      return count;
    } catch (err) {
      console.error("❌ Error in expireOutdatedVouchers:", err.message);
      throw err;
    }
  }
}

module.exports = new VoucherDao();
