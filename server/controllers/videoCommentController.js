// controllers/videoCommentController.js
const videoCommentService = require("../services/videoCommentService");

const videoCommentController = {
  async createComment(req, res) {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập" });
      }

      const { video_id, content } = req.body;

      const newComment = await videoCommentService.createComment({
        video_id,
        user_id: userId,
        content
      });

      return res.json({ success: true, data: newComment });

    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Lỗi server" });
    }
  },

  async getCommentsByVideo(req, res) {
    try {
      const videoId = req.params.videoId;
      const comments = await videoCommentService.getCommentsByVideoId(videoId);
      res.json({ success: true, data: comments });
    } catch (err) {
      res.status(500).json({ success: false, message: "Không thể lấy comment" });
    }
  },

  async getCommentById(req, res) {
    try {
      const commentId = req.params.commentId;
      const comment = await videoCommentService.getCommentById(commentId);
      res.json({ success: true, data: comment });
    } catch (err) {
      res.status(500).json({ success: false, message: "Lỗi server" });
    }
  },

  async updateComment(req, res) {
    try {
      const commentId = req.params.commentId;
      const result = await videoCommentService.updateComment(commentId, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: "Không thể cập nhật" });
    }
  },

  async deleteComment(req, res) {
    try {
      const commentId = req.params.commentId;
      await videoCommentService.deleteComment(commentId);
      res.json({ success: true, message: "Đã xóa" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Không thể xóa" });
    }
  }
};

module.exports = videoCommentController;
