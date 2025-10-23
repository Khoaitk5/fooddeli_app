// dao/cartDao.js
const FirestoreDao = require("./firestore_dao");
const Cart = require("../models/cart");

class CartDao extends FirestoreDao {
  constructor() {
    super("carts", Cart);
  }

  /**
   * Lấy giỏ hàng theo user_id
   * @param {string} userId - ID người dùng
   * @returns {Promise<object|null>} - Giỏ hàng nếu tồn tại, ngược lại null
   */
  async getCartByUserId(userId) {
    return this.findOneByField("user_id", userId);
  }

  /**
   * Cập nhật tổng tiền và số lượng sản phẩm trong giỏ
   * @param {string} cartId - ID giỏ hàng
   * @param {number} subtotal - Tổng tiền mới
   * @param {number} itemsCount - Số lượng dòng hàng mới
   * @returns {Promise<object>} - Giỏ hàng sau khi cập nhật
   */
  async updateCartSummary(cartId, subtotal, itemsCount) {
    return this.update(cartId, { subtotal, items_count: itemsCount });
  }
}

module.exports = new CartDao();
