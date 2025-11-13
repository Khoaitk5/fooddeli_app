// dao/videoCommentDao.js
const GenericDao = require("./generic_dao");
const VideoComment = require("../models/video_comment");
const pool = require("../config/db");

class VideoCommentDao extends GenericDao {
  constructor() {
    super("video_comments", VideoComment);
  }

  /**
   * 📜 Lấy tất cả bình luận theo video_id
   * @param {number} videoId - ID video
   * @returns {Promise<object[]>} - Danh sách bình luận
   */
  async getCommentsByVideoId(videoId) {
    const query = `
      SELECT vc.*, u.username, u.avatar_url
      FROM video_comments vc
      JOIN users u ON vc.user_id = u.id
      WHERE vc.video_id = $1
      ORDER BY vc.created_at ASC;
    `;
    const result = await pool.query(query, [videoId]);
    return result.rows;
  }

  /**
   * 📜 Lấy tất cả bình luận mà 1 user đã viết
   * @param {number} userId - ID người dùng
   * @returns {Promise<object[]>} - Danh sách bình luận
   */
  async getCommentsByUserId(userId) {
    const query = `
      SELECT * FROM video_comments
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * 🔢 Đếm số lượng bình luận của 1 video
   * @param {number} videoId - ID video
   * @returns {Promise<number>} - Số lượng bình luận
   */
  async countCommentsByVideo(videoId) {
    const query = `
      SELECT COUNT(*)::int AS total_comments
      FROM video_comments
      WHERE video_id = $1;
    `;
    const result = await pool.query(query, [videoId]);
    return result.rows[0]?.total_comments || 0;
  }

  /**
   * 🗑️ Xóa toàn bộ bình luận của 1 video (dùng khi xóa video)
   * @param {number} videoId - ID video
   * @returns {Promise<number>} - Số lượng bình luận đã xóa
   */
  async deleteCommentsByVideoId(videoId) {
    const query = `
      DELETE FROM video_comments
      WHERE video_id = $1;
    `;
    const result = await pool.query(query, [videoId]);
    return result.rowCount;
  }
}

module.exports = new VideoCommentDao();
