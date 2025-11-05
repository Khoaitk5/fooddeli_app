// controllers/orderController.js
const orderService = require("../services/orderService");
const orderDetailService = require("../services/order_detailService");

// helper convert bool
const toBool = (v, def = false) =>
  v === undefined ? def : String(v).toLowerCase() === "true";

module.exports = {
  /**
   * Lấy 1 đơn đầy đủ (order + details)
   * body: { order_id }
   */
  async getFull(req, res) {
    try {
      const { order_id } = req.body;

      // (tuỳ yêu cầu) kiểm tra quyền xem dựa trên role
      // - shipper: chỉ xem đơn gán cho mình
      // - shop: chỉ xem đơn của shop mình
      // - user: chỉ xem đơn của mình đặt
      // -> có thể dùng orderService.getFull rồi tự verify, hoặc tạo DAO check trước.
      const data = await orderService.getFull(order_id);

      const { role, shipper_id, shop_id, user_id } = req.ctx || {};
      if (role === "shipper" && data.order.shipper_id !== shipper_id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (role === "shop" && data.order.shop_id !== shop_id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (role === "user" && data.order.user_id !== user_id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(data);
    } catch (e) {
      res.status(e.message === "Order not found" ? 404 : 400).json({ message: e.message });
    }
  },

  /**
   * Lấy danh sách đơn theo "ngữ cảnh" đã xác thực (KHÔNG lộ id)
   * body: { status?, limit?, offset?, full? }
   * - shipper: trả danh sách đơn theo shipper_id trong ctx
   * - shop: (nếu cần) bạn có thể làm list theo shop ở đây
   * - user: (nếu cần) list đơn theo user
   */
  async listMine(req, res) {
    try {
      const { role, shipper_id, shop_id, user_id } = req.ctx || {};
      const { status, limit, offset, full } = req.body || {};

      if (role === "shipper") {
        const items = await orderService.listByShipper(shipper_id, {
          status,
          limit,
          offset,
          full: toBool(full, false),
        });
        return res.json({ items, limit: Number(limit ?? 20), offset: Number(offset ?? 0) });
      }

      // (tuỳ bạn cần) có thể thêm:
      // if (role === "shop") { ...orderService.listByShop(shop_id)... }
      // if (role === "user") { ...orderService.listByUser(user_id)... }

      return res.status(400).json({ message: "Unsupported role for listMine" });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /**
   * Tạo đơn rỗng theo ngữ cảnh — ví dụ shop tạo đơn cho khách
   * body: { payment_method?, delivery_fee? }
   * user_id, shop_id lấy từ req.ctx
   */
  async createEmpty(req, res) {
    try {
      const { role, user_id, shop_id } = req.ctx || {};
      if (!user_id || !shop_id) return res.status(400).json({ message: "Context missing user_id/shop_id" });

      const { payment_method = "COD", delivery_fee = 0 } = req.body || {};
      const order = await orderService.createEmptyOrder({
        user_id,
        shop_id,
        payment_method,
        delivery_fee,
      });
      res.status(201).json(order);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /**
   * Gán shipper cho đơn — shipper tự nhận đơn
   * body: { order_id }
   * shipper_id lấy từ req.ctx
   */
  async assignMeAsShipper(req, res) {
    try {
      const { shipper_id } = req.ctx || {};
      const { order_id } = req.body || {};
      if (!shipper_id) return res.status(403).json({ message: "Requires shipper role" });

      const updated = await orderService.assignShipper(order_id, shipper_id);
      if (!updated) return res.status(404).json({ message: "Order not found" });
      res.json(updated);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /**
   * Cập nhật status đơn
   * body: { order_id, status }
   */
  async updateStatus(req, res) {
    try {
      const { order_id, status } = req.body || {};
      const updated = await orderService.updateStatus(order_id, status);
      if (!updated) return res.status(404).json({ message: "Order not found" });
      res.json(updated);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /**
   * Cập nhật payment_status
   * body: { order_id, payment_status }
   */
  async updatePaymentStatus(req, res) {
    try {
      const { order_id, payment_status } = req.body || {};
      const updated = await orderService.updatePaymentStatus(order_id, payment_status);
      if (!updated) return res.status(404).json({ message: "Order not found" });
      res.json(updated);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /**
   * Đánh dấu settle
   * body: { order_id }
   */
  async markSettled(req, res) {
    try {
      const { order_id } = req.body || {};
      const updated = await orderService.markSettled(order_id);
      if (!updated) return res.status(404).json({ message: "Order not found" });
      res.json(updated);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /**
   * Thêm nhiều item vào order_details
   * body: { order_id, items: [{product_id, quantity, unit_price?}], useProvidedUnitPrice? }
   */
  async addItems(req, res) {
    try {
      const { order_id, items, useProvidedUnitPrice = false } = req.body || {};
      const result = await orderService.addItems(order_id, items, { useProvidedUnitPrice });
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /**
   * Lấy danh sách chi tiết theo order
   * body: { order_id, withProduct? }
   */
  async listDetails(req, res) {
    try {
      const { order_id, withProduct } = req.body || {};
      const details = await orderDetailService.list(order_id, { withProduct: toBool(withProduct, true) });
      res.json(details);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /**
   * Cập nhật số lượng 1 dòng chi tiết
   * body: { detail_id, quantity }
   */
  async updateDetailQuantity(req, res) {
    try {
      const { detail_id, quantity } = req.body || {};
      const updated = await orderDetailService.updateQuantity(detail_id, quantity);
      res.json(updated);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /**
   * Xoá toàn bộ chi tiết theo order
   * body: { order_id }
   */
  async deleteDetailsByOrder(req, res) {
    try {
      const { order_id } = req.body || {};
      const count = await orderDetailService.deleteByOrderId(order_id);
      res.json({ deleted: count });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  async listByShipperIdWithDetails(req, res) {
  try {
    const { shipper_id, status, limit = 20, offset = 0, withProduct = true } = req.body || {};
    if (!Number(shipper_id)) return res.status(400).json({ message: "shipper_id is required" });

    // 1) Lấy danh sách đơn theo shipper
    const orders = await orderService.listByShipper(Number(shipper_id), {
      status,
      limit: Number(limit),
      offset: Number(offset),
    });

    // 2) Lấy details cho từng order
    const items = await Promise.all(
      orders.map(async (o) => {
        const details = await orderDetailService.list(o.order_id, { withProduct: toBool(withProduct, true) });
        return { order: o, details };
      })
    );

    res.json({ items, limit: Number(limit), offset: Number(offset) });
  } catch (e) {
    res.status(400).json({ message: e.message || "Bad request" });
  }
}
};
