// controllers/cartController.js
const cartService = require("../services/cartService");
const cartItemService = require("../services/cart_itemService"); // ⚠️ tên file chuẩn
const { getSessionUser } = require("../services/sessionService");

const cartController = {
  /**
   * 🛒 Lấy giỏ hàng của user hiện tại (từ session)
   */
  async getUserCart(req, res) {
    try {
      const sessionUser = getSessionUser(req);
      if (!sessionUser)
        return res
          .status(401)
          .json({ success: false, message: "Bạn chưa đăng nhập" });

      const cart = await cartService.getOrCreateCartForUser(sessionUser.id);
      const items = await cartItemService.getItemsByCartId(cart.cart_id);

      return res.status(200).json({
        success: true,
        message: "Lấy giỏ hàng thành công",
        data: { cart, items },
      });
    } catch (error) {
      console.error("❌ Lỗi khi lấy giỏ hàng:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * ➕ Thêm sản phẩm vào giỏ hàng
   */
  async addItemToCart(req, res) {
    try {
      const sessionUser = getSessionUser(req);
      if (!sessionUser)
        return res
          .status(401)
          .json({ success: false, message: "Bạn chưa đăng nhập" });

      const { shop_id, product_id, quantity, unit_price } = req.body;
      if (!shop_id || !product_id || !quantity || !unit_price) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu dữ liệu cần thiết" });
      }

      const cart = await cartService.getOrCreateCartForUser(sessionUser.id);

      const newItem = await cartItemService.createCartItem({
        cart_id: cart.cart_id,
        shop_id,
        product_id,
        quantity,
        unit_price,
      });

      const items = await cartItemService.getItemsByCartId(cart.cart_id);
      const subtotal = items.reduce((sum, i) => sum + Number(i.line_total), 0);
      await cartService.updateCartSummary(cart.cart_id, subtotal, items.length);

      return res.status(201).json({
        success: true,
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data: newItem,
      });
    } catch (error) {
      console.error("❌ Lỗi khi thêm sản phẩm:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * ✏️ Cập nhật item trong giỏ hàng (lấy itemId từ body, không từ URL)
   */
  async updateCartItem(req, res) {
    try {
      const sessionUser = getSessionUser(req);
      if (!sessionUser)
        return res
          .status(401)
          .json({ success: false, message: "Bạn chưa đăng nhập" });

      const { itemId, quantity, unit_price } = req.body;
      if (!itemId)
        return res
          .status(400)
          .json({ success: false, message: "Thiếu itemId trong request body" });

      const updatedItem = await cartItemService.updateCartItem(itemId, {
        quantity,
        unit_price,
      });

      const items = await cartItemService.getItemsByCartId(updatedItem.cart_id);
      const subtotal = items.reduce((sum, i) => sum + Number(i.line_total), 0);
      await cartService.updateCartSummary(updatedItem.cart_id, subtotal, items.length);

      return res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm trong giỏ hàng thành công",
        data: updatedItem,
      });
    } catch (error) {
      console.error("❌ Lỗi cập nhật item:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * ❌ Xóa item khỏi giỏ hàng (itemId gửi trong body)
   */
  async deleteCartItem(req, res) {
    try {
      const sessionUser = getSessionUser(req);
      if (!sessionUser)
        return res
          .status(401)
          .json({ success: false, message: "Bạn chưa đăng nhập" });

      const { itemId } = req.body;
      if (!itemId)
        return res
          .status(400)
          .json({ success: false, message: "Thiếu itemId trong request body" });

      const item = await cartItemService.getCartItemById(itemId);
      if (!item)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sản phẩm trong giỏ" });

      await cartItemService.deleteCartItem(itemId);

      const items = await cartItemService.getItemsByCartId(item.cart_id);
      const subtotal = items.reduce((sum, i) => sum + Number(i.line_total), 0);
      await cartService.updateCartSummary(item.cart_id, subtotal, items.length);

      return res.status(200).json({
        success: true,
        message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      });
    } catch (error) {
      console.error("❌ Lỗi khi xóa item:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * 🗑️ Xóa toàn bộ giỏ hàng
   */
  async clearCart(req, res) {
    try {
      const sessionUser = getSessionUser(req);
      if (!sessionUser)
        return res
          .status(401)
          .json({ success: false, message: "Bạn chưa đăng nhập" });

      const cart = await cartService.getCartByUserId(sessionUser.id);
      if (!cart)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy giỏ hàng" });

      const items = await cartItemService.getItemsByCartId(cart.cart_id);
      for (const item of items) {
        await cartItemService.deleteCartItem(item.id);
      }

      await cartService.updateCartSummary(cart.cart_id, 0, 0);

      return res.status(200).json({
        success: true,
        message: "Đã xóa toàn bộ sản phẩm trong giỏ hàng",
      });
    } catch (error) {
      console.error("❌ Lỗi khi xóa toàn bộ giỏ:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = cartController;
