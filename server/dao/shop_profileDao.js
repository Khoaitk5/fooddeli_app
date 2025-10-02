// dao/shopProfileDao.js
const GenericDao = require("./generic_dao");
const ShopProfile = require("../models/shop_profile");

class ShopProfileDao extends GenericDao {
  constructor() {
    // Gọi constructor cha để truyền tên bảng và model tương ứng
    super("shop_profiles", ShopProfile);
  }

  /**
   * Lấy thông tin shop theo user_id (mỗi shop gắn với một user duy nhất)
   * @param {number} userId - ID người dùng
   * @returns {Promise<object|null>} - Hồ sơ shop hoặc null nếu không tồn tại
   */
  async getByUserId(userId) {
    const query = `
      SELECT * FROM shop_profiles
      WHERE user_id = $1
      LIMIT 1;
    `;
    const result = await this.db.query(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * Cập nhật trạng thái cửa hàng (open/closed/pending)
   * @param {number} shopId - ID shop
   * @param {"open"|"closed"|"pending"} status - trạng thái mới
   * @returns {Promise<object>} - Shop sau khi cập nhật
   */
  async updateStatus(shopId, status) {
    const allowed = ["open", "closed", "pending"];
    if (!allowed.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const query = `
      UPDATE shop_profiles
      SET status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await this.db.query(query, [status, shopId]);
    return result.rows[0];
  }

  /**
   * Tìm các cửa hàng trong bán kính nhất định từ vị trí người dùng
   * @param {number} latitude - vĩ độ người dùng
   * @param {number} longitude - kinh độ người dùng
   * @param {number} radiusKm - bán kính tính theo km
   * @returns {Promise<object[]>} - Danh sách cửa hàng trong bán kính
   */
  async findNearbyShops(latitude, longitude, radiusKm = 5) {
    const query = `
      SELECT *,
        ( 6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(latitude))
          )
        ) AS distance_km
      FROM shop_profiles
      WHERE status = 'open'
      HAVING distance_km <= $3
      ORDER BY distance_km ASC;
    `;
    const result = await this.db.query(query, [latitude, longitude, radiusKm]);
    return result.rows;
  }

  /**
   * Tăng tổng số đơn hàng (total_sales) của shop lên 1 (dùng khi hoàn tất đơn hàng)
   * @param {number} shopId - ID shop
   * @returns {Promise<object>} - Hồ sơ shop sau khi cập nhật
   */
  async incrementTotalSales(shopId) {
    const query = `
      UPDATE shop_profiles
      SET total_sales = total_sales + 1,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const result = await this.db.query(query, [shopId]);
    return result.rows[0];
  }
}

module.exports = new ShopProfileDao();
