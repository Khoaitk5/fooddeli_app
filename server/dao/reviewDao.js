// dao/reviewDao.js
const GenericDao = require("./generic_dao");
const Review = require("../models/review");

class ReviewDao extends GenericDao {
  constructor() {
    super("reviews", Review);
  }

  /**
   * Lấy danh sách đánh giá mà 1 người dùng đã viết
   * @param {number} reviewerId - ID người đánh giá
   * @returns {Promise<object[]>} - Danh sách đánh giá
   */
  async getReviewsByReviewer(reviewerId) {
    const query = `
      SELECT * FROM reviews
      WHERE reviewer_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [reviewerId]);
    return result.rows;
  }

  /**
   * Lấy danh sách đánh giá dành cho một đối tượng (shop/user/shipper)
   * @param {number} targetId - ID của đối tượng được đánh giá
   * @param {string} targetType - Loại đối tượng ('user','shop','shipper')
   * @returns {Promise<object[]>} - Danh sách đánh giá
   */
  async getReviewsForTarget(targetId, targetType) {
    const query = `
      SELECT * FROM reviews
      WHERE target_id = $1 AND target_type = $2
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [targetId, targetType]);
    return result.rows;
  }

  /**
   * Tính điểm trung bình rating cho một đối tượng
   * @param {number} targetId - ID đối tượng
   * @param {string} targetType - 'user' | 'shop' | 'shipper'
   * @returns {Promise<number|null>} - Điểm trung bình hoặc null nếu chưa có đánh giá
   */
  async getAverageRating(targetId, targetType) {
    const query = `
      SELECT AVG(rating)::numeric(3,2) as avg_rating
      FROM reviews
      WHERE target_id = $1 AND target_type = $2;
    `;
    const result = await this.db.query(query, [targetId, targetType]);
    return result.rows[0]?.avg_rating || null;
  }

  /**
   * Kiểm tra xem 1 reviewer đã đánh giá 1 đối tượng chưa
   * @param {number} reviewerId - ID người đánh giá
   * @param {number} targetId - ID đối tượng được đánh giá
   * @param {string} targetType - 'user' | 'shop' | 'shipper'
   * @returns {Promise<boolean>} - true nếu đã đánh giá, false nếu chưa
   */
  async hasReviewed(reviewerId, targetId, targetType) {
    const query = `
      SELECT 1 FROM reviews
      WHERE reviewer_id = $1 AND target_id = $2 AND target_type = $3
      LIMIT 1;
    `;
    const result = await this.db.query(query, [reviewerId, targetId, targetType]);
    return result.rowCount > 0;
  }
}

module.exports = new ReviewDao();
