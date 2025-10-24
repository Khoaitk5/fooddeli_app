const express = require("express");
const router = express.Router();
const videoLikeController = require("../controllers/videoLikeController");

router.post("/like", videoLikeController.likeVideo);
router.post("/unlike", videoLikeController.unlikeVideo);
router.post("/check", videoLikeController.isLiked);

module.exports = router;
