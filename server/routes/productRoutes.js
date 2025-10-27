const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");

// CRUD
router.post("/", ProductController.createProduct);
router.get("/", ProductController.getAllProducts);

// ✅ Đặt các route tĩnh TRƯỚC khi có ":id"
router.get("/categories", ProductController.getAllCategories);
router.post("/by-shop", ProductController.getProductsByShop);
router.get("/search", ProductController.searchProducts);
router.get("/available", ProductController.getAvailableProducts);

router.get("/:id", ProductController.getProductById);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);
router.patch("/:id/availability", ProductController.updateAvailability);


module.exports = router;