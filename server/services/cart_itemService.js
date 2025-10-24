// services/cartItemService.js
const cart_itemDao = require("../dao/cart_itemDao");

const cartItemService = {
  async createCartItem(itemData) {
    if (Array.isArray(itemData)) {
      const results = [];
      for (const item of itemData) {
        if (item.quantity <= 0) throw new Error("Số lượng phải lớn hơn 0");
        const createdItem = await cart_itemDao.create(item);
        results.push(createdItem);
      }
      return results;
    }

    if (itemData.quantity <= 0) throw new Error("Số lượng phải lớn hơn 0");
    return await cart_itemDao.create(itemData);
  },

  async getCartItemById(itemId) {
    return await cart_itemDao.findById("id", itemId);
  },

  async getAllCartItems() {
    return await cart_itemDao.findAll();
  },

  async updateCartItem(itemId, updateData) {
    return await cart_itemDao.update("id", itemId, updateData);
  },

  async deleteCartItem(itemId) {
    return await cart_itemDao.delete("id", itemId);
  },

  /**
   * 🛍️ Lấy tất cả item theo cart_id (✅ GỌI DAO, không query trực tiếp)
   */
  async getItemsByCartId(cartId) {
    return await cart_itemDao.getByCartId(cartId);
  },
};

module.exports = cartItemService;
