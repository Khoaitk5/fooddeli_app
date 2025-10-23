// dao/reviewDao.js
const FirestoreDao = require("./firestore_dao");
const Review = require("../models/review");

class ReviewDao extends FirestoreDao {
  constructor() {
    super("reviews", Review);
  }

  /**
   * Lấy danh sách đánh giá mà 1 người dùng đã viết
   * @param {string} reviewerId - ID người đánh giá
   * @returns {Promise<object[]>} - Danh sách đánh giá
   */
  async getReviewsByReviewer(reviewerId) {
    const conditions = [{ field: "reviewer_id", operator: "==", value: reviewerId }];
    return this.findWithConditions(conditions, "created_at", "desc");
  }

  /**
   * Lấy danh sách đánh giá dành cho một đối tượng (shop/user/shipper)
   * @param {string} targetId - ID của đối tượng được đánh giá
   * @param {string} targetType - Loại đối tượng ('user','shop','shipper')
   * @returns {Promise<object[]>} - Danh sách đánh giá
   */
  async getReviewsForTarget(targetId, targetType) {
    const conditions = [
      { field: "target_id", operator: "==", value: targetId },
      { field: "target_type", operator: "==", value: targetType }
    ];
    return this.findWithConditions(conditions, "created_at", "desc");
  }

  /**
   * Tính điểm trung bình rating cho một đối tượng
   * @param {string} targetId - ID đối tượng
   * @param {string} targetType - 'user' | 'shop' | 'shipper'
   * @returns {Promise<number|null>} - Điểm trung bình hoặc null nếu chưa có đánh giá
   */
  async getAverageRating(targetId, targetType) {
    try {
      const reviews = await this.getReviewsForTarget(targetId, targetType);
      
      if (reviews.length === 0) return null;
      
      const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
      const average = parseFloat((sum / reviews.length).toFixed(2));
      
      return average;
    } catch (err) {
      console.error("❌ Error in getAverageRating:", err.message);
      throw err;
    }
  }

  /**
   * Kiểm tra xem 1 reviewer đã đánh giá 1 đối tượng chưa
   * @param {string} reviewerId - ID người đánh giá
   * @param {string} targetId - ID đối tượng được đánh giá
   * @param {string} targetType - 'user' | 'shop' | 'shipper'
   * @returns {Promise<boolean>} - true nếu đã đánh giá, false nếu chưa
   */
  async hasReviewed(reviewerId, targetId, targetType) {
    try {
      const conditions = [
        { field: "reviewer_id", operator: "==", value: reviewerId },
        { field: "target_id", operator: "==", value: targetId },
        { field: "target_type", operator: "==", value: targetType }
      ];
      const reviews = await this.findWithConditions(conditions);
      return reviews.length > 0;
    } catch (err) {
      console.error("❌ Error in hasReviewed:", err.message);
      throw err;
    }
  }
}

module.exports = new ReviewDao();
