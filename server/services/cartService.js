// services/cartService.js
const cartDao = require("../dao/cartDao");

const cartService = {
  /**
   * 🛒 Tạo mới giỏ hàng
   * @param {object} cartData - { user_id, subtotal, items_count }
   */
  async createCart(cartData) {
    return await cartDao.create(cartData);
  },

  /**
   * 📦 Lấy giỏ hàng theo ID
   */
  async getCartById(cartId) {
    return await cartDao.findById(cartId);
  },

  /**
   * 📦 Lấy giỏ hàng theo user_id
   */
  async getCartByUserId(userId) {
    return await cartDao.getCartByUserId(userId);
  },

  /**
   * 📜 Lấy toàn bộ giỏ hàng
   */
  async getAllCarts() {
    return await cartDao.findAll();
  },

  /**
   * ✏️ Cập nhật giỏ hàng
   */
  async updateCart(cartId, updateData) {
    return await cartDao.update(cartId, updateData);
  },

  /**
   * 🗑️ Xóa giỏ hàng
   */
  async deleteCart(cartId) {
    return await cartDao.delete(cartId);
  },

  /**
   * 🔄 Cập nhật tổng tiền và số lượng item của giỏ
   * @param {number} cartId 
   * @param {number} subtotal 
   * @param {number} itemsCount 
   */
  async updateCartSummary(cartId, subtotal, itemsCount) {
    return await cartDao.updateCartSummary(cartId, subtotal, itemsCount);
  },

  /**
   * 🛍️ Tạo giỏ hàng cho user nếu chưa có
   * @param {number} userId
   */
  async getOrCreateCartForUser(userId) {
    let cart = await cartDao.getCartByUserId(userId);
    if (!cart) {
      cart = await cartDao.create({
        user_id: userId,
        subtotal: 0,
        items_count: 0,
      });
    }
    return cart;
  },
};

module.exports = cartService;
