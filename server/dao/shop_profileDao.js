// dao/shop_profileDao.js
const GenericDao = require("./generic_dao");
const ShopProfile = require("../models/shop_profile");
const pool = require("../config/db");

class ShopProfileDao extends GenericDao {
  constructor() {
    super("shop_profiles", ShopProfile);
  }

  /**
   * Lấy thông tin shop theo user_id (mỗi shop gắn với một user duy nhất)
   * @param {number} userId - ID người dùng
   * @returns {Promise<ShopProfile|null>} - Hồ sơ shop hoặc null nếu không tồn tại
   */
  async getByUserId(userId) {
    const query = `
      SELECT * FROM shop_profiles
      WHERE user_id = $1
      LIMIT 1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] ? new ShopProfile(result.rows[0]) : null;
  }

  async findDetailsById(shopId) {
    const query = `
      SELECT sp.*, u.avatar_url, u.rating
      FROM shop_profiles sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.id = $1
    `;
    const result = await pool.query(query, [shopId]);
    if (result.rows[0]) {
      const shop = new ShopProfile(result.rows[0]);
      shop.user_id = result.rows[0].user_id; // ✅ Thêm dòng này
      return shop;
    }

    return null;
  }

  async getShopProfilesAndAddressesByShopId(shopId) {
  const sql = `
    SELECT 
      sp.*,
      CASE WHEN a.address_id IS NULL THEN NULL ELSE to_jsonb(a) END AS address
    FROM shop_profiles sp
    LEFT JOIN addresses a ON a.address_id = sp.shop_address_id
    WHERE sp.id = $1
    LIMIT 1;
  `;
  const { rows } = await pool.query(sql, [shopId]);
  return rows[0] ?? null;
}


  /**
   * Cập nhật trạng thái cửa hàng (open/closed/pending)
   * @param {number} shopId - ID shop
   * @param {"open"|"closed"|"pending"} status - trạng thái mới
   * @returns {Promise<ShopProfile|null>} - Shop sau khi cập nhật
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
    const result = await pool.query(query, [status, shopId]);
    return result.rows[0] ? new ShopProfile(result.rows[0]) : null;
  }

  /**
   * Tìm các cửa hàng trong bán kính nhất định (JOIN địa chỉ)
   * @param {number} latitude - vĩ độ người dùng
   * @param {number} longitude - kinh độ người dùng
   * @param {number} radiusKm - bán kính tính theo km
   * @returns {Promise<ShopProfile[]>} - Danh sách cửa hàng trong bán kính
   */
  async findNearbyShops(latitude, longitude, radiusKm = 5) {
    const query = `
      SELECT sp.*, 
        (6371 * acos(
          cos(radians($1)) * cos(radians((a.lat_lon->>'lat')::float)) *
          cos(radians((a.lat_lon->>'lon')::float) - radians($2)) +
          sin(radians($1)) * sin(radians((a.lat_lon->>'lat')::float))
        )) AS distance_km
      FROM shop_profiles sp
      JOIN addresses a ON sp.shop_address_id = a.address_id
      WHERE sp.status = 'open'
      HAVING distance_km <= $3
      ORDER BY distance_km ASC;
    `;
    const result = await pool.query(query, [latitude, longitude, radiusKm]);
    return result.rows.map((r) => new ShopProfile(r));
  }

  /**
 * ✏️ Cập nhật thông tin cửa hàng (override update generic)
 *  → Tránh lỗi multiple assignments to same column "updated_at"
 */
  async updateShopInfo(shopId, data) {
    // ⚙️ Loại bỏ các trường tự động
    delete data.updated_at;
    delete data.created_at;

    const keys = Object.keys(data);
    const values = Object.values(data);

    if (!keys.length) return null;

    const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(", ");

    const query = `
    UPDATE shop_profiles
    SET ${setClause}, updated_at=NOW()
    WHERE id=$${keys.length + 1}
    RETURNING *;
  `;

    const result = await pool.query(query, [...values, shopId]);
    return result.rows[0] ? new ShopProfile(result.rows[0]) : null;
  }

}

module.exports = new ShopProfileDao();
