// controllers/reviewController.js
const reviewService = require("../services/reviewService");

/**
 * 📝 Tạo đánh giá mới cho đơn hàng
 * POST /api/reviews/order
 */
exports.createOrderReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    const reviewerId = req.session?.user?.id;

    if (!reviewerId) {
      return res.status(401).json({
        success: false,
        message: "Bạn cần đăng nhập để đánh giá"
      });
    }

    if (!orderId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin đơn hàng hoặc rating"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating phải từ 1 đến 5 sao"
      });
    }

    const review = await reviewService.createOrderReview({
      orderId,
      reviewerId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Cảm ơn bạn đã đánh giá!",
      data: review
    });

  } catch (err) {
    console.error("[ReviewController:createOrderReview]", err.message);

    if (err.message.includes("đã đánh giá")) {
      return res.status(409).json({
        success: false,
        message: err.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Không thể gửi đánh giá. Vui lòng thử lại."
    });
  }
};

/**
 * � Tạo đánh giá cho shipper
 * POST /api/reviews/shipper
 */
exports.createShipperReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    const reviewerId = req.session?.user?.id;
    console.log("createShipperReview controller:", { orderId, rating, comment, reviewerId });

    if (!reviewerId) {
      return res.status(401).json({
        success: false,
        message: "Bạn cần đăng nhập để đánh giá"
      });
    }

    if (!orderId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin đơn hàng hoặc rating"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating phải từ 1 đến 5 sao"
      });
    }

    const review = await reviewService.createShipperReview({
      orderId,
      reviewerId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Cảm ơn bạn đã đánh giá shipper!",
      data: review
    });

  } catch (err) {
    console.error("[ReviewController:createShipperReview]", err.message);

    if (err.message.includes("đã đánh giá")) {
      return res.status(409).json({
        success: false,
        message: err.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Không thể gửi đánh giá. Vui lòng thử lại."
    });
  }
};

/**
 * �📋 Lấy đánh giá của người dùng hiện tại
 * GET /api/reviews/my-reviews
 */
exports.getMyReviews = async (req, res) => {
  try {
    const reviewerId = req.session?.user?.id;

    if (!reviewerId) {
      return res.status(401).json({
        success: false,
        message: "Bạn cần đăng nhập"
      });
    }

    const reviews = await reviewService.getReviewsByReviewer(reviewerId);

    res.status(200).json({
      success: true,
      data: reviews
    });

  } catch (err) {
    console.error("[ReviewController:getMyReviews]", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * 📊 Lấy thống kê đánh giá cho một shop
 * GET /api/reviews/shop/:shopId/stats
 */
exports.getShopReviewStats = async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu shopId"
      });
    }

    const stats = await reviewService.getShopReviewStats(shopId);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (err) {
    console.error("[ReviewController:getShopReviewStats]", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * � Tạo đánh giá cho customer (từ shipper)
 * POST /api/reviews/user
 */
exports.createUserReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    const reviewerId = req.session?.user?.id;

    if (!reviewerId) {
      return res.status(401).json({
        success: false,
        message: "Bạn cần đăng nhập để đánh giá"
      });
    }

    if (!orderId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin đơn hàng hoặc rating"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating phải từ 1 đến 5 sao"
      });
    }

    const review = await reviewService.createUserReview({
      orderId,
      reviewerId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Cảm ơn bạn đã đánh giá khách hàng!",
      data: review
    });

  } catch (err) {
    console.error("[ReviewController:createUserReview]", err.message);

    if (err.message.includes("đã đánh giá")) {
      return res.status(409).json({
        success: false,
        message: err.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Không thể gửi đánh giá. Vui lòng thử lại."
    });
  }
};

/**
 * �📊 Lấy thống kê đánh giá cho một shipper
 * GET /api/reviews/shipper/:shipperId/stats
 */
exports.getShipperReviewStats = async (req, res) => {
  try {
    const { shipperId } = req.params;

    if (!shipperId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu shipperId"
      });
    }

    const stats = await reviewService.getShipperReviewStats(shipperId);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (err) {
    console.error("[ReviewController:getShipperReviewStats]", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * � Lấy thống kê đánh giá cho một user
 * GET /api/reviews/user/:userId/stats
 */
exports.getUserReviewStats = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId"
      });
    }

    const stats = await reviewService.getUserReviewStats(userId);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (err) {
    console.error("[ReviewController:getUserReviewStats]", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * ✅ Kiểm tra trạng thái đánh giá cho đơn hàng
 * GET /api/reviews/order/:orderId/status
 */
exports.checkOrderReviewStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Bạn cần đăng nhập"
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu orderId"
      });
    }

    const status = await reviewService.checkOrderReviewStatus(orderId, userId);

    res.status(200).json({
      success: true,
      data: status
    });

  } catch (err) {
    console.error("[ReviewController:checkOrderReviewStatus]", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};