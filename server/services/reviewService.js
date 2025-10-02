// services/reviewService.js
const reviewDao = require("../dao/reviewDao");

const reviewService = {
  /**
   * ➕ Tạo mới một đánh giá
   * @param {object} reviewData - { reviewer_id, target_id, target_type, rating, comment }
   * @returns {Promise<object>}
   */
  async createReview(reviewData) {
    const { reviewer_id, target_id, target_type, rating } = reviewData;

    if (!reviewer_id || !target_id || !target_type || !rating) {
      throw new Error("Thiếu thông tin bắt buộc để tạo đánh giá");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating phải nằm trong khoảng từ 1 đến 5");
    }

    // Kiểm tra đã đánh giá chưa để tránh trùng lặp
    const alreadyReviewed = await reviewDao.hasReviewed(
      reviewer_id,
      target_id,
      target_type
    );
    if (alreadyReviewed) {
      throw new Error("Bạn đã đánh giá đối tượng này rồi");
    }

    return await reviewDao.create(reviewData);
  },

  /**
   * 📦 Lấy đánh giá theo ID
   * @param {number} reviewId
   * @returns {Promise<object|null>}
   */
  async getReviewById(reviewId) {
    return await reviewDao.findById(reviewId);
  },

  /**
   * 📜 Lấy tất cả đánh giá
   * @returns {Promise<object[]>}
   */
  async getAllReviews() {
    return await reviewDao.findAll();
  },

  /**
   * ✏️ Cập nhật nội dung đánh giá
   * @param {number} reviewId
   * @param {object} updateData - { rating?, comment? }
   * @returns {Promise<object>}
   */
  async updateReview(reviewId, updateData) {
    const existing = await reviewDao.findById(reviewId);
    if (!existing) {
      throw new Error("Đánh giá không tồn tại");
    }

    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      throw new Error("Rating phải nằm trong khoảng từ 1 đến 5");
    }

    return await reviewDao.update(reviewId, updateData);
  },

  /**
   * 🗑️ Xóa một đánh giá
   * @param {number} reviewId
   * @returns {Promise<boolean>}
   */
  async deleteReview(reviewId) {
    const existing = await reviewDao.findById(reviewId);
    if (!existing) {
      throw new Error("Đánh giá không tồn tại");
    }
    return await reviewDao.delete(reviewId);
  },

  /**
   * ✍️ Lấy danh sách đánh giá mà 1 người dùng đã viết
   * @param {number} reviewerId
   * @returns {Promise<object[]>}
   */
  async getReviewsByReviewer(reviewerId) {
    return await reviewDao.getReviewsByReviewer(reviewerId);
  },

  /**
   * 🎯 Lấy danh sách đánh giá dành cho một đối tượng cụ thể
   * @param {number} targetId
   * @param {string} targetType - 'user' | 'shop' | 'shipper'
   * @returns {Promise<object[]>}
   */
  async getReviewsForTarget(targetId, targetType) {
    return await reviewDao.getReviewsForTarget(targetId, targetType);
  },

  /**
   * ⭐ Lấy điểm trung bình đánh giá của một đối tượng
   * @param {number} targetId
   * @param {string} targetType - 'user' | 'shop' | 'shipper'
   * @returns {Promise<number|null>}
   */
  async getAverageRating(targetId, targetType) {
    return await reviewDao.getAverageRating(targetId, targetType);
  },

  /**
   * 🔎 Kiểm tra xem một người dùng đã đánh giá một đối tượng chưa
   * @param {number} reviewerId
   * @param {number} targetId
   * @param {string} targetType
   * @returns {Promise<boolean>}
   */
  async hasReviewed(reviewerId, targetId, targetType) {
    return await reviewDao.hasReviewed(reviewerId, targetId, targetType);
  },
};

module.exports = reviewService;
