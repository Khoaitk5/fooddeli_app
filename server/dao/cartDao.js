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

}

// Export một instance để dùng ở service/controller
module.exports = new CartDao();
