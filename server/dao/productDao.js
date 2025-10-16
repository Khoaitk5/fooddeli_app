const GenericDao = require("./generic_dao");
const Product = require("../models/product");
const pool = require("../config/db");

class ProductDao extends GenericDao {
  constructor() {
    super("products", Product);
  }

  /** 
   * Cập nhật trạng thái is_available (còn bán / ngừng bán)
   */
  async updateAvailability(productId, isAvailable) {
    if (typeof isAvailable !== "boolean") {
      throw new Error("isAvailable phải là boolean");
    }

    const query = `
      UPDATE products
      SET is_available = $1,
          updated_at = NOW()
      WHERE product_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [isAvailable, productId]);
    return result.rows[0];
  }

  /** 
   * Cập nhật danh mục (category) của sản phẩm
   */
  async updateCategory(productId, category) {
    const validCategories = ["Thức ăn", "Đồ uống", "Tráng miệng", "Khác"];
    if (!validCategories.includes(category)) {
      throw new Error(
        `Danh mục không hợp lệ. Chỉ chấp nhận: ${validCategories.join(", ")}`
      );
    }

    const query = `
      UPDATE products
      SET category = $1,
          updated_at = NOW()
      WHERE product_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [category, productId]);
    return result.rows[0];
  }

  /** 
   * Lấy tất cả sản phẩm thuộc về 1 shop
   */
  async getProductsByShop(shopId) {
    const query = `
      SELECT * FROM products
      WHERE shop_id = $1
      ORDER BY updated_at DESC;
    `;
    const result = await pool.query(query, [shopId]);
    return result.rows;
  }

  /** 
   * Lọc sản phẩm theo danh mục
   */
  async getProductsByCategory(category, limit = 20, offset = 0) {
    const validCategories = ["Thức ăn", "Đồ uống", "Tráng miệng", "Khác"];
    if (!validCategories.includes(category)) {
      throw new Error(
        `Danh mục không hợp lệ. Chỉ chấp nhận: ${validCategories.join(", ")}`
      );
    }

    const query = `
      SELECT * FROM products
      WHERE category = $1
      ORDER BY updated_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await pool.query(query, [category, limit, offset]);
    return result.rows;
  }

  /** 
   * Tìm kiếm sản phẩm theo tên
   */
  async searchProducts(keyword, limit = 20, offset = 0) {
    const query = `
      SELECT * FROM products
      WHERE LOWER(name) LIKE LOWER($1)
      ORDER BY updated_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await pool.query(query, [`%${keyword}%`, limit, offset]);
    return result.rows;
  }

  /** 
   * Lấy danh sách sản phẩm đang bán (is_available = true)
   */
  async getAvailableProducts() {
    const query = `
      SELECT * FROM products
      WHERE is_available = TRUE
      ORDER BY updated_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /** 
   * Lấy tất cả danh mục sản phẩm (chỉ 4 cái đầu)
   */
  async getAllCategories() {
    try {
      console.log("🟢 [DAO] Bắt đầu truy vấn danh mục...");

      const query = `
        SELECT DISTINCT category
        FROM products
        WHERE category IS NOT NULL
        ORDER BY category
        LIMIT 4;
      `;

      console.log("📜 [DAO] Query:", query);

      const result = await pool.query(query);

      console.log("✅ [DAO] Query thành công. Kết quả:", result.rows);

      if (!result.rows.length) {
        console.warn("⚠️ [DAO] Không tìm thấy danh mục nào trong DB.");
      }

      return result.rows.map((row) => ({
        name: row.category,
      }));
    } catch (err) {
      console.error("❌ [DAO] Lỗi khi truy vấn danh mục:", err.message);
      console.error("📂 Stack Trace:", err.stack);
      throw err;
    }
  }
}

module.exports = new ProductDao();
