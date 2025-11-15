import GenericDao from "./generic_dao.js";
import VideoComment from "../models/video_comment.js";
import pool from "../config/db.js";

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
      ORDER BY vc.created_at DESC;
    `;
    const result = await pool.query(query, [videoId]);
    return result.rows;
  }

  async getCommentWithUser(commentId) {
    const query = `
      SELECT vc.*, u.username, u.avatar_url
      FROM video_comments vc
      JOIN users u ON vc.user_id = u.id
      WHERE vc.id = $1;
    `;
    const result = await pool.query(query, [commentId]);
    return result.rows[0];
  }
}

export default new VideoCommentDao();
