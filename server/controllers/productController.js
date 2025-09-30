// controllers/productController.js
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
