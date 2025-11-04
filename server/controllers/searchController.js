const pool = require("../config/db");

/**
 * 🧹 Hàm loại bỏ dấu tiếng Việt (để so sánh không dấu)
 */
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu thanh
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
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

    const normalized = removeVietnameseTones(keyword.trim());
    console.log("🔍 Từ khóa tìm kiếm:", normalized);

    /**
     * 🧱 Lấy toàn bộ dữ liệu thô (vì ta cần xử lý không dấu ở tầng ứng dụng)
     * Ở thực tế bạn nên có limit nhỏ để tránh query quá nặng.
     * JOIN với shop_profiles để lấy thông tin shop
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
        LIMIT 100
      `),
      pool.query("SELECT * FROM videos LIMIT 100"),
      pool.query(
        "SELECT id, username, email, full_name, avatar_url, role FROM users LIMIT 100"
      ),
    ]);

    /**
     * 🧮 Lọc dữ liệu thủ công không dấu
     */
    const products = productsRaw.rows.filter((p) => {
      const name = removeVietnameseTones(p.name || "");
      const desc = removeVietnameseTones(p.description || "");
      return name.includes(normalized) || desc.includes(normalized);
    });

    const videos = videosRaw.rows.filter((v) => {
      const title = removeVietnameseTones(v.title || "");
      const desc = removeVietnameseTones(v.description || "");
      return title.includes(normalized) || desc.includes(normalized);
    });

    const accounts = accountsRaw.rows.filter((a) => {
      const username = removeVietnameseTones(a.username || "");
      const fullname = removeVietnameseTones(a.full_name || "");
      return username.includes(normalized) || fullname.includes(normalized);
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
