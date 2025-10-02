// dao/shipperProfileDao.js
const GenericDao = require("./generic_dao");
const ShipperProfile = require("../models/shipper_profile");

class ShipperProfileDao extends GenericDao {
  constructor() {
    // Gọi constructor của GenericDao và truyền bảng + model tương ứng
    super("shipper_profiles", ShipperProfile);
  }

  /**
   * Lấy thông tin shipper theo user_id
   * @param {number} userId - ID người dùng
   * @returns {Promise<object|null>} - Thông tin shipper hoặc null nếu không tồn tại
   */
  async getByUserId(userId) {
    const query = `
      SELECT * FROM shipper_profiles
      WHERE user_id = $1
      LIMIT 1;
    `;
    const result = await this.db.query(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * Lấy danh sách shipper theo trạng thái online_status
   * @param {"online"|"offline"|"busy"} status - Trạng thái shipper
   * @returns {Promise<object[]>} - Danh sách shipper
   */
  async getByOnlineStatus(status) {
    const query = `
      SELECT * FROM shipper_profiles
      WHERE online_status = $1
      ORDER BY updated_at DESC;
    `;
    const result = await this.db.query(query, [status]);
    return result.rows;
  }

  /**
   * Cập nhật trạng thái online/offline của shipper
   * @param {number} shipperId - ID shipper
   * @param {"online"|"offline"|"busy"} status - Trạng thái mới
   * @returns {Promise<object>} - Hồ sơ shipper sau khi cập nhật
   */
  async updateOnlineStatus(shipperId, status) {
    const allowed = ["online", "offline", "busy"];
    if (!allowed.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const query = `
      UPDATE shipper_profiles
      SET online_status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await this.db.query(query, [status, shipperId]);
    return result.rows[0];
  }

  /**
   * Cập nhật vị trí hiện tại của shipper
   * @param {number} shipperId - ID shipper
   * @param {number} latitude - Vĩ độ
   * @param {number} longitude - Kinh độ
   * @returns {Promise<object>} - Hồ sơ shipper sau khi cập nhật vị trí
   */
  async updateLocation(shipperId, latitude, longitude) {
    const query = `
      UPDATE shipper_profiles
      SET latitude = $1,
          longitude = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const result = await this.db.query(query, [latitude, longitude, shipperId]);
    return result.rows[0];
  }

  /**
   * Lấy danh sách shipper đang sẵn sàng nhận đơn (online + approved)
   * @returns {Promise<object[]>} - Danh sách shipper sẵn sàng
   */
  async getAvailableShippers() {
    const query = `
      SELECT * FROM shipper_profiles
      WHERE online_status = 'online' AND status = 'approved'
      ORDER BY updated_at DESC;
    `;
    const result = await this.db.query(query);
    return result.rows;
  }
}

module.exports = new ShipperProfileDao();
