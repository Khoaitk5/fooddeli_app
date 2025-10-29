// services/videoService.js
const videoDao = require("../dao/videoDao");

/**
 * ✅ Helper: chuyển "mm:ss" → tổng số giây
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
  // 🧩 Tạo video mới
  async createVideo(videoData) {
    console.log("[SERVICE:createVideo] input =", videoData);

    // ✅ Kiểm tra dữ liệu bắt buộc
    const missing = [];
    if (!videoData?.title) missing.push("title");
    if (!videoData?.video_url) missing.push("video_url");
    if (!videoData?.shop_id && !videoData?.user_id) missing.push("owner (shop_id hoặc user_id)");

    if (missing.length > 0) {
      const msg = `Thiếu thông tin bắt buộc: ${missing.join(", ")}`;
      console.warn("[SERVICE:createVideo] validation fail:", msg);
      throw new Error(msg);
    }

    // ✅ Chuẩn hóa dữ liệu trước khi lưu
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

    console.log("[SERVICE:createVideo] persist payload =", payload);

    try {
      const created = await videoDao.create(payload);
      console.log("[SERVICE:createVideo] ✅ created =", created);
      return created;
    } catch (err) {
      console.error("[SERVICE:createVideo] ❌ error:", err.message);
      throw err;
    }
  }

  // 📋 Lấy tất cả video
  async getAllVideos() {
    try {
      console.log("[SERVICE:getAllVideos]");
      return await videoDao.getAll();
    } catch (err) {
      console.error("[SERVICE:getAllVideos] error:", err.message);
      throw err;
    }
  }

  // 📋 Lấy video theo ID
  async getVideoById(id) {
    try {
      console.log("[SERVICE:getVideoById] id=", id);
      return await videoDao.getById(id);
    } catch (err) {
      console.error("[SERVICE:getVideoById] error:", err.message);
      throw err;
    }
  }

  // ✏️ Cập nhật video
  async updateVideo(id, data) {
    try {
      console.log("[SERVICE:updateVideo] id=", id, "data=", data);
      if (data.duration) data.duration = convertDurationToSeconds(data.duration);
      return await videoDao.updateById(id, data);
    } catch (err) {
      console.error("[SERVICE:updateVideo] error:", err.message);
      throw err;
    }
  }

  // ❌ Xoá video
  async deleteVideo(id) {
    try {
      console.log("[SERVICE:deleteVideo] id=", id);
      return await videoDao.deleteById(id);
    } catch (err) {
      console.error("[SERVICE:deleteVideo] error:", err.message);
      throw err;
    }
  }

  // 🔥 Lấy video phổ biến
  async getMostLikedVideos(limit = 10) {
    try {
      console.log(`[SERVICE:getMostLikedVideos] limit=${limit}`);
      return await videoDao.getMostLikedVideos(limit);
    } catch (err) {
      console.error("[SERVICE:getMostLikedVideos] error:", err.message);
      throw err;
    }
  }

  // 🔍 Tìm kiếm video
  async searchVideos(keyword, limit = 20, offset = 0) {
    try {
      console.log(`[SERVICE:searchVideos] keyword="${keyword}", limit=${limit}, offset=${offset}`);
      return await videoDao.searchVideos(keyword, limit, offset);
    } catch (err) {
      console.error("[SERVICE:searchVideos] error:", err.message);
      throw err;
    }
  }

  // 📈 Tăng lượt xem
  async incrementViews(videoId) {
    try {
      console.log(`[SERVICE:incrementViews] videoId=${videoId}`);
      return await videoDao.incrementViews(videoId);
    } catch (err) {
      console.error("[SERVICE:incrementViews] error:", err.message);
      throw err;
    }
  }

  // 🆕 Lấy video mới nhất
  async getLatestVideos(limit = 10) {
    try {
      console.log(`[SERVICE:getLatestVideos] limit=${limit}`);
      return await videoDao.getLatestVideos(limit);
    } catch (err) {
      console.error("[SERVICE:getLatestVideos] error:", err.message);
      throw err;
    }
  }

  // 🗺️ Lấy video gần vị trí người dùng
  async getNearbyVideos({ lat, lng, radiusKm = 10 }) {
    try {
      console.log(`[SERVICE:getNearbyVideos] lat=${lat}, lng=${lng}, radius=${radiusKm}km`);
      return await videoDao.getNearbyVideos(lat, lng, radiusKm);
    } catch (err) {
      console.error("[SERVICE:getNearbyVideos] error:", err.message);
      throw err;
    }
  }
}

module.exports = new VideoService();
