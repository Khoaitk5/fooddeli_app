// services/videoService.js
const videoDao = require("../dao/videoDao"); // dùng DAO mới
const { filterShopsByDistance } = require("../utils/map4d");

/**
 * Helper: chuyển "mm:ss" → số giây
 */
function convertDurationToSeconds(duration) {
  if (!duration) return 0;
  if (typeof duration === "number") return duration;
  if (typeof duration === "string" && duration.includes(":")) {
    const [min, sec] = duration.split(":").map(Number);
    return min * 60 + sec;
  }
  return parseInt(duration) || 0;
}

class VideoService {
  /**
   * ➕ Tạo video mới
   */
  async createVideo(videoData) {
    console.log("[SERVICE:createVideo] input =", videoData);

    // Kiểm tra dữ liệu bắt buộc
    const missing = [];
    if (!videoData?.title) missing.push("title");
    if (!videoData?.video_url) missing.push("video_url");
    if (!videoData?.shop_id && !videoData?.user_id)
      missing.push("owner (shop_id hoặc user_id)");
    if (missing.length > 0) {
      throw new Error("Thiếu thông tin bắt buộc: " + missing.join(", "));
    }

    // Chuẩn hóa dữ liệu
    const payload = {
      title: videoData.title.trim(),
      description: videoData.description?.trim() || "",
      video_url: videoData.video_url.trim(),
      duration: convertDurationToSeconds(videoData.duration),
      shop_id: Number(videoData.shop_id),
      status: videoData.status || "approved",
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
    };

    console.log("[SERVICE:createVideo] payload =", payload);
    return await videoDao.create(payload);
  }

  /**
   * 📜 Lấy tất cả video
   */
  async getAllVideos() {
    return await videoDao.findAll();
  }

  /**
   * 🔎 Lấy video theo ID
   */
  async getVideoById(id) {
    const video = await videoDao.getById(id);
    if (!video) throw new Error("Video không tồn tại");
    return video;
  }

  /**
   * ✏️ Cập nhật video theo ID
   */
  async updateVideo(id, data) {
    const existing = await videoDao.getById(id);
    if (!existing) throw new Error("Video không tồn tại");

    if (data.duration) {
      data.duration = convertDurationToSeconds(data.duration);
    }

    const updated = await videoDao.updateById(id, data);
    console.log("[SERVICE:updateVideo] ✅ updated =", updated);
    return updated;
  }

  /**
   * 🗑️ Xoá video theo ID
   */
  async deleteVideo(id) {
    const existing = await videoDao.getById(id);
    if (!existing) throw new Error("Video không tồn tại");

    const deleted = await videoDao.deleteById(id);
    console.log("[SERVICE:deleteVideo] ✅ deleted =", deleted);
    return deleted;
  }

  /**
   * 📜 Lấy tất cả video của user
   */
  async getVideosByUser(userId) {
    return await videoDao.getVideosByUser(userId);
  }

  /**
   * 🏪 Lấy video theo shop
   */
  async getVideosByShop(shopId) {
    return await videoDao.getVideosByShop(shopId);
  }

  /**
   * 🔥 Lấy video phổ biến nhất
   */
  async getMostLikedVideos(limit = 10) {
    return await videoDao.getMostLikedVideos(limit);
  }

  /**
   * 🔍 Tìm kiếm video
   */
  async searchVideos(keyword, limit = 20, offset = 0) {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không được để trống");
    }
    return await videoDao.searchVideos(keyword, limit, offset);
  }

  /**
   * 📈 Tăng lượt xem video
   */
  async incrementViews(videoId) {
    const existing = await videoDao.getById(videoId);
    if (!existing) throw new Error("Video không tồn tại");
    return await videoDao.incrementViews(videoId);
  }

  /**
   * 🆕 Lấy video mới nhất
   */
  async getLatestVideos(limit = 10) {
    return await videoDao.getLatestVideos(limit);
  }

  /**
   * 🗺️ Lấy video gần vị trí người dùng (DAO mới có SQL tính sẵn)
   */
  async getNearbyVideos({ lat, lng, radiusKm = 10 }) {
    if (!lat || !lng) {
      throw new Error("Thiếu tọa độ người dùng (lat, lng)");
    }
    return await videoDao.getNearbyVideos(lat, lng, radiusKm);
  }

  /**
   * 🗺️ Hoặc: Lấy video gần vị trí (lọc bằng map4d)
   * Dùng nếu muốn lọc logic ngoài DB (giữ tương thích code cũ)
   */
  async getNearbyVideosByFilter(userLocation) {
    if (!userLocation?.lat || !userLocation?.lng) {
      throw new Error("Thiếu tọa độ người dùng (lat, lng)");
    }

    const videos = await videoDao.getVideosWithShopData();
    const nearby = filterShopsByDistance(userLocation, videos, 20);
    nearby.sort((a, b) => b.shop_rating - a.shop_rating);
    return nearby.slice(0, 10);
  }
}

module.exports = new VideoService();
