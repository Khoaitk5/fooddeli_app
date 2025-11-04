// dao/shop_profileDao.js
const GenericDao = require("./generic_dao");
const ShopProfile = require("../models/shop_profile");
const pool = require("../config/db");

class ShopProfileDao extends GenericDao {
  constructor() {
    super("shop_profiles", ShopProfile);
  }

  /**
   * Lấy thông tin shop theo user_id (mỗi shop gắn với một user duy nhất)
   * @param {number} userId - ID người dùng
   * @returns {Promise<ShopProfile|null>} - Hồ sơ shop hoặc null nếu không tồn tại
   */
  async getByUserId(userId) {
    const query = `
      SELECT sp.*, u.avatar_url, u.rating,
        (SELECT p.image_url
         FROM products p
         WHERE p.shop_id = sp.id
           AND p.image_url IS NOT NULL
           AND TRIM(p.image_url) <> ''
         ORDER BY p.updated_at DESC
         LIMIT 1) AS shop_image
      FROM shop_profiles sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.user_id = $1
      LIMIT 1;
    `;
    const result = await pool.query(query, [userId]);
    if (result.rows[0]) {
      const shop = new ShopProfile(result.rows[0]);
      shop.shop_image = result.rows[0].shop_image;
      return shop;
    }
    return null;
  }

  async findDetailsById(shopId) {
    const query = `
      SELECT sp.*, u.avatar_url, u.rating,
        (SELECT p.image_url
         FROM products p
         WHERE p.shop_id = sp.id
           AND p.image_url IS NOT NULL
           AND TRIM(p.image_url) <> ''
         ORDER BY p.updated_at DESC
         LIMIT 1) AS shop_image
      FROM shop_profiles sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.id = $1
    `;
    const result = await pool.query(query, [shopId]);
    if (result.rows[0]) {
      const shop = new ShopProfile(result.rows[0]);
      shop.user_id = result.rows[0].user_id;
      shop.shop_image = result.rows[0].shop_image; // ✅ Thêm ảnh shop từ product
      return shop;
    }

    return null;
  }

  async getShopProfilesAndAddressesByShopId(shopId) {
  const sql = `
    SELECT 
      sp.*,
      CASE WHEN a.address_id IS NULL THEN NULL ELSE to_jsonb(a) END AS address
    FROM shop_profiles sp
    LEFT JOIN addresses a ON a.address_id = sp.shop_address_id
    WHERE sp.id = $1
    LIMIT 1;
  `;
  const { rows } = await pool.query(sql, [shopId]);
  return rows[0] ?? null;
}


