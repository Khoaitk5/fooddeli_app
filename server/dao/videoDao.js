// dao/videoDao.js
const GenericDao = require("./generic_dao");
const Video = require("../models/video");

class VideoDao extends GenericDao {
  constructor() {
    super("videos", Video);
  }

  /**
   * 📜 Lấy tất cả video mà một người dùng đã đăng
   * @param {number} userId - ID người đăng
   * @returns {Promise<object[]>} - Danh sách video
   */
  async getVideosByUser(userId) {
    const query = `
      SELECT * FROM videos
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [userId]);
    return result.rows;
  }

  /**
   * 🔥 Lấy danh sách video phổ biến nhất (dựa theo lượt thích)
   * @param {number} limit - số lượng video cần lấy
   * @returns {Promise<object[]>} - Danh sách video phổ biến
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
    const result = await this.db.query(query, [limit]);
    return result.rows;
  }

  /**
   * 🔍 Tìm kiếm video theo tiêu đề hoặc mô tả
   * @param {string} keyword - từ khóa tìm kiếm
   * @param {number} [limit=20] - số lượng kết quả
   * @param {number} [offset=0] - bắt đầu từ vị trí
   * @returns {Promise<object[]>} - Danh sách video khớp từ khóa
   */
  async searchVideos(keyword, limit = 20, offset = 0) {
    const query = `
      SELECT * FROM videos
      WHERE LOWER(title) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1)
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await this.db.query(query, [`%${keyword}%`, limit, offset]);
    return result.rows;
  }

  /**
   * 📈 Tăng lượt xem video thêm 1
   * @param {number} videoId - ID video
   * @returns {Promise<object>} - Video sau khi cập nhật
   */
  async incrementViews(videoId) {
    const query = `
      UPDATE videos
      SET views = views + 1,
          updated_at = NOW()
      WHERE video_id = $1
      RETURNING *;
    `;
    const result = await this.db.query(query, [videoId]);
    return result.rows[0];
  }

  /**
   * 🆕 Lấy danh sách video mới nhất
   * @param {number} limit - số lượng video cần lấy
   * @returns {Promise<object[]>} - Danh sách video mới nhất
   */
  async getLatestVideos(limit = 10) {
    const query = `
      SELECT * FROM videos
      ORDER BY created_at DESC
      LIMIT $1;
    `;
    const result = await this.db.query(query, [limit]);
    return result.rows;
  }
}

module.exports = new VideoDao();
