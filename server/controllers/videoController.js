// controllers/videoController.js
const videoService = require("../services/videoService");

/**
 * ➕ Tạo video mới
 */
const createVideo = async (req, res) => {
  try {
    const videoData = req.body;
    const newVideo = await videoService.createVideo(videoData);

    res.status(201).json({
      success: true,
      message: "Tạo video thành công",
      data: newVideo,
    });
  } catch (error) {
    console.error("❌ [createVideo] Lỗi:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 📦 Lấy tất cả video
 */
const getAllVideos = async (req, res) => {
  try {
    const videos = await videoService.getAllVideos();
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error("❌ [getAllVideos] Lỗi:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

/**
 * 🔍 Lấy video theo ID
 */
const getVideoById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const video = await videoService.getVideoById(id);

    if (!video)
      return res.status(404).json({ success: false, message: "Không tìm thấy video" });

    res.status(200).json({ success: true, data: video });
  } catch (error) {
    console.error("❌ [getVideoById] Lỗi:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * ✏️ Cập nhật video
 */
const updateVideo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    const updated = await videoService.updateVideo(id, updateData);

    res.status(200).json({
      success: true,
      message: "Cập nhật video thành công",
      data: updated,
    });
  } catch (error) {
    console.error("❌ [updateVideo] Lỗi:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 🗑️ Xóa video
 */
const deleteVideo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await videoService.deleteVideo(id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Video không tồn tại" });

    res.status(200).json({ success: true, message: "Đã xóa video thành công" });
  } catch (error) {
    console.error("❌ [deleteVideo] Lỗi:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

/**
 * 📜 Lấy tất cả video của user
 */
const getVideosByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const videos = await videoService.getVideosByUser(userId);

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error("❌ [getVideosByUser] Lỗi:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

/**
 * 🏪 Lấy video theo shop
 */
const getVideosByShop = async (req, res) => {
  try {
    const shopId = parseInt(req.params.shopId);
    const videos = await videoService.getVideosByShop(shopId);

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error("❌ [getVideosByShop] Lỗi:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

/**
 * 🔥 Lấy video phổ biến nhất
 */
const getMostLikedVideos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const videos = await videoService.getMostLikedVideos(limit);

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error("❌ [getMostLikedVideos] Lỗi:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

/**
 * 🔍 Tìm kiếm video theo tiêu đề/mô tả
 */
const searchVideos = async (req, res) => {
  try {
    const keyword = req.query.q || "";
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const results = await videoService.searchVideos(keyword, limit, offset);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("❌ [searchVideos] Lỗi:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 📈 Tăng lượt xem video
 */
const incrementViews = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedVideo = await videoService.incrementViews(id);

    res.status(200).json({
      success: true,
      message: "Đã tăng lượt xem video",
      data: updatedVideo,
    });
  } catch (error) {
    console.error("❌ [incrementViews] Lỗi:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 🆕 Lấy video mới nhất
 */
const getLatestVideos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const videos = await videoService.getLatestVideos(limit);

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error("❌ [getLatestVideos] Lỗi:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

/**
 * 🗺️ Lấy video gần vị trí người dùng (feed 10km)
 */
const getVideosFeed = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ message: "Thiếu tọa độ người dùng" });

    const videos = await videoService.getNearbyVideos({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách video gần bạn",
      count: videos.length,
      data: videos.slice(0, 10),
    });
  } catch (error) {
    console.error("❌ [getVideosFeed] Lỗi:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * ⏭️ Lấy video kế tiếp trong feed
 */
const getNextVideo = async (req, res) => {
  try {
    const { lat, lng, viewed } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ message: "Thiếu tọa độ người dùng" });

    const viewedIds = viewed ? viewed.split(",").map(Number) : [];
    const videos = await videoService.getNearbyVideos({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });

    const next = videos.find(v => !viewedIds.includes(v.video_id));
    if (!next) return res.status(404).json({ message: "Không còn video mới" });

    res.status(200).json({ success: true, data: next });
  } catch (error) {
    console.error("❌ [getNextVideo] Lỗi:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Export tất cả controller
module.exports = {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getVideosByUser,
  getVideosByShop,
  getMostLikedVideos,
  searchVideos,
  incrementViews,
  getLatestVideos,
  getVideosFeed,
  getNextVideo,
};
