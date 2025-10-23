const ProductService = require("../services/productService");

// ➕ Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const result = await ProductService.createProduct(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const result = await ProductService.getAllProducts();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const result = await ProductService.getProductById(req.params.id);
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const result = await ProductService.updateProduct(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const result = await ProductService.deleteProduct(req.params.id);
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔄 Cập nhật trạng thái (còn bán / ngừng bán)
exports.updateAvailability = async (req, res) => {
  try {
    const result = await ProductService.updateAvailability(
      req.params.id,
      req.body.isAvailable
    );
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🏪 Lấy sản phẩm theo shop
exports.getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.body; // ✅ Lấy từ body thay vì params
    if (!shopId) {
      return res.status(400).json({ success: false, message: "Thiếu shopId" });
    }

    const result = await ProductService.getProductsByShop(shopId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("❌ Lỗi getProductsByShop:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 🔍 Tìm kiếm sản phẩm theo tên
exports.searchProducts = async (req, res) => {
  try {
    // ✅ Fix: Accept cả 'keyword' và 'q' query parameters
    const { keyword, q, limit, offset } = req.query;
    const searchKeyword = keyword || q;
    const result = await ProductService.searchProducts(searchKeyword, limit, offset);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📦 Lấy danh sách sản phẩm còn bán
exports.getAvailableProducts = async (req, res) => {
  try {
    const result = await ProductService.getAvailableProducts();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📂 Lấy danh mục sản phẩm (4 cái)
exports.getAllCategories = async (req, res) => {
  try {
    const result = await ProductService.getAllCategories();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

