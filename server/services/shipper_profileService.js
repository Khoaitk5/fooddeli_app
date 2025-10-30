// services/shipperProfileService.js
const shipperProfileDao = require("../dao/shipper_profileDao");

const shipperProfileService = {
  /**
   * ➕ Tạo hồ sơ shipper mới
   * @param {object} shipperData - { user_id, vehicle_type, vehicle_number, identity_card }
   * @returns {Promise<object>}
   */
  async createShipperProfile(shipperData) {
    if (!shipperData.user_id || !shipperData.vehicle_type) {
      throw new Error("Thiếu thông tin bắt buộc: user_id, vehicle_type");
    }
    return await shipperProfileDao.create(shipperData);
  },

  /**
   * 📦 Lấy thông tin shipper theo ID hồ sơ
   * @param {number} shipperId
   * @returns {Promise<object|null>}
   */
  async getShipperById(shipperId) {
    return await shipperProfileDao.findById(shipperId);
  },

  /**
   * 📍 Lấy thông tin shipper theo user_id
   * @param {number} userId
   * @returns {Promise<object|null>}
   */
  async getShipperByUserId(userId) {
    return await shipperProfileDao.getByUserId(userId);
  },

  /**
   * 📜 Lấy toàn bộ hồ sơ shipper
   * @returns {Promise<object[]>}
   */
  async getAllShippers() {
    return await shipperProfileDao.findAll();
  },

  /**
   * ✏️ Cập nhật thông tin hồ sơ shipper
   * @param {number} shipperId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateShipper(shipperId, updateData) {
    const existing = await shipperProfileDao.findById(shipperId);
    if (!existing) {
      throw new Error("Hồ sơ shipper không tồn tại");
    }
    return await shipperProfileDao.update(shipperId, updateData);
  },

  /**
   * 🗑️ Xóa hồ sơ shipper
   * @param {number} shipperId
   * @returns {Promise<boolean>}
   */
  async deleteShipper(shipperId) {
    const existing = await shipperProfileDao.findById(shipperId);
    if (!existing) {
      throw new Error("Hồ sơ shipper không tồn tại");
    }
    return await shipperProfileDao.delete(shipperId);
  },

  /**
   * 🔄 Cập nhật trạng thái online/offline/busy
   * @param {number} shipperId
   * @param {"online"|"offline"|"busy"} status
   * @returns {Promise<object>}
   */
  async updateOnlineStatus(shipperId, status) {
    const existing = await shipperProfileDao.findById(shipperId);
    if (!existing) {
      throw new Error("Hồ sơ shipper không tồn tại");
    }
    return await shipperProfileDao.updateOnlineStatus(shipperId, status);
  },

  /**
   * 📍 Cập nhật vị trí hiện tại của shipper
   * @param {number} shipperId
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<object>}
   */
  async updateLocation(shipperId, latitude, longitude) {
    const existing = await shipperProfileDao.findById(shipperId);
    if (!existing) {
      throw new Error("Hồ sơ shipper không tồn tại");
    }
    return await shipperProfileDao.updateLocation(shipperId, latitude, longitude);
  },

  /**
   * 📶 Lấy danh sách shipper theo trạng thái online_status
   * @param {"online"|"offline"|"busy"} status
   * @returns {Promise<object[]>}
   */
  async getShippersByOnlineStatus(status) {
    return await shipperProfileDao.getByOnlineStatus(status);
  },

  /**
   * 🚚 Lấy danh sách shipper sẵn sàng nhận đơn (online + approved)
   * @returns {Promise<object[]>}
   */
  async getAvailableShippers() {
    return await shipperProfileDao.getAvailableShippers();
  },

  /**
   * @async
   * @function deleteShipperProfile
   * @description Xóa hồ sơ shipper (khi user bị xóa hoặc không còn hoạt động)
   * @param {number} shipperId - ID shipper
   * @returns {Promise<object>} - Hồ sơ shipper đã xóa
   */
  async deleteShipperProfile(shipperId) {
    try {
      return await shipperProfileDao.delete("id", shipperId);
    } catch (err) {
      console.error("❌ Error deleting shipper profile:", err.message);
      throw new Error("Không thể xóa hồ sơ shipper.");
    }
  },

  /**
   * @async
   * @function getShipperStatistics
   * @description Lấy thống kê hiệu suất của shipper (tổng đơn, hoàn thành, thu nhập, rating)
   * @param {number} shipperId - ID shipper profile
   * @returns {Promise<object>} - Thống kê hiệu suất
   */
  async getShipperStatistics(shipperId) {
    try {
      return await shipperProfileDao.getStatistics(shipperId);
    } catch (err) {
      console.error("❌ Error fetching shipper statistics:", err.message);
      throw new Error("Không thể lấy thống kê shipper.");
    }
  },

  /**
   * @async
   * @function getEarningsByPeriod
   * @description Lấy doanh thu của shipper theo khoảng thời gian
   * @param {number} shipperId - ID shipper profile
   * @param {string} period - "today", "week", "month", "all"
   * @returns {Promise<object>} - Doanh thu và danh sách chi tiết
   */
  async getEarningsByPeriod(shipperId, period = "month") {
    try {
      return await shipperProfileDao.getEarningsByPeriod(shipperId, period);
    } catch (err) {
      console.error("❌ Error fetching shipper earnings:", err.message);
      throw new Error("Không thể lấy doanh thu shipper.");
    }
  },
};

module.exports = shipperProfileService;
