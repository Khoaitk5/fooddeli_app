// dao/videoCommentDao.js
const FirestoreDao = require("./firestore_dao");
const VideoComment = require("../models/video_comment");

class VideoCommentDao extends FirestoreDao {
  constructor() {
    super("video_comments", VideoComment);
  }

  /**
   * 📜 Lấy tất cả bình luận theo video_id
   * @param {string} videoId - ID video
   * @returns {Promise<object[]>} - Danh sách bình luận
   */
  async getCommentsByVideoId(videoId) {
    const conditions = [{ field: "video_id", operator: "==", value: videoId }];
    return this.findWithConditions(conditions, "created_at", "asc");
  }

  /**
   * 📜 Lấy tất cả bình luận mà 1 user đã viết
   * @param {string} userId - ID người dùng
   * @returns {Promise<object[]>} - Danh sách bình luận
   */
  async getCommentsByUserId(userId) {
    const conditions = [{ field: "user_id", operator: "==", value: userId }];
    return this.findWithConditions(conditions, "created_at", "desc");
  }

  /**
   * 🔢 Đếm số lượng bình luận của 1 video
   * @param {string} videoId - ID video
   * @returns {Promise<number>} - Số lượng bình luận
   */
  async countCommentsByVideo(videoId) {
    try {
      const comments = await this.getCommentsByVideoId(videoId);
      return comments.length;
    } catch (err) {
      console.error("❌ Error in countCommentsByVideo:", err.message);
      throw err;
    }
  }

  /**
   * 🗑️ Xóa toàn bộ bình luận của 1 video (dùng khi xóa video)
   * @param {string} videoId - ID video
   * @returns {Promise<number>} - Số lượng bình luận đã xóa
   */
  async deleteCommentsByVideoId(videoId) {
    try {
      const comments = await this.getCommentsByVideoId(videoId);
      let count = 0;

      for (const comment of comments) {
        await this.delete(comment.id);
        count++;
      }

      return count;
    } catch (err) {
      console.error("❌ Error in deleteCommentsByVideoId:", err.message);
      throw err;
    }
  }
}

module.exports = new VideoCommentDao();
