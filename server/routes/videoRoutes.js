const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

// CRUD
router.post("/", videoController.createVideo);
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoById);
router.put("/:id", videoController.updateVideo);
router.delete("/:id", videoController.deleteVideo);

// Extra features
router.get("/user/:userId", videoController.getVideosByUser);
router.get("/popular", videoController.getMostLikedVideos);
router.get("/search", videoController.searchVideos);
router.put("/views/:id", videoController.incrementViews);
router.get("/latest", videoController.getLatestVideos);

// Feed theo vị trí
router.get("/feed/nearby", videoController.getVideosFeed);
router.get("/feed/next", videoController.getNextVideo);

module.exports = router;