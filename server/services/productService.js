const productDao = require("../dao/productDao");

const VALID_CATEGORIES = ["Thức ăn", "Đồ uống", "Tráng miệng", "Khác", "Combo"];

const productService = {
  /**
   * ➕ Tạo sản phẩm mới
   * @param {object} productData - { shop_id, name, description, price, image_url, is_available, category, prep_minutes }
   * @returns {Promise<object>}
   */
  async createProduct(productData) {
    const { name, price, shop_id, category, prep_minutes } = productData;

    if (!name || !price || !shop_id) {
      throw new Error("Thiếu thông tin bắt buộc: name, price, shop_id");
    }

    if (category && !VALID_CATEGORIES.includes(category)) {
      throw new Error(
        `Danh mục không hợp lệ. Chỉ chấp nhận: ${VALID_CATEGORIES.join(", ")}`
      );
    }

    if (prep_minutes !== undefined) {
      if (!Number.isInteger(prep_minutes) || prep_minutes < 0) {
        throw new Error("prep_minutes phải là số nguyên không âm");
      }
    }

    return await productDao.create({
      ...productData,
      category: category || "Thức ăn",
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
    if (!existing) throw new Error("Sản phẩm không tồn tại");

    if (updateData.category && !VALID_CATEGORIES.includes(updateData.category)) {
      throw new Error(
        `Danh mục không hợp lệ. Chỉ chấp nhận: ${VALID_CATEGORIES.join(", ")}`
      );
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "prep_minutes")) {
      if (
        updateData.prep_minutes !== null &&
        (!Number.isInteger(updateData.prep_minutes) || updateData.prep_minutes < 0)
      ) {
        throw new Error("prep_minutes phải là số nguyên không âm hoặc null");
      }
    }

    return await productDao.update(productId, updateData);
  },

  /**
   * 🗑️ Xóa sản phẩm theo ID
   * @param {number} productId
   * @returns {Promise<boolean>}
   */
  async deleteProduct(productId) {
    const ok = await productDao.deleteByProductId(productId);
    if (!ok) {
      throw new Error("Sản phẩm không tồn tại");
    }
    return true;
  },

  /**
   * 🔄 Cập nhật trạng thái còn bán / ngừng bán
   * @param {number} productId
   * @param {boolean} isAvailable
   * @returns {Promise<object>}
   */
  async updateAvailability(productId, isAvailable) {
    if (typeof isAvailable !== "boolean") {
      throw new Error("isAvailable phải là boolean");
    }

    const existing = await productDao.findById(productId);
    if (!existing) throw new Error("Sản phẩm không tồn tại");

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
      throw new Error(
        `Danh mục không hợp lệ. Chỉ chấp nhận: ${VALID_CATEGORIES.join(", ")}`
      );
    }

    const existing = await productDao.findById(productId);
    if (!existing) throw new Error("Sản phẩm không tồn tại");

    return await productDao.updateCategory(productId, category);
  },

  /**
   * ⏱️ Cập nhật thời gian chuẩn bị (prep_minutes)
   * @param {number} productId
   * @param {number} prepMinutes
   * @returns {Promise<object>}
   */
  async updatePrepMinutes(productId, prepMinutes) {
    if (!Number.isInteger(prepMinutes) || prepMinutes < 0) {
      throw new Error("prep_minutes phải là số nguyên không âm");
    }

    const existing = await productDao.findById(productId);
    if (!existing) throw new Error("Sản phẩm không tồn tại");

    return await productDao.updatePrepMinutes(productId, prepMinutes);
  },

  /**
   * 🏪 Lấy tất cả sản phẩm của 1 shop
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
      throw new Error(
        `Danh mục không hợp lệ. Chỉ chấp nhận: ${VALID_CATEGORIES.join(", ")}`
      );
    }

    return await productDao.getProductsByCategory(category, limit, offset);
  },

  /**
   * 🔍 Tìm kiếm sản phẩm theo tên
   * @param {string} keyword
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
   * ✅ Lấy sản phẩm đủ thông tin (có ảnh, giá > 0, đang bán)
   * @param {number} [limit=20]
   * @param {number} [offset=0]
   * @returns {Promise<object[]>}
   */
  async getCompleteProducts(limit = 20, offset = 0) {
    return await productDao.getCompleteProducts(limit, offset);
  },

  /**
   * 📂 Lấy tất cả danh mục sản phẩm (4 loại)
   * @returns {Promise<object[]>}
   */
  async getAllCategories() {
    try {
      return await productDao.getAllCategories();
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh mục sản phẩm:", err);
      throw new Error("Không thể lấy danh mục sản phẩm");
    }
  },

  /**
   * 🔄 Đổi trạng thái sản phẩm (mở bán ↔ ngừng bán)
   * @param {number} productId
   */
  async toggleProductStatus(productId) {
    try {
      const updatedProduct = await productDao.toggleProductStatus(productId);
      return {
        message: `Đã ${updatedProduct.is_available ? "mở bán" : "ngừng bán"} sản phẩm`,
        product: updatedProduct,
      };
    } catch (err) {
      console.error("❌ [Service] Lỗi toggleProductStatus:", err.message);
      throw err; // Controller sẽ bắt và trả 500
    }
  }


};

module.exports = productService;
