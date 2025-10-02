// dao/cartDao.js
const GenericDao = require("./generic_dao");
const Cart = require("../models/cart");

class CartDao extends GenericDao {
  constructor() {
    // Gọi constructor cha để truyền tên bảng và model tương ứng
    super("carts", Cart);
  }

  /**
   * Lấy giỏ hàng theo user_id
   * @param {number} userId - ID người dùng
   * @returns {Promise<object|null>} - Giỏ hàng nếu tồn tại, ngược lại null
   */
  async getCartByUserId(userId) {
    const query = `
      SELECT * FROM carts
      WHERE user_id = $1
      LIMIT 1;
    `;
    const result = await this.db.query(query, [userId]);
    return result.rows[0] || null;
  }
  /**
   * Cập nhật tổng tiền và số lượng sản phẩm trong giỏ
   * @param {number} cartId - ID giỏ hàng
   * @param {number} subtotal - Tổng tiền mới
   * @param {number} itemsCount - Số lượng dòng hàng mới
   * @returns {Promise<object>} - Giỏ hàng sau khi cập nhật
   */
  async updateCartSummary(cartId, subtotal, itemsCount) {
    const query = `
      UPDATE carts
      SET subtotal = $1,
          items_count = $2,
          updated_at = NOW()
      WHERE cart_id = $3
      RETURNING *;
    `;
    const result = await this.db.query(query, [subtotal, itemsCount, cartId]);
    return result.rows[0];
  }
}

module.exports = new CartDao();
