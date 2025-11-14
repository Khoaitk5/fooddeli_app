// routes/videoCommentRoutes.js
const express = require("express");
const router = express.Router();
const videoCommentController = require("../controllers/videoCommentController");

// ➕ Tạo bình luận
router.post("/", videoCommentController.createComment);

// 📜 Lấy bình luận theo video
router.get("/video/:videoId", videoCommentController.getCommentsByVideo);

// 📜 Lấy 1 bình luận
router.get("/:commentId", videoCommentController.getCommentById);

// ✏ Cập nhật
router.put("/:commentId", videoCommentController.updateComment);

// 🗑 Xóa
router.delete("/:commentId", videoCommentController.deleteComment);

module.exports = router;
