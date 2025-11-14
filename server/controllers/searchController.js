const pool = require("../config/db");

// Hàm chuyển đổi tiếng Việt có dấu sang không dấu
const removeVietnameseTones = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

/**
 * 🔍 Tìm kiếm tổng hợp (sản phẩm + video + tài khoản)
 */
exports.searchAll = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Thiếu từ khóa tìm kiếm.",
      });
    }

    console.log("🔍 Từ khóa tìm kiếm:", keyword);

    // Tạo các phiên bản tìm kiếm
    const keywordLower = keyword.toLowerCase();
    const keywordNoTone = removeVietnameseTones(keywordLower);

    /**
     * 🧱 Lấy tất cả dữ liệu và filter ở application level
     * vì PostgreSQL không hỗ trợ remove Vietnamese tones built-in
     */
    const [productsRaw, videosRaw, accountsRaw] = await Promise.all([
      pool.query(`
        SELECT
          p.*,
          sp.shop_name,
          u.avatar_url,
          u.rating AS shop_rating,
          (SELECT p2.image_url
           FROM products p2
           WHERE p2.shop_id = sp.id
             AND p2.image_url IS NOT NULL
             AND TRIM(p2.image_url) <> ''
           ORDER BY p2.updated_at DESC
           LIMIT 1) AS shop_image,
          (SELECT COUNT(*)::int
           FROM reviews r
           WHERE r.target_id = sp.id
             AND r.target_type = 'shop') AS review_count,
          (SELECT COALESCE(AVG(r.rating), 0)::numeric(3,1)
           FROM reviews r
           WHERE r.target_id = sp.id
             AND r.target_type = 'shop') AS avg_review_rating
        FROM products p
        LEFT JOIN shop_profiles sp ON p.shop_id = sp.id
        LEFT JOIN users u ON sp.user_id = u.id
        WHERE p.is_available = TRUE
        ORDER BY p.updated_at DESC
        LIMIT 200
      `),
      pool.query(`
        SELECT * FROM videos
        ORDER BY created_at DESC
        LIMIT 100
      `),
      pool.query(`
        SELECT id, username, email, full_name, avatar_url, role FROM users
        ORDER BY created_at DESC
        LIMIT 100
      `),
    ]);

    /**
     * 🧮 Filter dữ liệu ở application level với hỗ trợ tiếng Việt không dấu
     */
    const products = productsRaw.rows.filter(product => {
      const productName = (product.name || '').toLowerCase();
      const productDesc = (product.description || '').toLowerCase();
      const productNameNoTone = removeVietnameseTones(productName);
      const productDescNoTone = removeVietnameseTones(productDesc);

      return productName.includes(keywordLower) || productDesc.includes(keywordLower) ||
             productNameNoTone.includes(keywordNoTone) || productDescNoTone.includes(keywordNoTone);
    });

    const videos = videosRaw.rows.filter(video => {
      const videoTitle = (video.title || '').toLowerCase();
      const videoDesc = (video.description || '').toLowerCase();
      const videoTitleNoTone = removeVietnameseTones(videoTitle);
      const videoDescNoTone = removeVietnameseTones(videoDesc);

      return videoTitle.includes(keywordLower) || videoDesc.includes(keywordLower) ||
             videoTitleNoTone.includes(keywordNoTone) || videoDescNoTone.includes(keywordNoTone);
    });

    const accounts = accountsRaw.rows.filter(account => {
      const username = (account.username || '').toLowerCase();
      const fullName = (account.full_name || '').toLowerCase();
      const usernameNoTone = removeVietnameseTones(username);
      const fullNameNoTone = removeVietnameseTones(fullName);

      return username.includes(keywordLower) || fullName.includes(keywordLower) ||
             usernameNoTone.includes(keywordNoTone) || fullNameNoTone.includes(keywordNoTone);
    });

    return res.status(200).json({
      success: true,
      products,
      videos,
      accounts,
    });
  } catch (error) {
    console.error("❌ Lỗi searchAll:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm kiếm.",
      error: error.message,
    });
  }
};