  /**
   * 📋 Override findAll() để lấy tất cả shops kèm đầy đủ thông tin
   * Bao gồm: ảnh shop, rating, số đánh giá, số đơn hàng, địa chỉ
   * @returns {Promise<object[]>} - Danh sách tất cả shops với metrics
   */
  async findAll() {
    const query = `
      SELECT
        sp.*,
        u.avatar_url,
        u.rating,
        -- Lấy ảnh từ sản phẩm mới nhất
        (SELECT p.image_url
         FROM products p
         WHERE p.shop_id = sp.id
           AND p.image_url IS NOT NULL
           AND TRIM(p.image_url) <> ''
         ORDER BY p.updated_at DESC
         LIMIT 1) AS shop_image,
        -- Đếm số đánh giá từ bảng reviews (target_type = 'shop')
        (SELECT COUNT(*)::int
         FROM reviews r
         WHERE r.target_id = sp.id
           AND r.target_type = 'shop') AS review_count,
        -- Tính rating trung bình từ reviews
        (SELECT COALESCE(AVG(r.rating), 0)::numeric(3,1)
         FROM reviews r
         WHERE r.target_id = sp.id
           AND r.target_type = 'shop') AS avg_review_rating,
        -- Đếm số đơn hàng đã hoàn thành
        (SELECT COUNT(*)::int
         FROM orders o
         WHERE o.shop_id = sp.id
           AND o.status = 'completed') AS completed_orders,
        -- Lấy thông tin địa chỉ
        a.address_line,
        a.lat_lon
      FROM shop_profiles sp
      JOIN users u ON sp.user_id = u.id
      LEFT JOIN addresses a ON sp.shop_address_id = a.address_id
      WHERE sp.status = 'open'
      ORDER BY sp.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows.map(row => {
      const shop = new ShopProfile(row);
      shop.shop_image = row.shop_image;
      shop.review_count = row.review_count || 0;
      shop.avg_review_rating = row.avg_review_rating || 0;
      shop.completed_orders = row.completed_orders || 0;
      shop.address_line = row.address_line;
      shop.lat_lon = row.lat_lon;
      return shop;
    });
  }

  /**
   * 🍱 Lấy shops theo loại món ăn (category của products)
   * @param {string} foodType - Loại món ăn (mapping từ UI categories)
   * @returns {Promise<object[]>} - Danh sách shops bán loại món đó
   */
  async getShopsByFoodType(foodType) {
    // Mapping từ UI categories sang product categories trong DB
    const categoryMapping = {
      "Đồ Ăn Nhanh": ["Thức ăn", "Combo"],
      "Cơm - Xôi": ["Thức ăn"],
      "Bún - Phở - Mỳ": ["Thức ăn"],
      "Trà Sữa - Cà Phê": ["Đồ uống"],
      "Tráng miệng": ["Tráng miệng"],
    };

    const categories = categoryMapping[foodType] || ["Thức ăn"];

    const query = `
      SELECT DISTINCT ON (sp.id)
        sp.*,
        u.avatar_url,
        u.rating,
        -- Lấy ảnh từ sản phẩm mới nhất
        (SELECT p.image_url
         FROM products p
         WHERE p.shop_id = sp.id
           AND p.image_url IS NOT NULL
           AND TRIM(p.image_url) <> ''
         ORDER BY p.updated_at DESC
         LIMIT 1) AS shop_image,
        -- Đếm số đánh giá
        (SELECT COUNT(*)::int
         FROM reviews r
         WHERE r.target_id = sp.id
           AND r.target_type = 'shop') AS review_count,
        -- Tính rating trung bình
        (SELECT COALESCE(AVG(r.rating), 0)::numeric(3,1)
         FROM reviews r
         WHERE r.target_id = sp.id
           AND r.target_type = 'shop') AS avg_review_rating,
        -- Đếm số đơn hàng đã hoàn thành
        (SELECT COUNT(*)::int
         FROM orders o
         WHERE o.shop_id = sp.id
           AND o.status = 'completed') AS completed_orders,
        -- Lấy thông tin địa chỉ
        a.address_line
      FROM shop_profiles sp
      JOIN users u ON sp.user_id = u.id
      LEFT JOIN addresses a ON sp.shop_address_id = a.address_id
      -- JOIN với products để filter theo category
      INNER JOIN products p ON p.shop_id = sp.id
      WHERE sp.status = 'open'
        AND p.category = ANY($1::varchar[])
        AND p.is_available = true
      ORDER BY sp.id, sp.created_at DESC
    `;

    const result = await pool.query(query, [categories]);
    return result.rows.map(row => {
      const shop = new ShopProfile(row);
      shop.shop_image = row.shop_image;
      shop.review_count = row.review_count || 0;
      shop.avg_review_rating = row.avg_review_rating || 0;
      shop.completed_orders = row.completed_orders || 0;
      shop.address_line = row.address_line;
      return shop;
    });
  }

  /**
   * Cập nhật trạng thái cửa hàng (open/closed/pending)
   * @param {number} shopId - ID shop
   * @param {"open"|"closed"|"pending"} status - trạng thái mới
   * @returns {Promise<ShopProfile|null>} - Shop sau khi cập nhật
   */
  async updateStatus(shopId, status) {
    const allowed = ["open", "closed", "pending"];
    if (!allowed.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const query = `
      UPDATE shop_profiles
      SET status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [status, shopId]);
    return result.rows[0] ? new ShopProfile(result.rows[0]) : null;
  }

  /**
   * Tìm các cửa hàng trong bán kính nhất định (JOIN địa chỉ)
   * @param {number} latitude - vĩ độ người dùng
   * @param {number} longitude - kinh độ người dùng
   * @param {number} radiusKm - bán kính tính theo km
   * @returns {Promise<ShopProfile[]>} - Danh sách cửa hàng trong bán kính
   */
  async findNearbyShops(latitude, longitude, radiusKm = 5) {
    const query = `
      SELECT sp.*, 
        (6371 * acos(
          cos(radians($1)) * cos(radians((a.lat_lon->>'lat')::float)) *
          cos(radians((a.lat_lon->>'lon')::float) - radians($2)) +
          sin(radians($1)) * sin(radians((a.lat_lon->>'lat')::float))
        )) AS distance_km
      FROM shop_profiles sp
      JOIN addresses a ON sp.shop_address_id = a.address_id
      WHERE sp.status = 'open'
      HAVING distance_km <= $3
      ORDER BY distance_km ASC;
    `;
    const result = await pool.query(query, [latitude, longitude, radiusKm]);
    return result.rows.map((r) => new ShopProfile(r));
  }

  /**
 * ✏️ Cập nhật thông tin cửa hàng (override update generic)
 *  → Tránh lỗi multiple assignments to same column "updated_at"
 */
  async updateShopInfo(shopId, data) {
    // ⚙️ Loại bỏ các trường tự động
    delete data.updated_at;
    delete data.created_at;

    const keys = Object.keys(data);
    const values = Object.values(data);

    if (!keys.length) return null;

    const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(", ");

    const query = `
    UPDATE shop_profiles
    SET ${setClause}, updated_at=NOW()
    WHERE id=$${keys.length + 1}
    RETURNING *;
  `;

    const result = await pool.query(query, [...values, shopId]);
    return result.rows[0] ? new ShopProfile(result.rows[0]) : null;
  }

}

module.exports = new ShopProfileDao();
