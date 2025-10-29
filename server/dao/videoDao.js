// dao/videoDao.js
const GenericDao = require("./generic_dao");
const pool = require("../config/db");
const Video = require("../models/video");

class VideoDao extends GenericDao {
  constructor() {
    // ✅ gọi GenericDao cho bảng "videos"
    super("videos", Video);
  }

  // 🧠 (Tuỳ chọn) — nếu cần query đặc biệt, có thể thêm ở đây

  // Lấy tất cả video theo shop_id
  async getByShopId(shopId) {
    try {
      const query = `SELECT * FROM ${this.table} WHERE shop_id = $1 ORDER BY created_at DESC`;
      const result = await pool.query(query, [shopId]);
      console.log(`[VideoDao] getByShopId(${shopId}) -> ${result.rowCount} rows`);
      return result.rows.map((row) => new this.Model(row));
    } catch (err) {
      console.error("[VideoDao] getByShopId error:", err);
      throw err;
    }
  }

  // Cập nhật video theo id
  async updateById(id, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
      const query = `
        UPDATE ${this.table}
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${keys.length + 1}
        RETURNING *;
      `;
      const result = await pool.query(query, [...values, id]);
      if (result.rowCount === 0) return null;
      console.log(`[VideoDao] updateById(${id}) OK`);
      return new this.Model(result.rows[0]);
    } catch (err) {
      console.error("[VideoDao] updateById error:", err);
      throw err;
    }
  }

  // Xoá video theo id
  async deleteById(id) {
    try {
      const query = `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, [id]);
      console.log(`[VideoDao] deleteById(${id}) OK`);
      return result.rows[0] ? new this.Model(result.rows[0]) : null;
    } catch (err) {
      console.error("[VideoDao] deleteById error:", err);
      throw err;
    }
  }

  // dao/videoDao.js
  async getNearbyVideos(lat, lng, radiusKm = 10) {
    try {
      const query = `
      SELECT 
        v.*, 
        sp.shop_name,
        a.lat_lon ->> 'lat' AS lat,
        a.lat_lon ->> 'lng' AS lng,
        (
          6371 * acos(
            cos(radians($1)) * 
            cos(radians(CAST(a.lat_lon ->> 'lat' AS DOUBLE PRECISION))) *
            cos(radians(CAST(a.lat_lon ->> 'lng' AS DOUBLE PRECISION)) - radians($2)) +
            sin(radians($1)) * 
            sin(radians(CAST(a.lat_lon ->> 'lat' AS DOUBLE PRECISION)))
          )
        ) AS distance_km
      FROM ${this.table} v
      JOIN shop_profiles sp ON v.shop_id = sp.id
      JOIN addresses a ON sp.shop_address_id = a.address_id
      WHERE 
        (
          6371 * acos(
            cos(radians($1)) * 
            cos(radians(CAST(a.lat_lon ->> 'lat' AS DOUBLE PRECISION))) *
            cos(radians(CAST(a.lat_lon ->> 'lng' AS DOUBLE PRECISION)) - radians($2)) +
            sin(radians($1)) * 
            sin(radians(CAST(a.lat_lon ->> 'lat' AS DOUBLE PRECISION)))
          )
        ) <= $3
      ORDER BY distance_km ASC, v.created_at DESC
      LIMIT 50;
    `;

      const result = await pool.query(query, [lat, lng, radiusKm]);
      console.log(`[VideoDao] getNearbyVideos -> ${result.rowCount} rows`);
      return result.rows.map((row) => new this.Model(row));
    } catch (err) {
      console.error("[VideoDao] getNearbyVideos error:", err);
      throw err;
    }
  }

}

// ✅ Export instance kế thừa GenericDao
const videoDao = new VideoDao();
module.exports = videoDao;
