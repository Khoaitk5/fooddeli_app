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

      const normalizedShopId = Number(shop_id);
      const normalizedProductId = Number(product_id);
      const normalizedQuantity = Number(quantity);
      const normalizedUnitPrice = Number(unit_price);

      if (
        !Number.isFinite(normalizedQuantity) ||
        normalizedQuantity <= 0 ||
        !Number.isFinite(normalizedUnitPrice) ||
        normalizedUnitPrice <= 0 ||
        !Number.isInteger(normalizedShopId) ||
        !Number.isInteger(normalizedProductId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Giá trị shop_id, product_id, quantity hoặc unit_price không hợp lệ",
        });
      }

      const cart = await cartService.getOrCreateCartForUser(sessionUser.id);

      const existingItem = await cartItemService.findByCartShopProduct(
        cart.cart_id,
        normalizedShopId,
        normalizedProductId
      );

      let itemResponse;
      let message;
      let statusCode = 201;

      if (existingItem) {
        const updatedQuantity = Number(existingItem.quantity) + normalizedQuantity;
        itemResponse = await cartItemService.updateCartItem(existingItem.id, {
          quantity: updatedQuantity,
        });
        message = "Đã tăng số lượng sản phẩm trong giỏ hàng";
        statusCode = 200;
      } else {
        itemResponse = await cartItemService.createCartItem({
          cart_id: cart.cart_id,
          shop_id: normalizedShopId,
          product_id: normalizedProductId,
          quantity: normalizedQuantity,
          unit_price: normalizedUnitPrice,
        });
        message = "Thêm sản phẩm vào giỏ hàng thành công";
      }

      const items = await cartItemService.getItemsByCartId(cart.cart_id);
      const subtotal = items.reduce((sum, i) => sum + Number(i.line_total), 0);
      await cartService.updateCartSummary(cart.cart_id, subtotal, items.length);

      return res.status(statusCode).json({
        success: true,
        message,
        data: itemResponse,
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

      // ✅ Chỉ update field nào có giá trị thật sự
      const updateData = {};
      if (quantity !== undefined) updateData.quantity = quantity;
      if (unit_price !== undefined) updateData.unit_price = unit_price;

      if (Object.keys(updateData).length === 0)
        return res
          .status(400)
          .json({ success: false, message: "Không có dữ liệu cần cập nhật" });

      // ✅ Gọi service để update
      const updatedItem = await cartItemService.updateCartItem(
        itemId,
        updateData
      );

      // ✅ Nếu service return null → báo lỗi
      if (!updatedItem)
        return res
          .status(404)
          .json({
            success: false,
            message: "Không tìm thấy sản phẩm để cập nhật",
          });

      // ✅ Tính lại subtotal + items_count
      const items = await cartItemService.getItemsByCartId(updatedItem.cart_id);
      const subtotal = items.reduce((sum, i) => sum + Number(i.line_total), 0);
      await cartService.updateCartSummary(
        updatedItem.cart_id,
        subtotal,
        items.length
      );

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
          .json({
            success: false,
            message: "Không tìm thấy sản phẩm trong giỏ",
          });

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
