const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");

// --- ROUTES TĨNH ---
router.get("/categories", ProductController.getAllCategories);
router.post("/by-shop", ProductController.getProductsByShop);
router.get("/search", ProductController.searchProducts);
router.get("/available", ProductController.getAvailableProducts);

// --- CRUD CHÍNH ---
router.post("/", ProductController.createProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

// --- PATCH RIÊNG ---
// router.patch("/:id/availability", ProductController.updateAvailability);
router.patch("/:id/toggle-status", ProductController.toggleStatus);

module.exports = router;
