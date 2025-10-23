// dao/videoDao.js
const FirestoreDao = require("./firestore_dao");
const Video = require("../models/video");

class VideoDao extends FirestoreDao {
  constructor() {
    super("videos", Video);
  }

  /**
   * 📜 Lấy tất cả video mà một người dùng đã đăng
   * @param {string} userId - ID người đăng
   * @returns {Promise<object[]>} - Danh sách video
   */
  async getVideosByUser(userId) {
    const conditions = [{ field: "user_id", operator: "==", value: userId }];
    return this.findWithConditions(conditions, "created_at", "desc");
  }

  /**
   * 📜 Lấy video của shop
   */
  async getVideosByShop(shopId) {
    const conditions = [
      { field: "shop_id", operator: "==", value: shopId },
      { field: "status", operator: "==", value: "approved" }
    ];
    return this.findWithConditions(conditions, "created_at", "desc");
  }

  /**
   * 🔥 Lấy danh sách video phổ biến nhất (dựa theo lượt thích)
   * @param {number} limit - số lượng video cần lấy
   * @returns {Promise<object[]>} - Danh sách video phổ biến
   */
  async getMostLikedVideos(limit = 10) {
    try {
      const allVideos = await this.findAll();
      
      // Sắp xếp theo likes_count giảm dần, sau đó theo created_at
      allVideos.sort((a, b) => {
        const likeDiff = (b.likes_count || 0) - (a.likes_count || 0);
        if (likeDiff !== 0) return likeDiff;
        
        const aTime = a.created_at?.toDate?.() || new Date(0);
        const bTime = b.created_at?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      
      return allVideos.slice(0, limit);
    } catch (err) {
      console.error("❌ Error in getMostLikedVideos:", err.message);
      throw err;
    }
  }

  /**
   * 🔍 Tìm kiếm video theo tiêu đề hoặc mô tả
   * @param {string} keyword - từ khóa tìm kiếm
   * @param {number} [limit=20] - số lượng kết quả
   * @param {number} [offset=0] - bắt đầu từ vị trí
   * @returns {Promise<object[]>} - Danh sách video khớp từ khóa
   */
  async searchVideos(keyword, limit = 20, offset = 0) {
    try {
      const allVideos = await this.findAll();
      const keywordLower = keyword.toLowerCase();
      
      // Lọc video chứa keyword trong title hoặc description
      const filtered = allVideos.filter(v => 
        (v.title && v.title.toLowerCase().includes(keywordLower)) ||
        (v.description && v.description.toLowerCase().includes(keywordLower))
      );
      
      // Sắp xếp theo created_at
      filtered.sort((a, b) => {
        const aTime = a.created_at?.toDate?.() || new Date(0);
        const bTime = b.created_at?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      
      // Pagination
      return filtered.slice(offset, offset + limit);
    } catch (err) {
      console.error("❌ Error in searchVideos:", err.message);
      throw err;
    }
  }

  /**
   * 📈 Tăng lượt xem video thêm 1
   * @param {string} videoId - ID video
   * @returns {Promise<object>} - Video sau khi cập nhật
   */
  async incrementViews(videoId) {
    try {
      const video = await this.findById(videoId);
      if (!video) return null;
      
      const newViewsCount = (video.views_count || 0) + 1;
      return this.update(videoId, { views_count: newViewsCount });
    } catch (err) {
      console.error("❌ Error in incrementViews:", err.message);
      throw err;
    }
  }

  /**
   * 🆕 Lấy danh sách video mới nhất
   * @param {number} limit - số lượng video cần lấy
   * @returns {Promise<object[]>} - Danh sách video mới nhất
   */
  async getLatestVideos(limit = 10) {
    return this.getWithOrdering("created_at", "desc", limit);
  }

  /**
   * 🗺️ Lấy toàn bộ video có thông tin vị trí của shop (lat/lon, rating)
   * Dùng cho thuật toán lọc theo khoảng cách
   */
  async getVideosWithShopData() {
    try {
      const allVideos = await this.findAll();
      
      // Lọc video đã approved
      return allVideos.filter(v => v.status === "approved");
    } catch (err) {
      console.error("❌ Error in getVideosWithShopData:", err.message);
      throw err;
    }
  }

  /**
   * 🧭 Lấy video của các shop trong bán kính 10km quanh vị trí người dùng
   */
  async getVideosNearby(userLocation, maxDistanceKm = 10) {
    const allVideos = await this.getVideosWithShopData();
    return allVideos;
  }
}

module.exports = new VideoDao();
