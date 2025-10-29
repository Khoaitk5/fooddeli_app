const express = require("express");
const multer = require("multer");
const router = express.Router();
const videoController = require("../controllers/videoController");
const { uploadVideoOnly } = require("../controllers/videoUploadController");

console.log("DEBUG [videoRoutes] uploadVideoOnly type =", typeof uploadVideoOnly);
console.log("DEBUG [videoRoutes] uploadVideoOnly =", uploadVideoOnly);

const upload = multer({ storage: multer.memoryStorage() });

// 🟢 Debug mỗi bước đăng ký route
try {
  console.log("✅ Registering route: POST /upload");
  router.post("/upload", upload.single("video"), uploadVideoOnly);

  console.log("✅ Registering route: POST /");
  router.post("/", videoController.createVideo);

  console.log("✅ Registering route: GET /");
  router.get("/", videoController.getAllVideos);

  console.log("✅ Registering route: PUT /:id");
  router.put("/:id", videoController.updateVideo);

  console.log("✅ Registering route: DELETE /:id");
  router.delete("/:id", videoController.deleteVideo);

  console.log("✅ Registering route: GET /:id");
  router.get("/:id", videoController.getVideoById);

  console.log("✅ Registering route: GET /user/:userId");
  router.get("/user/:userId", videoController.getVideosByUser);

  console.log("✅ Registering route: GET /popular");
  router.get("/popular", videoController.getMostLikedVideos);

  console.log("✅ Registering route: GET /search");
  router.get("/search", videoController.searchVideos);

  console.log("✅ Registering route: PUT /views/:id");
  router.put("/views/:id", videoController.incrementViews);

  console.log("✅ Registering route: GET /latest");
  router.get("/latest", videoController.getLatestVideos);

  console.log("✅ Registering route: GET /feed/nearby");
  router.get("/feed/nearby", videoController.getVideosFeed);

  console.log("✅ Registering route: GET /feed/next");
  router.get("/feed/next", videoController.getNextVideo);

  console.log("✅ All video routes registered successfully!\n");
} catch (err) {
  console.error("❌ Route registration failed:", err);
}

module.exports = router;
