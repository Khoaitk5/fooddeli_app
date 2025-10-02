// services/videoLikeService.js
const videoLikeDao = require("../dao/video_likeDao");

const videoLikeService = {
  /**
   * ❤️ Thêm lượt thích cho video (nếu chưa like)
   * @param {number} videoId
   * @param {number} userId
   * @returns {Promise<object>}
   */
  async addLike(videoId, userId) {
    if (!videoId || !userId) {
      throw new Error("Thiếu videoId hoặc userId");
    }
    return await videoLikeDao.addLike(videoId, userId);
  },

  /**
   * 💔 Gỡ lượt thích (unlike) khỏi video
   * @param {number} videoId
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  async removeLike(videoId, userId) {
    if (!videoId || !userId) {
      throw new Error("Thiếu videoId hoặc userId");
    }

    const hasLiked = await videoLikeDao.hasUserLiked(videoId, userId);
    if (!hasLiked) {
      throw new Error("User chưa like video này");
    }

    return await videoLikeDao.removeLike(videoId, userId);
  },

  /**
   * 📊 Kiểm tra xem user đã like video chưa
   * @param {number} videoId
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  async hasUserLiked(videoId, userId) {
    return await videoLikeDao.hasUserLiked(videoId, userId);
  },

  /**
   * 📜 Lấy danh sách tất cả người dùng đã like video
   * @param {number} videoId
   * @returns {Promise<object[]>}
   */
  async getLikesByVideoId(videoId) {
    return await videoLikeDao.getLikesByVideoId(videoId);
  },

  /**
   * 🔢 Đếm tổng số lượt thích của video
   * @param {number} videoId
   * @returns {Promise<number>}
   */
  async countLikes(videoId) {
    return await videoLikeDao.countLikes(videoId);
  },

  /**
   * ❤️‍🔥 Toggle like: nếu chưa like thì thêm, nếu đã like thì bỏ like
   * @param {number} videoId
   * @param {number} userId
   * @returns {Promise<{liked: boolean, total_likes: number}>}
   */
  async toggleLike(videoId, userId) {
    const hasLiked = await videoLikeDao.hasUserLiked(videoId, userId);

    if (hasLiked) {
      await videoLikeDao.removeLike(videoId, userId);
      const total = await videoLikeDao.countLikes(videoId);
      return { liked: false, total_likes: total };
    } else {
      await videoLikeDao.addLike(videoId, userId);
      const total = await videoLikeDao.countLikes(videoId);
      return { liked: true, total_likes: total };
    }
  },
};

module.exports = videoLikeService;
