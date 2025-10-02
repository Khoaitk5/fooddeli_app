// services/productService.js
const productDao = require("../dao/productDao");

const productService = {
  /**
   * ➕ Tạo sản phẩm mới
   * @param {object} productData - { shop_id, name, description, price, image_url, is_available }
   * @returns {Promise<object>}
   */
  async createProduct(productData) {
    if (!productData.name || !productData.price || !productData.shop_id) {
      throw new Error("Thiếu thông tin bắt buộc: name, price, shop_id");
    }
    return await productDao.create(productData);
  },

  /**
   * 📦 Lấy sản phẩm theo ID
   * @param {number} productId
   * @returns {Promise<object|null>}
   */
  async getProductById(productId) {
    return await productDao.findById(productId);
  },

  /**
   * 📜 Lấy toàn bộ sản phẩm
   * @returns {Promise<object[]>}
   */
  async getAllProducts() {
    return await productDao.findAll();
  },

  /**
   * ✏️ Cập nhật thông tin sản phẩm
   * @param {number} productId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateProduct(productId, updateData) {
    const existing = await productDao.findById(productId);
    if (!existing) {
      throw new Error("Sản phẩm không tồn tại");
    }
    return await productDao.update(productId, updateData);
  },

  /**
   * 🗑️ Xóa sản phẩm theo ID
   * @param {number} productId
   * @returns {Promise<boolean>}
   */
  async deleteProduct(productId) {
    const existing = await productDao.findById(productId);
    if (!existing) {
      throw new Error("Sản phẩm không tồn tại");
    }
    return await productDao.delete(productId);
  },

  /**
   * 🔄 Cập nhật trạng thái sản phẩm (còn bán / ngừng bán)
   * @param {number} productId
   * @param {boolean} isAvailable
   * @returns {Promise<object>}
   */
  async updateAvailability(productId, isAvailable) {
    const existing = await productDao.findById(productId);
    if (!existing) {
      throw new Error("Sản phẩm không tồn tại");
    }
    return await productDao.updateAvailability(productId, isAvailable);
  },

  /**
   * 🏪 Lấy tất cả sản phẩm của một shop
   * @param {number} shopId
   * @returns {Promise<object[]>}
   */
  async getProductsByShop(shopId) {
    return await productDao.getProductsByShop(shopId);
  },

  /**
   * 🔍 Tìm kiếm sản phẩm theo tên
   * @param {string} keyword - từ khóa tìm kiếm
   * @param {number} [limit=20]
   * @param {number} [offset=0]
   * @returns {Promise<object[]>}
   */
  async searchProducts(keyword, limit = 20, offset = 0) {
    if (!keyword || keyword.trim() === "") {
      throw new Error("Từ khóa tìm kiếm không được để trống");
    }
    return await productDao.searchProducts(keyword, limit, offset);
  },

  /**
   * 📦 Lấy danh sách sản phẩm đang bán
   * @returns {Promise<object[]>}
   */
  async getAvailableProducts() {
    return await productDao.getAvailableProducts();
  },
};

module.exports = productService;
