// services/videoCommentService.js
const videoCommentDao = require("../dao/video_commentDao");

const videoCommentService = {
  async createComment(commentData) {
    if (!commentData.video_id || !commentData.user_id || !commentData.content) {
      throw new Error("Thiếu thông tin để tạo bình luận");
    }
    return await videoCommentDao.create(commentData);
  },

  async getCommentsByVideoId(videoId) {
    return await videoCommentDao.getCommentsByVideoId(videoId);
  },

  async getCommentById(commentId) {
    return await videoCommentDao.findById(commentId);
  },

  async updateComment(commentId, updateData) {
    const existing = await videoCommentDao.findById(commentId);
    if (!existing) throw new Error("Bình luận không tồn tại");
    return await videoCommentDao.update(commentId, updateData);
  },

  async deleteComment(commentId) {
    const existing = await videoCommentDao.findById(commentId);
    if (!existing) throw new Error("Bình luận không tồn tại");
    return await videoCommentDao.delete(commentId);
  }
};

module.exports = videoCommentService;
