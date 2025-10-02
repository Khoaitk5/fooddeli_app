// services/shopProfileService.js
const shopProfileDao = require("../dao/shop_profileDao");

const shopProfileService = {
  /**
   * ➕ Tạo hồ sơ shop mới
   * @param {object} shopData - { user_id, shop_name, address, latitude, longitude, description }
   * @returns {Promise<object>}
   */
  async createShop(shopData) {
    if (!shopData.user_id || !shopData.shop_name) {
      throw new Error("Thiếu thông tin bắt buộc: user_id, shop_name");
    }
    return await shopProfileDao.create(shopData);
  },

  /**
   * 📦 Lấy hồ sơ shop theo ID
   * @param {number} shopId
   * @returns {Promise<object|null>}
   */
  async getShopById(shopId) {
    return await shopProfileDao.findById(shopId);
  },

  /**
   * 📍 Lấy shop theo user_id
   * @param {number} userId
   * @returns {Promise<object|null>}
   */
  async getShopByUserId(userId) {
    return await shopProfileDao.getByUserId(userId);
  },

  /**
   * 📜 Lấy danh sách tất cả shop
   * @returns {Promise<object[]>}
   */
  async getAllShops() {
    return await shopProfileDao.findAll();
  },

  /**
   * ✏️ Cập nhật thông tin shop
   * @param {number} shopId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateShop(shopId, updateData) {
    const existing = await shopProfileDao.findById(shopId);
    if (!existing) {
      throw new Error("Shop không tồn tại");
    }
    return await shopProfileDao.update(shopId, updateData);
  },

  /**
   * 🗑️ Xóa shop theo ID
   * @param {number} shopId
   * @returns {Promise<boolean>}
   */
  async deleteShop(shopId) {
    const existing = await shopProfileDao.findById(shopId);
    if (!existing) {
      throw new Error("Shop không tồn tại");
    }
    return await shopProfileDao.delete(shopId);
  },

  /**
   * 🔄 Cập nhật trạng thái shop (open/closed/pending)
   * @param {number} shopId
   * @param {"open"|"closed"|"pending"} status
   * @returns {Promise<object>}
   */
  async updateShopStatus(shopId, status) {
    const existing = await shopProfileDao.findById(shopId);
    if (!existing) {
      throw new Error("Shop không tồn tại");
    }
    return await shopProfileDao.updateStatus(shopId, status);
  },

  /**
   * 📍 Tìm cửa hàng gần vị trí người dùng trong bán kính X km
   * @param {number} latitude
   * @param {number} longitude
   * @param {number} radiusKm
   * @returns {Promise<object[]>}
   */
  async findNearbyShops(latitude, longitude, radiusKm = 5) {
    if (latitude == null || longitude == null) {
      throw new Error("Thiếu toạ độ vị trí để tìm shop gần bạn");
    }
    return await shopProfileDao.findNearbyShops(latitude, longitude, radiusKm);
  },

  /**
   * 📈 Tăng tổng số đơn hàng của shop (khi hoàn tất đơn hàng)
   * @param {number} shopId
   * @returns {Promise<object>}
   */
  async incrementTotalSales(shopId) {
    const existing = await shopProfileDao.findById(shopId);
    if (!existing) {
      throw new Error("Shop không tồn tại");
    }
    return await shopProfileDao.incrementTotalSales(shopId);
  },
};

module.exports = shopProfileService;
