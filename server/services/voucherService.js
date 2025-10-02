// services/voucherService.js
const voucherDao = require("../dao/voucherDao");

const voucherService = {
  /**
   * ➕ Tạo voucher mới
   * @param {object} voucherData - { code, type, discount_value, start_date, end_date, ... }
   * @returns {Promise<object>}
   */
  async createVoucher(voucherData) {
    if (!voucherData.code || !voucherData.type || !voucherData.discount_value) {
      throw new Error("Thiếu thông tin bắt buộc để tạo voucher");
    }
    return await voucherDao.create(voucherData);
  },

  /**
   * 📦 Lấy voucher theo ID
   * @param {number} voucherId
   * @returns {Promise<object|null>}
   */
  async getVoucherById(voucherId) {
    return await voucherDao.findById(voucherId);
  },

  /**
   * 📜 Lấy tất cả voucher
   * @returns {Promise<object[]>}
   */
  async getAllVouchers() {
    return await voucherDao.findAll();
  },

  /**
   * ✏️ Cập nhật thông tin voucher
   * @param {number} voucherId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateVoucher(voucherId, updateData) {
    const existing = await voucherDao.findById(voucherId);
    if (!existing) {
      throw new Error("Voucher không tồn tại");
    }
    return await voucherDao.update(voucherId, updateData);
  },

  /**
   * 🗑️ Xóa voucher
   * @param {number} voucherId
   * @returns {Promise<boolean>}
   */
  async deleteVoucher(voucherId) {
    const existing = await voucherDao.findById(voucherId);
    if (!existing) {
      throw new Error("Voucher không tồn tại");
    }
    return await voucherDao.delete(voucherId);
  },

  /**
   * 🔍 Tìm voucher theo mã
   * @param {string} code
   * @returns {Promise<object|null>}
   */
  async getVoucherByCode(code) {
    if (!code) throw new Error("Mã voucher không được để trống");
    return await voucherDao.findByCode(code);
  },

  /**
   * 📜 Lấy danh sách voucher còn hiệu lực
   * @returns {Promise<object[]>}
   */
  async getActiveVouchers() {
    return await voucherDao.getActiveVouchers();
  },

  /**
   * ✅ Kiểm tra tính hợp lệ của voucher cho đơn hàng
   * @param {string} code - mã voucher
   * @param {number} orderValue - tổng giá trị đơn hàng
   * @returns {Promise<object>}
   */
  async validateVoucher(code, orderValue) {
    return await voucherDao.validateVoucher(code, orderValue);
  },

  /**
   * 🚫 Vô hiệu hóa một voucher cụ thể
   * @param {number} voucherId
   * @returns {Promise<object>}
   */
  async disableVoucher(voucherId) {
    const existing = await voucherDao.findById(voucherId);
    if (!existing) {
      throw new Error("Voucher không tồn tại");
    }
    return await voucherDao.disableVoucher(voucherId);
  },

  /**
   * 📉 Cập nhật trạng thái hết hạn cho tất cả voucher quá hạn
   * @returns {Promise<number>} - số lượng voucher đã bị cập nhật
   */
  async expireOutdatedVouchers() {
    return await voucherDao.expireOutdatedVouchers();
  },
};

module.exports = voucherService;
