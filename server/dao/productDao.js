const FirestoreDao = require("./firestore_dao");
const Product = require("../models/product");

class ProductDao extends FirestoreDao {
  constructor() {
    super("products", Product);
  }

  /** 
   * Cập nhật trạng thái is_available (còn bán / ngừng bán)
   */
  async updateAvailability(productId, isAvailable) {
    if (typeof isAvailable !== "boolean") {
      throw new Error("isAvailable phải là boolean");
    }
    return this.update(productId, { is_available: isAvailable });
  }

  /** 
   * Cập nhật danh mục (category) của sản phẩm
   */
  async updateCategory(productId, category) {
    const validCategories = ["Thức ăn", "Đồ uống", "Tráng miệng", "Khác"];
    if (!validCategories.includes(category)) {
      throw new Error(
        `Danh mục không hợp lệ. Chỉ chấp nhận: ${validCategories.join(", ")}`
      );
    }
    return this.update(productId, { category });
  }

  /** 
   * Lấy tất cả sản phẩm thuộc về 1 shop
   */
  async getProductsByShop(shopId) {
    const conditions = [{ field: "shop_id", operator: "==", value: shopId }];
    return this.findWithConditions(conditions, "updated_at", "desc");
  }

  /** 
   * Lọc sản phẩm theo danh mục
   */
  async getProductsByCategory(category, limit = 20, offset = 0) {
    const validCategories = ["Thức ăn", "Đồ uống", "Tráng miệng", "Khác"];
    if (!validCategories.includes(category)) {
      throw new Error(
        `Danh mục không hợp lệ. Chỉ chấp nhận: ${validCategories.join(", ")}`
      );
    }

    const conditions = [{ field: "category", operator: "==", value: category }];
    let products = await this.findWithConditions(conditions, "updated_at", "desc");
    
    // Xử lý pagination thủ công vì Firestore không có OFFSET
    return products.slice(offset, offset + limit);
  }

  /** 
   * Tìm kiếm sản phẩm theo tên (tìm kiếm toàn bộ, rồi lọc ở app)
   */
  async searchProducts(keyword, limit = 20, offset = 0) {
    try {
      const allProducts = await this.findAll();
      
      // Lọc sản phẩm chứa keyword trong tên (không phân biệt chữ hoa/thường)
      const filtered = allProducts.filter(p => 
        p.name && p.name.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Sắp xếp theo updated_at
      filtered.sort((a, b) => {
        const aTime = a.updated_at?.toDate?.() || new Date(0);
        const bTime = b.updated_at?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      
      // Xử lý pagination
      return filtered.slice(offset, offset + limit);
    } catch (err) {
      console.error("❌ Error in searchProducts:", err.message);
      throw err;
    }
  }

  /** 
   * Lấy danh sách sản phẩm đang bán (is_available = true)
   */
  async getAvailableProducts() {
    const conditions = [{ field: "is_available", operator: "==", value: true }];
    return this.findWithConditions(conditions, "updated_at", "desc");
  }

  /** 
   * Lấy tất cả danh mục sản phẩm (chỉ 4 cái đầu)
   */
  async getAllCategories() {
    try {
      console.log("🟢 [DAO] Bắt đầu lấy danh mục...");

      const allProducts = await this.findAll();
      
      // Lấy danh mục duy nhất
      const categoriesSet = new Set();
      allProducts.forEach(product => {
        if (product.category) {
          categoriesSet.add(product.category);
        }
      });

      // Chuyển thành array và lấy 4 cái đầu
      const categories = Array.from(categoriesSet).slice(0, 4);

      console.log("✅ [DAO] Lấy danh mục thành công. Kết quả:", categories);

      if (categories.length === 0) {
        console.warn("⚠️ [DAO] Không tìm thấy danh mục nào.");
      }

      return categories.map(name => ({ name }));
    } catch (err) {
      console.error("❌ [DAO] Lỗi khi lấy danh mục:", err.message);
      console.error("📂 Stack Trace:", err.stack);
      throw err;
    }
  }
}

module.exports = new ProductDao();
