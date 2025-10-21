// services/videoService.js
const videoDao = require("../dao/videoDao");
const { filterShopsByDistance } = require("../utils/map4d");

const videoService = {
  /**
   * ➕ Tạo video mới
   * @param {object} videoData - { title, description, user_id, video_url, thumbnail }
   * @returns {Promise<object>}
   */
  async createVideo(videoData) {
    if (!videoData.title || !videoData.user_id || !videoData.video_url) {
      throw new Error("Thiếu thông tin bắt buộc để tạo video");
    }
    return await videoDao.create(videoData);
  },

  /**
   * 📦 Lấy video theo ID
   * @param {number} videoId
   * @returns {Promise<object|null>}
   */
  async getVideoById(videoId) {
    return await videoDao.findById(videoId);
  },

  /**
   * 📜 Lấy tất cả video
   * @returns {Promise<object[]>}
   */
  async getAllVideos() {
    return await videoDao.findAll();
  },

  /**
   * ✏️ Cập nhật thông tin video
   * @param {number} videoId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateVideo(videoId, updateData) {
    const existing = await videoDao.findById(videoId);
    if (!existing) {
      throw new Error("Video không tồn tại");
    }
    return await videoDao.update(videoId, updateData);
  },

  /**
   * 🗑️ Xóa video
   * @param {number} videoId
   * @returns {Promise<boolean>}
   */
  async deleteVideo(videoId) {
    const existing = await videoDao.findById(videoId);
    if (!existing) {
      throw new Error("Video không tồn tại");
    }
    return await videoDao.delete(videoId);
  },

  /**
   * 📜 Lấy tất cả video do một user đăng
   * @param {number} userId
   * @returns {Promise<object[]>}
   */
  async getVideosByUser(userId) {
    return await videoDao.getVideosByUser(userId);
  },

  /**
   * 🔥 Lấy video phổ biến nhất (dựa theo lượt thích)
   * @param {number} limit
   * @returns {Promise<object[]>}
   */
  async getMostLikedVideos(limit = 10) {
    return await videoDao.getMostLikedVideos(limit);
  },

  /**
   * 🔍 Tìm kiếm video theo tiêu đề hoặc mô tả
   * @param {string} keyword
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<object[]>}
   */
  async searchVideos(keyword, limit = 20, offset = 0) {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không được để trống");
    }
    return await videoDao.searchVideos(keyword, limit, offset);
  },

  /**
   * 📈 Tăng lượt xem video
   * @param {number} videoId
   * @returns {Promise<object>}
   */
  async incrementViews(videoId) {
    const existing = await videoDao.findById(videoId);
    if (!existing) {
      throw new Error("Video không tồn tại");
    }
    return await videoDao.incrementViews(videoId);
  },

  /**
   * 🆕 Lấy danh sách video mới nhất
   * @param {number} limit
   * @returns {Promise<object[]>}
   */
  async getLatestVideos(limit = 10) {
    return await videoDao.getLatestVideos(limit);
  },

  /**
   * 🗺️ Lấy danh sách video trong bán kính 10km quanh vị trí người dùng
   *  - Dùng để hiển thị feed kiểu TikTok
   *  - Sắp xếp theo rating shop giảm dần
   * @param {{ lat: number, lng: number }} userLocation
   * @returns {Promise<object[]>}
   */
  async getNearbyVideos(userLocation) {
    if (!userLocation || !userLocation.lat || !userLocation.lng) {
      throw new Error("Thiếu tọa độ người dùng (lat, lng)");
    }

    // Lấy tất cả video kèm dữ liệu shop
    const videos = await videoDao.getVideosWithShopData();
    //console.log("📦 DEBUG ALL VIDEOS FROM DB:", videos);

    // Lọc theo khoảng cách ≤ 10 km
    const nearby = filterShopsByDistance(userLocation, videos, 20);
    console.log("📍 DEBUG AFTER DISTANCE FILTER:", nearby);

    // Sắp xếp theo rating giảm dần
    nearby.sort((a, b) => b.shop_rating - a.shop_rating);

    // Lấy 10 video đầu tiên
    return nearby.slice(0, 10);
  }
};

module.exports = videoService;
