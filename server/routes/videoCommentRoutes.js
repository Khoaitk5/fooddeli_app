import express from "express";
import videoCommentController from "../controllers/videoCommentController.js";

const router = express.Router();

router.post("/", videoCommentController.createComment);
router.get("/video/:videoId", videoCommentController.getCommentsByVideo);
router.get("/:commentId", videoCommentController.getCommentById);
router.put("/:commentId", videoCommentController.updateComment);
router.delete("/:commentId", videoCommentController.deleteComment);

export default router;
