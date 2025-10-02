// dao/videoLikeDao.js
const GenericDao = require("./generic_dao");
const VideoLike = require("../models/video_like");

class VideoLikeDao extends GenericDao {
  constructor() {
    super("video_likes", VideoLike);
  }

  /**
   * 📊 Lấy danh sách tất cả người đã like 1 video
   * @param {number} videoId - ID video
   * @returns {Promise<object[]>} - Danh sách lượt thích
   */
  async getLikesByVideoId(videoId) {
    const query = `
      SELECT vl.*, u.username, u.avatar_url
      FROM video_likes vl
      JOIN users u ON vl.user_id = u.id
      WHERE vl.video_id = $1
      ORDER BY vl.id DESC;
    `;
    const result = await this.db.query(query, [videoId]);
    return result.rows;
  }

  /**
   * 👍 Kiểm tra xem user đã like video chưa
   * @param {number} videoId - ID video
   * @param {number} userId - ID người dùng
   * @returns {Promise<boolean>} - true nếu đã like, false nếu chưa
   */
  async hasUserLiked(videoId, userId) {
    const query = `
      SELECT 1 FROM video_likes
      WHERE video_id = $1 AND user_id = $2
      LIMIT 1;
    `;
    const result = await this.db.query(query, [videoId, userId]);
    return result.rowCount > 0;
  }

  /**
   * ❤️ Thêm lượt thích mới (nếu chưa like)
   * @param {number} videoId - ID video
   * @param {number} userId - ID người dùng
   * @returns {Promise<object>} - Bản ghi like mới
   */
  async addLike(videoId, userId) {
    // Kiểm tra nếu đã like rồi thì không thêm nữa
    const alreadyLiked = await this.hasUserLiked(videoId, userId);
    if (alreadyLiked) {
      throw new Error("User already liked this video");
    }

    const query = `
      INSERT INTO video_likes (video_id, user_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await this.db.query(query, [videoId, userId]);
    return result.rows[0];
  }

  /**
   * 💔 Gỡ lượt thích (unlike)
   * @param {number} videoId - ID video
   * @param {number} userId - ID người dùng
   * @returns {Promise<boolean>} - true nếu đã xóa, false nếu không có gì để xóa
   */
  async removeLike(videoId, userId) {
    const query = `
      DELETE FROM video_likes
      WHERE video_id = $1 AND user_id = $2;
    `;
    const result = await this.db.query(query, [videoId, userId]);
    return result.rowCount > 0;
  }

  /**
   * 🔢 Đếm tổng số lượt thích của video
   * @param {number} videoId - ID video
   * @returns {Promise<number>} - Tổng lượt thích
   */
  async countLikes(videoId) {
    const query = `
      SELECT COUNT(*)::int AS total_likes
      FROM video_likes
      WHERE video_id = $1;
    `;
    const result = await this.db.query(query, [videoId]);
    return result.rows[0]?.total_likes || 0;
  }
}

module.exports = new VideoLikeDao();
