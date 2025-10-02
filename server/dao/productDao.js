// dao/productDao.js
const GenericDao = require("./generic_dao");
const Product = require("../models/product");

class ProductDao extends GenericDao {
  constructor() {
    super("products", Product);
  }

  /**
   * Cập nhật trạng thái is_available
   * @param {number} productId
   * @param {boolean} isAvailable
   * @returns {Promise<object>}
   */
  async updateAvailability(productId, isAvailable) {
    if (typeof isAvailable !== "boolean") {
      throw new Error("isAvailable phải là boolean");
    }

    const query = `
      UPDATE products
      SET is_available = $1, updated_at = NOW()
      WHERE product_id = $2
      RETURNING *;
    `;
    const result = await this.db.query(query, [isAvailable, productId]);
    return result.rows[0];
  }
}

module.exports = new ProductDao();
