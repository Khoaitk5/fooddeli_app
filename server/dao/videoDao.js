const GenericDao = require("./generic_dao");
const Video = require("../models/video");
const pool = require("../config/db");

class VideoDao extends GenericDao {
  constructor() {
    super("videos", Video);
  }

  /**
   * 📜 Lấy tất cả video mà một người dùng đã đăng
   */
  async getVideosByUser(userId) {
    const query = `
      SELECT * FROM videos
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * 🏬 Lấy video theo shop_id (có status = 'approved')
   */
  async getVideosByShop(shopId) {
    const query = `
      SELECT v.video_id, v.title, v.video_url, v.likes_count, v.views_count, v.comments_count
      FROM videos v
      WHERE v.shop_id = $1 AND v.status = 'approved'
      ORDER BY v.created_at DESC;
    `;
    const result = await pool.query(query, [shopId]);
    return result.rows;
  }

  /**
   * 🔥 Lấy danh sách video phổ biến nhất (dựa theo lượt thích)
   */
  async getMostLikedVideos(limit = 10) {
    const query = `
      SELECT v.*, COUNT(vl.video_id) AS like_count
      FROM videos v
      LEFT JOIN video_likes vl ON v.video_id = vl.video_id
      GROUP BY v.video_id
      ORDER BY like_count DESC, v.created_at DESC
      LIMIT $1;
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  /**
   * 🔍 Tìm kiếm video theo tiêu đề hoặc mô tả
   */
  async searchVideos(keyword, limit = 20, offset = 0) {
    const query = `
      SELECT * FROM videos
      WHERE LOWER(title) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1)
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await pool.query(query, [`%${keyword}%`, limit, offset]);
    return result.rows;
  }

  /**
   * 📈 Tăng lượt xem video thêm 1
   */
  async incrementViews(videoId) {
    const query = `
      UPDATE videos
      SET views_count = views_count + 1,
          updated_at = NOW()
      WHERE video_id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [videoId]);
    return result.rows[0];
  }

  /**
   * 🆕 Lấy danh sách video mới nhất
   */
  async getLatestVideos(limit = 10) {
    const query = `
      SELECT * FROM videos
      ORDER BY created_at DESC
      LIMIT $1;
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  /**
   * 🗺️ Lấy toàn bộ video có thông tin vị trí của shop (lat/lon, rating)
   * Dùng cho thuật toán lọc theo khoảng cách
   */
  async getVideosWithShopData() {
    const query = `
      SELECT 
        v.video_id, v.title, v.video_url,
        v.views_count, v.likes_count, v.comments_count, 
        s.id AS shop_id, s.shop_name, s.description AS shop_description,
        u.rating AS shop_rating,
        u.avatar_url AS shop_avatar,
        a.lat_lon->>'lat' AS lat,
        a.lat_lon->>'lon' AS lng
      FROM videos v
      JOIN shop_profiles s ON v.shop_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN addresses a ON s.shop_address_id = a.address_id
      WHERE v.status = 'approved'
        AND u.status = 'active'
        AND a.lat_lon IS NOT NULL;
    `;

    const res = await pool.query(query);

    return res.rows.map(row => ({
      ...row,
      lat: row.lat ? parseFloat(row.lat) : null,
      lng: row.lng ? parseFloat(row.lng) : null,
      shop_rating: parseFloat(row.shop_rating || 0),
    }));
  }

  /**
   * 🧭 Lấy video của các shop trong bán kính 10km quanh vị trí người dùng
   * (Dựa vào danh sách video + vị trí + rating)
   * ⚠️ Tính toán khoảng cách ở tầng service (để tách logic)
   */
  async getVideosNearby(userLocation, maxDistanceKm = 10) {
    const allVideos = await this.getVideosWithShopData();
    return allVideos; // lọc ở tầng service
  }

  /**
   * ✏️ Cập nhật video theo id
   */
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

  /**
   * ❌ Xoá video theo id
   */
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

  /**
     * 🧭 Lấy video của các shop trong bán kính 10km quanh vị trí người dùng
     * (Dựa vào danh sách video + vị trí + rating)
     * ⚠️ Tính toán khoảng cách ở tầng service (để tách logic)
     */
  async getNearbyVideos(userLocation, maxDistanceKm = 10) {
    const allVideos = await this.getVideosWithShopData();
    // chỉ lọc ở tầng service — DAO chỉ fetch dữ liệu
    return allVideos;
  }
}

module.exports = new VideoDao();
