const orderService = require("../services/orderService");

const orderController = {
  /**
   * ➕ [POST] /orders
   * Tạo đơn hàng mới
   */
  async createOrder(req, res) {
    try {
      const orderData = req.body;
      const newOrder = await orderService.createOrder(orderData);
      res.status(201).json({
        message: "Tạo đơn hàng thành công",
        data: newOrder,
      });
    } catch (err) {
      console.error("❌ Lỗi tạo đơn hàng:", err);
      res.status(400).json({ error: err.message });
    }
  },

  /**
   * 📦 [GET] /orders/:id
   * Lấy thông tin chi tiết đơn hàng theo ID
   */
  async getOrderById(req, res) {
    try {
      const orderId = parseInt(req.params.id);
      const order = await orderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      }
      res.json(order);
    } catch (err) {
      console.error("❌ Lỗi lấy đơn hàng:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * 📜 [GET] /orders
   * Lấy toàn bộ đơn hàng (cho admin)
   */
  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách đơn hàng:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * 📍 [GET] /orders/user/:userId
   * Lấy đơn hàng của 1 user
   */
  async getOrdersByUser(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await orderService.getOrdersByUserId(userId);
      res.json(orders);
    } catch (err) {
      console.error("❌ Lỗi lấy đơn hàng user:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * 🏪 [GET] /orders/shop/:shopId
   * Lấy đơn hàng của 1 shop
   */
  async getOrdersByShop(req, res) {
    try {
      const shopId = parseInt(req.params.shopId);
      const orders = await orderService.getOrdersByShopId(shopId);
      res.json(orders);
    } catch (err) {
      console.error("❌ Lỗi lấy đơn hàng shop:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * 🚚 [GET] /orders/shipper/:shipperId
   * Lấy đơn hàng của 1 shipper
   */
  async getOrdersByShipper(req, res) {
    try {
      const shipperId = parseInt(req.params.shipperId);
      const orders = await orderService.getOrdersByShipperId(shipperId);
      res.json(orders);
    } catch (err) {
      console.error("❌ Lỗi lấy đơn hàng shipper:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * ✏️ [PUT] /orders/:id
   * Cập nhật thông tin đơn hàng
   */
  async updateOrder(req, res) {
    try {
      const orderId = parseInt(req.params.id);
      const updateData = req.body;
      const updated = await orderService.updateOrder(orderId, updateData);
      res.json({
        message: "Cập nhật đơn hàng thành công",
        data: updated,
      });
    } catch (err) {
      console.error("❌ Lỗi cập nhật đơn hàng:", err);
      res.status(400).json({ error: err.message });
    }
  },

  /**
   * 🗑️ [DELETE] /orders/:id
   * Xoá đơn hàng
   */
  async deleteOrder(req, res) {
    try {
      const orderId = parseInt(req.params.id);
      const deleted = await orderService.deleteOrder(orderId);
      res.json({
        message: "Xóa đơn hàng thành công",
        data: deleted,
      });
    } catch (err) {
      console.error("❌ Lỗi xoá đơn hàng:", err);
      res.status(400).json({ error: err.message });
    }
  },

  /**
   * 🔄 [PATCH] /orders/:id/status
   * Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(req, res) {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      const updated = await orderService.updateOrderStatus(orderId, status);
      res.json({
        message: "Cập nhật trạng thái đơn hàng thành công",
        data: updated,
      });
    } catch (err) {
      console.error("❌ Lỗi cập nhật trạng thái:", err);
      res.status(400).json({ error: err.message });
    }
  },

  /**
   * 🚚 [PATCH] /orders/:id/assign
   * Gán shipper cho đơn hàng
   */
  async assignShipper(req, res) {
    try {
      const orderId = parseInt(req.params.id);
      const { shipper_id } = req.body;
      const updated = await orderService.assignShipper(orderId, shipper_id);
      res.json({
        message: "Gán shipper thành công",
        data: updated,
      });
    } catch (err) {
      console.error("❌ Lỗi gán shipper:", err);
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = orderController;
