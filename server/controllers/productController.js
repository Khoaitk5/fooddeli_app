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
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID không hợp lệ" });
  }

  try {
    const ok = await ProductService.deleteProduct(id);
    if (!ok) {
      // Service/DAO báo không xóa được vì không tìm thấy row
      return res.status(404).json({ error: "Product not found" });
    }
    // Xóa thành công: 204 No Content
    return res.status(204).send();
  } catch (err) {
    // Nếu là lỗi ràng buộc khóa ngoại → 409 để FE hiểu là không thể xóa cứng
    const msg = err?.message || "Internal Server Error";
    const isFK = /foreign key|constraint|violat/i.test(msg) || err?.code === "23503";
    return res
      .status(isFK ? 409 : 500)
      .json({
        error: isFK
          ? "Sản phẩm đang được tham chiếu bởi dữ liệu khác, không thể xóa cứng. Hãy ngừng bán (is_available = false)."
          : msg,
      });
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
    const { keyword, limit, offset } = req.query;
    const result = await ProductService.searchProducts(keyword, limit, offset);
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

