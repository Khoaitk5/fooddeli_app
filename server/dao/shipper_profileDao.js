const shipperProfileDao = require("../dao/shipperProfileDao");
const userDao = require("../dao/userDao");

/**
 * @class ShipperProfileService
 * @description Xử lý nghiệp vụ liên quan đến tài xế giao hàng (shipper_profiles)
 */
class ShipperProfileService {
  /**
   * @async
   * @function createShipperProfile
   * @description Tạo hồ sơ shipper cho user có role = 'shipper'
   * @param {number} userId - ID người dùng
   * @param {object} shipperData - Dữ liệu shipper (vehicle_type, vehicle_number, identity_card)
   * @returns {Promise<object>} - Hồ sơ shipper mới
   */
  async createShipperProfile(userId, shipperData) {
    try {
      const user = await userDao.findById(userId);
      if (!user) throw new Error("Người dùng không tồn tại.");
      if (user.role !== "shipper")
        throw new Error("Chỉ người dùng có role = 'shipper' mới được tạo hồ sơ giao hàng.");

      const shipper = await shipperProfileDao.create({
        user_id: userId,
        vehicle_type: shipperData.vehicle_type,
        vehicle_number: shipperData.vehicle_number ?? "",
        identity_card: shipperData.identity_card ?? "",
        status: "pending",
        online_status: "offline",
      });

      return shipper;
    } catch (err) {
      console.error("❌ Error creating shipper profile:", err.message);
      throw new Error("Không thể tạo hồ sơ shipper.");
    }
  }

  /**
   * @async
   * @function getShipperByUserId
   * @description Lấy hồ sơ shipper theo user_id
   * @param {number} userId - ID người dùng
   * @returns {Promise<object|null>} - Hồ sơ shipper hoặc null
   */
  async getShipperByUserId(userId) {
    try {
      return await shipperProfileDao.getByUserId(userId);
    } catch (err) {
      console.error("❌ Error fetching shipper by user_id:", err.message);
      throw new Error("Không thể lấy thông tin shipper.");
    }
  }

  /**
   * @async
   * @function getAllShippers
   * @description Lấy danh sách tất cả shipper
   * @returns {Promise<object[]>} - Danh sách shipper
   */
  async getAllShippers() {
    try {
      return await shipperProfileDao.findAll();
    } catch (err) {
      console.error("❌ Error fetching all shippers:", err.message);
      throw new Error("Không thể lấy danh sách shipper.");
    }
  }

  /**
   * @async
   * @function updateOnlineStatus
   * @description Cập nhật trạng thái online/offline/busy của shipper
   * @param {number} shipperId - ID shipper
   * @param {"online"|"offline"|"busy"} status - Trạng thái mới
   * @returns {Promise<object>} - Hồ sơ shipper sau khi cập nhật
   */
  async updateOnlineStatus(shipperId, status) {
    try {
      return await shipperProfileDao.updateOnlineStatus(shipperId, status);
    } catch (err) {
      console.error("❌ Error updating shipper online status:", err.message);
      throw new Error("Không thể cập nhật trạng thái online của shipper.");
    }
  }

  /**
   * @async
   * @function getByOnlineStatus
   * @description Lấy danh sách shipper theo trạng thái hoạt động
   * @param {"online"|"offline"|"busy"} status - Trạng thái online_status
   * @returns {Promise<object[]>} - Danh sách shipper
   */
  async getByOnlineStatus(status) {
    try {
      return await shipperProfileDao.getByOnlineStatus(status);
    } catch (err) {
      console.error("❌ Error fetching shippers by online status:", err.message);
      throw new Error("Không thể lấy danh sách shipper theo trạng thái.");
    }
  }

  /**
   * @async
   * @function updateApprovalStatus
   * @description Cập nhật trạng thái duyệt hồ sơ shipper (pending/approved/rejected)
   * @param {number} shipperId - ID shipper
   * @param {"pending"|"approved"|"rejected"} status - Trạng thái duyệt mới
   * @returns {Promise<object>} - Hồ sơ shipper sau khi cập nhật
   */
  async updateApprovalStatus(shipperId, status) {
    try {
      const allowed = ["pending", "approved", "rejected"];
      if (!allowed.includes(status)) throw new Error("Trạng thái không hợp lệ.");

      const updated = await shipperProfileDao.update("id", shipperId, { status });
      return updated;
    } catch (err) {
      console.error("❌ Error updating approval status:", err.message);
      throw new Error("Không thể cập nhật trạng thái duyệt hồ sơ shipper.");
    }
  }

  /**
   * @async
   * @function updateLocation
   * @description Cập nhật vị trí hiện tại của shipper (nếu cột current_location có trong DB)
   * @param {number} shipperId - ID shipper
   * @param {number} latitude - Vĩ độ
   * @param {number} longitude - Kinh độ
   * @returns {Promise<object|null>} - Hồ sơ shipper sau khi cập nhật
   */
  async updateLocation(shipperId, latitude, longitude) {
    try {
      return await shipperProfileDao.updateLocation(shipperId, latitude, longitude);
    } catch (err) {
      console.error("❌ Error updating shipper location:", err.message);
      throw new Error("Không thể cập nhật vị trí shipper.");
    }
  }

  /**
   * @async
   * @function getAvailableShippers
   * @description Lấy danh sách shipper sẵn sàng nhận đơn (status=approved & online_status=online)
   * @returns {Promise<object[]>} - Danh sách shipper khả dụng
   */
  async getAvailableShippers() {
    try {
      return await shipperProfileDao.getAvailableShippers();
    } catch (err) {
      console.error("❌ Error fetching available shippers:", err.message);
      throw new Error("Không thể lấy danh sách shipper sẵn sàng nhận đơn.");
    }
  }

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
  }
}

module.exports = new ShipperProfileService();
