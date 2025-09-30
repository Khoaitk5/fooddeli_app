const cart_itemDao = require("../dao/cart_itemDao");

const cart_itemService = {
  async createCartItem(itemData) {
    // Nếu truyền vào là danh sách nhiều item
    if (Array.isArray(itemData)) {
      const results = [];
      for (const item of itemData) {
        const createdItem = await cartItemDao.create(item);
        results.push(createdItem);
      }
      return results; // trả về danh sách item đã thêm
    }

    // Nếu chỉ truyền vào 1 item
    return await cartItemDao.create(itemData);
  },

  async getCartItemById(itemId) {
    return await cart_itemDao.findById(itemId);
  },
  async getAllCartItems() {
    return await cart_itemDao.findAll;
  },
  async updateCartItem(itemId, updateData) {
    return await cart_itemDao.update(itemId, updateData);
  },
  async deleteCartItem(itemId) {
    return await cart_itemDao.delete(itemId);
  },
};

module.exports = cart_itemService;
