// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/", cartController.getUserCart);
router.post("/items", cartController.addItemToCart);
router.put("/items", cartController.updateCartItem); // ❌ bỏ :itemId
router.delete("/items", cartController.deleteCartItem); // ❌ bỏ :itemId
router.delete("/clear", cartController.clearCart);

module.exports = router;
