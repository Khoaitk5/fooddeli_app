// dao/video_commentDao.js
const GenericDao = require("./generic_dao");
const VideoComment = require("../models/video_comment");
const pool = require("../config/db");

class VideoCommentDao extends GenericDao {
  constructor() {
    super("video_comments", VideoComment);
  }

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

  async getCommentsByUserId(userId) {
    const query = `
      SELECT * FROM video_comments
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async countCommentsByVideo(videoId) {
    const query = `
      SELECT COUNT(*)::int AS total_comments
      FROM video_comments
      WHERE video_id = $1;
    `;
    const result = await pool.query(query, [videoId]);
    return result.rows[0]?.total_comments || 0;
  }

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
