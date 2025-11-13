// services/reviewService.js
const reviewDao = require("../dao/reviewDao");

const reviewService = {
  /**
   * 📦 Tạo đánh giá cho đơn hàng (thực chất đánh giá shop)
   * API: POST /reviews/order → Tạo review với target_type: 'shop'
   * @param {object} orderReviewData - { orderId, reviewerId, rating, comment }
   * @returns {Promise<object>}
   */
  async createOrderReview({ orderId, reviewerId, rating, comment }) {
    // Kiểm tra đơn hàng tồn tại và thuộc về reviewer
    const orderDao = require("../dao/orderDao");
    const order = await orderDao.findById("order_id", orderId);

    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }

    if (order.user_id !== reviewerId) {
      throw new Error("Bạn không có quyền đánh giá đơn hàng này");
    }

    if (order.status !== 'completed') {
      throw new Error("Chỉ có thể đánh giá đơn hàng đã hoàn thành");
    }

    // Lấy user_id của shop từ shop_profiles
    const shopProfileDao = require("../dao/shop_profileDao");
    const shopProfile = await shopProfileDao.findById("id", order.shop_id);
    if (!shopProfile) {
      throw new Error("Shop profile không tồn tại");
    }
    const shopUserId = shopProfile.user_id;

    // Kiểm tra đã đánh giá shop cho đơn hàng này chưa
    const alreadyReviewed = await reviewDao.hasReviewed(
      reviewerId,
      shopUserId, // Kiểm tra đã review shop này chưa
      'shop',
      orderId // Kiểm tra theo đơn hàng cụ thể
    );

    if (alreadyReviewed) {
      throw new Error("Bạn đã đánh giá cửa hàng cho đơn hàng này rồi");
    }

    // Tạo review cho shop (không phải cho order)
    const reviewData = {
      reviewer_id: reviewerId,
      target_id: shopUserId, // Sử dụng user_id của shop
      target_type: 'shop',
      order_id: orderId,
      rating,
      comment,
    };

    return await this.createReview(reviewData);
  },

  /**
   * 🚚 Tạo đánh giá cho shipper (review shipper dựa trên order)
   * @param {object} shipperReviewData - { orderId, reviewerId, rating, comment }
   * @returns {Promise<object>}
   */
  async createShipperReview({ orderId, reviewerId, rating, comment }) {
    console.log("createShipperReview called with:", { orderId, reviewerId, rating, comment });
    // Kiểm tra đơn hàng tồn tại và thuộc về reviewer
    const orderDao = require("../dao/orderDao");
    const order = await orderDao.findById("order_id", orderId);

    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }

    if (order.user_id !== reviewerId) {
      throw new Error("Bạn không có quyền đánh giá đơn hàng này");
    }

    if (order.status !== 'completed') {
      throw new Error("Chỉ có thể đánh giá shipper sau khi đơn hàng hoàn thành");
    }

    if (!order.shipper_id) {
      throw new Error("Đơn hàng này không có shipper");
    }

    // Lấy user_id của shipper từ shipper_profiles
    const shipperProfileDao = require("../dao/shipper_profileDao");
    const shipperProfile = await shipperProfileDao.findById("id", order.shipper_id);
    console.log("shipperProfile:", shipperProfile);
    if (!shipperProfile) {
      throw new Error("Shipper profile không tồn tại");
    }
    const shipperUserId = shipperProfile.user_id;
    console.log("shipperUserId:", shipperUserId);

    // Kiểm tra đã đánh giá shipper cho đơn hàng này chưa
    const alreadyReviewed = await reviewDao.hasReviewed(
      reviewerId,
      shipperUserId, // Kiểm tra đã review shipper này chưa
      'shipper',
      orderId // Kiểm tra theo đơn hàng cụ thể
    );
    console.log("Check shipper review:", { reviewerId, shipperUserId, orderId, alreadyReviewed });

    if (alreadyReviewed) {
      throw new Error("Bạn đã đánh giá shipper cho đơn hàng này rồi");
    }

    // Tạo review cho shipper
    const reviewData = {
      reviewer_id: reviewerId,
      target_id: shipperUserId, // Sử dụng user_id của shipper
      target_type: 'shipper',
      order_id: orderId,
      rating,
      comment,
    };

    return await this.createReview(reviewData);
  },

  /**
   * 👤 Tạo đánh giá cho customer (từ shipper)
   * @param {object} userReviewData - { orderId, reviewerId, rating, comment }
   * @returns {Promise<object>}
   */
  async createUserReview({ orderId, reviewerId, rating, comment }) {
    // Kiểm tra đơn hàng tồn tại
    const orderDao = require("../dao/orderDao");
    const order = await orderDao.findById("order_id", orderId);

    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }

    // Kiểm tra reviewer có phải shipper của đơn hàng này không
    const shipperProfileDao = require("../dao/shipper_profileDao");
    const shipperProfile = await shipperProfileDao.findById("id", order.shipper_id);
    if (!shipperProfile || shipperProfile.user_id !== reviewerId) {
      throw new Error("Bạn không phải shipper của đơn hàng này");
    }

    if (order.status !== 'completed') {
      throw new Error("Chỉ có thể đánh giá sau khi đơn hàng hoàn thành");
    }

    // Kiểm tra đã đánh giá customer này cho đơn hàng này chưa
    const alreadyReviewed = await reviewDao.hasReviewed(
      reviewerId,
      order.user_id, // Kiểm tra đã review customer này chưa
      'user'
    );

    if (alreadyReviewed) {
      throw new Error("Bạn đã đánh giá khách hàng này rồi");
    }

    // Tạo review cho customer
    const reviewData = {
      reviewer_id: reviewerId,
      target_id: order.user_id, // Đánh giá customer
      target_type: 'user',
      rating,
      comment,
    };

    return await this.createReview(reviewData);
  },

  /**
   * ➕ Tạo mới một đánh giá
   * @param {object} reviewData - { reviewer_id, target_id, target_type, rating, comment? }
   * @returns {Promise<object>}
   */
  async createReview(reviewData) {
    console.log("createReview called with:", reviewData);
    const { reviewer_id, target_id, target_type, rating, order_id } = reviewData;

    if (!reviewer_id || !target_id || !target_type || !rating) {
      throw new Error("Thiếu thông tin bắt buộc để tạo đánh giá");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating phải nằm trong khoảng từ 1 đến 5");
    }

    // Kiểm tra đã đánh giá chưa (theo order_id nếu có)
    const alreadyReviewed = await reviewDao.hasReviewed(
      reviewer_id,
      target_id,
      target_type,
      order_id // Truyền order_id để kiểm tra theo đơn hàng cụ thể
    );
    if (alreadyReviewed) {
      const msg = order_id 
        ? "Bạn đã đánh giá đối tượng này cho đơn hàng này rồi"
        : "Bạn đã đánh giá đối tượng này rồi";
      throw new Error(msg);
    }

    return await reviewDao.create(reviewData);
  },

  /**
   * 📦 Lấy đánh giá theo ID
   * @param {number} reviewId
   * @returns {Promise<object|null>}
   */
  async getReviewById(reviewId) {
    return await reviewDao.findById("review_id", reviewId);
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
    const existing = await reviewDao.findById("review_id", reviewId);
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
    const existing = await reviewDao.findById("review_id", reviewId);
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

  /**
   * 📊 Lấy thống kê đánh giá cho shop
   * @param {number} shopId - shop profile ID
   * @returns {Promise<object>}
   */
  async getShopReviewStats(shopId) {
    // Lấy user_id của shop từ shop_profiles
    const shopProfileDao = require("../dao/shop_profileDao");
    const shopProfile = await shopProfileDao.findById("id", shopId);
    
    if (!shopProfile) {
      throw new Error("Shop profile không tồn tại");
    }
    
    const shopUserId = shopProfile.user_id;
    
    // Lấy reviews dựa trên user_id của shop, không phải profile ID
    const reviews = await this.getReviewsForTarget(shopUserId, 'shop');
    const averageRating = await this.getAverageRating(shopUserId, 'shop');

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
    });

    return {
      totalReviews: reviews.length,
      averageRating: averageRating || 0,
      ratingDistribution: ratingCounts,
      reviews: reviews
    };
  },

  /**
   * 📊 Lấy thống kê đánh giá cho shipper
   * @param {number} shipperId - shipper profile ID
   * @returns {Promise<object>}
   */
  async getShipperReviewStats(shipperId) {
    // Lấy user_id của shipper từ shipper_profiles
    const shipperProfileDao = require("../dao/shipper_profileDao");
    const shipperProfile = await shipperProfileDao.findById("id", shipperId);
    
    if (!shipperProfile) {
      throw new Error("Shipper profile không tồn tại");
    }
    
    const shipperUserId = shipperProfile.user_id;
    
    // Lấy reviews dựa trên user_id của shipper, không phải profile ID
    const reviews = await this.getReviewsForTarget(shipperUserId, 'shipper');
    const averageRating = await this.getAverageRating(shipperUserId, 'shipper');

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
    });

    return {
      totalReviews: reviews.length,
      averageRating: averageRating || 0,
      ratingDistribution: ratingCounts,
      reviews: reviews
    };
  },

  /**
   * � Lấy thống kê đánh giá cho user
   * @param {number} userId
   * @returns {Promise<object>}
   */
  async getUserReviewStats(userId) {
    const reviews = await this.getReviewsForTarget(userId, 'user');
    const averageRating = await this.getAverageRating(userId, 'user');

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
    });

    return {
      totalReviews: reviews.length,
      averageRating: averageRating || 0,
      ratingDistribution: ratingCounts,
      reviews: reviews
    };
  },

  /**
   * ✅ Kiểm tra trạng thái đánh giá cho đơn hàng
   * @param {number} orderId
   * @param {number} userId
   * @returns {Promise<object>}
   */
  async checkOrderReviewStatus(orderId, userId) {
    // Lấy thông tin đơn hàng
    const orderDao = require("../dao/orderDao");
    const order = await orderDao.findById("order_id", orderId);

    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }

    if (order.user_id !== userId) {
      throw new Error("Bạn không có quyền xem đơn hàng này");
    }

    // Lấy user_id của shipper
    let shipperUserId = null;
    if (order.shipper_id) {
      const shipperProfileDao = require("../dao/shipper_profileDao");
      const shipperProfile = await shipperProfileDao.findById("id", order.shipper_id);
      shipperUserId = shipperProfile?.user_id;
    }

    // Lấy user_id của shop
    let shopUserId = null;
    if (order.shop_id) {
      const shopProfileDao = require("../dao/shop_profileDao");
      const shopProfile = await shopProfileDao.findById("id", order.shop_id);
      shopUserId = shopProfile?.user_id;
    }

    // Kiểm tra đã đánh giá shipper chưa
    const shipperReviewed = shipperUserId 
      ? await reviewDao.hasReviewed(userId, shipperUserId, 'shipper', orderId)
      : false;

    // Kiểm tra đã đánh giá shop chưa
    const shopReviewed = shopUserId
      ? await reviewDao.hasReviewed(userId, shopUserId, 'shop', orderId)
      : false;

    return {
      orderId: orderId,
      shipperReviewed: shipperReviewed,
      shopReviewed: shopReviewed,
      canReview: order.status === 'completed'
    };
  },

  /**
   * 🔄 Cập nhật rating cho user dựa trên reviews
   * @param {number} userId
   * @returns {Promise<number>}
   */
  async updateUserRating(userId) {
    const avgRating = await reviewDao.getAverageRating(userId, 'user');
    
    // Cập nhật vào bảng users
    const userDao = require("../dao/userDao");
    await userDao.update(userId, { rating: avgRating || 0 });
    
    return avgRating || 0;
  },
};

module.exports = reviewService;
