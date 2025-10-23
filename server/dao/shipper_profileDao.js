const FirestoreDao = require("./firestore_dao");
const ShipperProfile = require("../models/shipper_profile");

/**
 * @class ShipperProfileDao
 * @extends FirestoreDao
 * @description DAO cho collection `shipper_profiles`
 */
class ShipperProfileDao extends FirestoreDao {
  constructor() {
    super("shipper_profiles", ShipperProfile);
  }

  /**
   * Lấy thông tin shipper theo user_id
   * @param {string} userId - ID người dùng
   * @returns {Promise<ShipperProfile|null>} - Hồ sơ shipper hoặc null
   */
  async getByUserId(userId) {
    return this.findOneByField("user_id", userId);
  }

  /**
   * Cập nhật trạng thái online/offline/busy của shipper
   * @param {string} shipperId - ID shipper
   * @param {string} status - Trạng thái mới
   * @returns {Promise<ShipperProfile>} - Hồ sơ shipper sau khi cập nhật
   */
  async updateOnlineStatus(shipperId, status) {
    const allowed = ["online", "offline", "busy"];
    if (!allowed.includes(status)) {
      throw new Error("Invalid online status");
    }
    return this.update(shipperId, { online_status: status });
  }

  /**
   * Lấy danh sách shipper theo trạng thái hoạt động
   * @param {string} status - Trạng thái online_status
   * @returns {Promise<ShipperProfile[]>} - Danh sách shipper
   */
  async getByOnlineStatus(status) {
    const conditions = [{ field: "online_status", operator: "==", value: status }];
    return this.findWithConditions(conditions);
  }

  /**
   * Cập nhật vị trí hiện tại của shipper
   * @param {string} shipperId - ID shipper
   * @param {number} latitude - Vĩ độ
   * @param {number} longitude - Kinh độ
   * @returns {Promise<ShipperProfile|null>} - Hồ sơ shipper sau khi cập nhật
   */
  async updateLocation(shipperId, latitude, longitude) {
    try {
      return this.update(shipperId, {
        current_location: {
          lat: latitude,
          lng: longitude,
        },
        updated_at: new Date(),
      });
    } catch (err) {
      console.error("❌ Error in updateLocation:", err.message);
      throw err;
    }
  }

  /**
   * Lấy danh sách shipper sẵn sàng nhận đơn (status=approved & online_status=online)
   * @returns {Promise<ShipperProfile[]>} - Danh sách shipper khả dụng
   */
  async getAvailableShippers() {
    try {
      const conditions = [
        { field: "status", operator: "==", value: "approved" },
        { field: "online_status", operator: "==", value: "online" }
      ];
      return this.findWithConditions(conditions);
    } catch (err) {
      console.error("❌ Error in getAvailableShippers:", err.message);
      throw err;
    }
  }
}

module.exports = new ShipperProfileDao();
