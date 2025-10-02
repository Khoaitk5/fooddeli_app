// dao/productDao.js
const GenericDao = require("./generic_dao");
const Product = require("../models/product");

class ProductDao extends GenericDao {
  constructor() {
    super("products", Product);
  }

  /**
   * Cập nhật trạng thái is_available (còn bán / ngừng bán)
   * @param {number} productId - ID sản phẩm
   * @param {boolean} isAvailable - true = còn bán, false = ngừng bán
   * @returns {Promise<object>} - Sản phẩm sau khi cập nhật
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
    const result = await this.db.query(query, [isAvailable, productId]);
    return result.rows[0];
  }

  /**
   * Lấy tất cả sản phẩm thuộc về 1 shop
   * @param {number} shopId - ID shop
   * @returns {Promise<object[]>} - Danh sách sản phẩm
   */
  async getProductsByShop(shopId) {
    const query = `
      SELECT * FROM products
      WHERE shop_id = $1
      ORDER BY updated_at DESC;
    `;
    const result = await this.db.query(query, [shopId]);
    return result.rows;
  }

  /**
   * Tìm kiếm sản phẩm theo tên (có phân trang tuỳ chọn)
   * @param {string} keyword - từ khoá tìm kiếm
   * @param {number} [limit=20] - số lượng tối đa
   * @param {number} [offset=0] - bắt đầu từ dòng thứ mấy
   * @returns {Promise<object[]>} - Danh sách sản phẩm phù hợp
   */
  async searchProducts(keyword, limit = 20, offset = 0) {
    const query = `
      SELECT * FROM products
      WHERE LOWER(name) LIKE LOWER($1)
      ORDER BY updated_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await this.db.query(query, [`%${keyword}%`, limit, offset]);
    return result.rows;
  }

  /**
   * Lấy danh sách sản phẩm đang bán (is_available = true)
   * @returns {Promise<object[]>} - Danh sách sản phẩm còn bán
   */
  async getAvailableProducts() {
    const query = `
      SELECT * FROM products
      WHERE is_available = TRUE
      ORDER BY updated_at DESC;
    `;
    const result = await this.db.query(query);
    return result.rows;
  }
}

module.exports = new ProductDao();
