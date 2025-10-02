// dao/cart_itemDao.js
const GenericDao = require("./generic_dao");
const CartItem = require("../models/cart_item");

class CartItemDao extends GenericDao {
  constructor() {
    // Gọi constructor của GenericDao với tên bảng và model tương ứng
    super("cart_items", CartItem);
  }

  /**
   * Lấy tất cả cart items theo cart_id
   * @param {number} cartId - ID giỏ hàng
   * @returns {Promise<object[]>} - Danh sách các cart_item
   */
  async getByCartId(cartId) {
    const query = `
      SELECT * FROM cart_items
      WHERE cart_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [cartId]);
    return result.rows;
  }
}

// Export một instance để sử dụng ở service/controller
module.exports = new CartItemDao();
