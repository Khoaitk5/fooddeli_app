// services/videoCommentService.js
const videoCommentDao = require("../dao/video_commentDao");

const videoCommentService = {
  /**
   * ➕ Thêm bình luận mới vào video
   * @param {object} commentData - { video_id, user_id, content }
   * @returns {Promise<object>}
   */
  async createComment(commentData) {
    if (!commentData.video_id || !commentData.user_id || !commentData.content) {
      throw new Error("Thiếu thông tin bắt buộc để tạo bình luận");
    }
    return await videoCommentDao.create(commentData);
  },

  /**
   * 📜 Lấy bình luận theo ID
   * @param {number} commentId
   * @returns {Promise<object|null>}
   */
  async getCommentById(commentId) {
    return await videoCommentDao.findById(commentId);
  },

  /**
   * 📜 Lấy tất cả bình luận của một video
   * @param {number} videoId
   * @returns {Promise<object[]>}
   */
  async getCommentsByVideoId(videoId) {
    return await videoCommentDao.getCommentsByVideoId(videoId);
  },

  /**
   * ✍️ Lấy tất cả bình luận mà một user đã viết
   * @param {number} userId
   * @returns {Promise<object[]>}
   */
  async getCommentsByUserId(userId) {
    return await videoCommentDao.getCommentsByUserId(userId);
  },

  /**
   * 🔢 Đếm số lượng bình luận của một video
   * @param {number} videoId
   * @returns {Promise<number>}
   */
  async countCommentsByVideo(videoId) {
    return await videoCommentDao.countCommentsByVideo(videoId);
  },

  /**
   * ✏️ Cập nhật nội dung bình luận
   * @param {number} commentId
   * @param {object} updateData - { content }
   * @returns {Promise<object>}
   */
  async updateComment(commentId, updateData) {
    const existing = await videoCommentDao.findById(commentId);
    if (!existing) {
      throw new Error("Bình luận không tồn tại");
    }

    if (!updateData.content || updateData.content.trim() === "") {
      throw new Error("Nội dung bình luận không được để trống");
    }

    return await videoCommentDao.update(commentId, updateData);
  },

  /**
   * 🗑️ Xóa một bình luận
   * @param {number} commentId
   * @returns {Promise<boolean>}
   */
  async deleteComment(commentId) {
    const existing = await videoCommentDao.findById(commentId);
    if (!existing) {
      throw new Error("Bình luận không tồn tại");
    }
    return await videoCommentDao.delete(commentId);
  },

  /**
   * 🗑️ Xóa tất cả bình luận của một video (dùng khi xóa video)
   * @param {number} videoId
   * @returns {Promise<number>} - Số lượng bình luận đã xóa
   */
  async deleteCommentsByVideoId(videoId) {
    return await videoCommentDao.deleteCommentsByVideoId(videoId);
  },
};

module.exports = videoCommentService;
