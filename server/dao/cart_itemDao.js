// dao/cart_itemDao.js
const FirestoreDao = require("./firestore_dao");
const CartItem = require("../models/cart_item");

class CartItemDao extends FirestoreDao {
  constructor() {
    super("cart_items", CartItem);
  }

  /**
   * Lấy tất cả cart items theo cart_id
   * @param {string} cartId - ID giỏ hàng
   * @returns {Promise<object[]>} - Danh sách các cart_item
   */
  async getByCartId(cartId) {
    const conditions = [{ field: "cart_id", operator: "==", value: cartId }];
    return this.findWithConditions(conditions, "created_at", "desc");
  }
}

module.exports = new CartItemDao();
