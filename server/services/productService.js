const productDao = require("../dao/productDao");

const VALID_CATEGORIES = ["Thức ăn", "Đồ uống", "Tráng miệng", "Khác", "Combo"];

const productService = {
  /**
   * ➕ Tạo sản phẩm mới
   * @param {object} productData - { shop_id, name, description, price, image_url, is_available, category }
   * @returns {Promise<object>}
   */
  async createProduct(productData) {
    const { name, price, shop_id, category } = productData;

    if (!name || !price || !shop_id) {
      throw new Error("Thiếu thông tin bắt buộc: name, price, shop_id");
    }

    if (category && !VALID_CATEGORIES.includes(category)) {
      throw new Error(`Danh mục không hợp lệ. Chỉ chấp nhận: ${VALID_CATEGORIES.join(", ")}`);
    }

    return await productDao.create({
      ...productData,
      category: category || "Thức ăn", // default nếu không có
    });
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

    if (updateData.category && !VALID_CATEGORIES.includes(updateData.category)) {
      throw new Error(`Danh mục không hợp lệ. Chỉ chấp nhận: ${VALID_CATEGORIES.join(", ")}`);
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
   * 🏷️ Cập nhật danh mục sản phẩm
   * @param {number} productId
   * @param {string} category
   * @returns {Promise<object>}
   */
  async updateCategory(productId, category) {
    if (!VALID_CATEGORIES.includes(category)) {
      throw new Error(`Danh mục không hợp lệ. Chỉ chấp nhận: ${VALID_CATEGORIES.join(", ")}`);
    }

    const existing = await productDao.findById(productId);
    if (!existing) {
      throw new Error("Sản phẩm không tồn tại");
    }

    return await productDao.updateCategory(productId, category);
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
   * 🍱 Lấy sản phẩm theo danh mục
   * @param {string} category
   * @param {number} [limit=20]
   * @param {number} [offset=0]
   * @returns {Promise<object[]>}
   */
  async getProductsByCategory(category, limit = 20, offset = 0) {
    if (!VALID_CATEGORIES.includes(category)) {
      throw new Error(`Danh mục không hợp lệ. Chỉ chấp nhận: ${VALID_CATEGORIES.join(", ")}`);
    }

    return await productDao.getProductsByCategory(category, limit, offset);
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

  /**
 * 📂 Lấy tất cả danh mục sản phẩm (chỉ 4 cái)
 * @returns {Promise<object[]>}
 */
async getAllCategories() {
  try {
    return await productDao.getAllCategories();
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh mục sản phẩm:", err);
    throw new Error("Không thể lấy danh mục sản phẩm");
  }
}

};

module.exports = productService;
