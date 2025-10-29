// routes/videoRoutes.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
const videoController = require("../controllers/videoController");
const { uploadVideoOnly } = require("../controllers/videoUploadController");

const upload = multer({ storage: multer.memoryStorage() });

// Upload
router.post("/upload", upload.single("video"), uploadVideoOnly);

// CRUD
router.post("/", videoController.createVideo);
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoById);
router.put("/:id", videoController.updateVideo);
router.delete("/:id", videoController.deleteVideo);

// Extra features
router.get("/user/:userId", videoController.getVideosByUser);
router.get("/shop/:shopId", videoController.getVideosByShop);
router.get("/popular", videoController.getMostLikedVideos);
router.get("/search", videoController.searchVideos);
router.put("/views/:id", videoController.incrementViews);
router.get("/latest", videoController.getLatestVideos);

// Feed
router.get("/feed/nearby", videoController.getVideosFeed);
router.get("/feed/next", videoController.getNextVideo);

module.exports = router;
