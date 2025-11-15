// controllers/orderController.js
const orderService = require("../services/orderService");
const orderDetailService = require("../services/order_detailService");

// helper convert bool
const toBool = (v, def = false) =>
  v === undefined ? def : String(v).toLowerCase() === "true";

module.exports = {
  /** ===========================
   * 🔹 Lấy 1 đơn đầy đủ (order + details)
   * =========================== */
  async getFull(req, res) {
    try {
      const { order_id } = req.body;
      const data = await orderService.getFull(order_id);

      const { role, shipper_id, shop_id, user_id } = req.ctx || {};
      if (role === "shipper" && data.order.shipper_id !== shipper_id)
        return res.status(403).json({ message: "Forbidden" });
      if (role === "shop" && data.order.shop_id !== shop_id)
        return res.status(403).json({ message: "Forbidden" });
      if (role === "user" && data.order.user_id !== user_id)
        return res.status(403).json({ message: "Forbidden" });

      res.json(data);
    } catch (e) {
      res
        .status(e.message === "Order not found" ? 404 : 400)
        .json({ message: e.message });
    }
  },

  /** ===========================
 * 🔹 Lấy danh sách đơn theo ngữ cảnh (shop / user / shipper)
 * =========================== */
async listMine(req, res) {
  try {
    const { role: ctxRole, shipper_id, shop_id: ctxShopId, user_id: ctxUserId } = req.ctx || {};
    const { status, limit, offset, full, shop_id: bodyShopId, user_id: bodyUserId } = req.body || {};

    const role = ctxRole || "user";
    const user_id = ctxUserId || bodyUserId;
    const shop_id = ctxShopId || bodyShopId;
    const fullFlag = String(full).toLowerCase() === "true" || full === true;

    // === SHIPPER ===
    if (role === "shipper" && shipper_id) {
      const items = await orderService.listByShipper(shipper_id, {
        status,
        limit,
        offset,
        full: fullFlag,
      });
      return res.json({ items });
    }

    // === SHOP ===
    if ((role === "shop" && shop_id) || bodyShopId) {
      const items = await orderService.listByShop(Number(shop_id), {
        status,
        limit,
        offset,
        full: fullFlag,
      });
      return res.json({ items });
    }

    // === USER ===
    if (role === "user" && user_id) {


      // 👉 Gọi dao full join (shop + shipper)
      const orders = await orderService.getFullOrdersByUserId(user_id, {
        status,
        limit,
        offset,
      });

      // Chuẩn hóa output
      return res.json({
        success: true,
        count: orders.length,
        items: orders.map(o => ({
          ...o.order,
          details: o.details || [],
        })),
      });
    }

    return res.status(400).json({ message: "Unsupported role or missing identifiers" });
  } catch (e) {
    console.error("❌ Lỗi listMine:", e);
    res.status(400).json({ message: e.message || "Bad request" });
  }
},

  /** ===========================
   * 🔹 Tạo đơn rỗng theo ngữ cảnh
   * =========================== */
  async createEmpty(req, res) {
    try {
      const { role, user_id, shop_id } = req.ctx || {};
      if (!user_id || !shop_id)
        return res.status(400).json({ message: "Context missing user_id/shop_id" });

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

  /** ===========================
   * 🆕 🔹 Tạo đơn hàng thanh toán tiền mặt
   * =========================== */
async createCashOrder(req, res) {

  try {
    const { user_id, shop_id, items = [], note } = req.body;

    if (!user_id || !shop_id) {
      console.warn("⚠️ Thiếu user_id hoặc shop_id:", { user_id, shop_id });
      return res.status(400).json({
        success: false,
        message: "Thiếu user_id hoặc shop_id",
      });
    }

    const order = await orderService.createCashOrder({
      user_id,
      shop_id,
      items,
      note,
    });

    console.log("✅ [Controller] createCashOrder() DONE:", order);
    return res.status(201).json({
      success: true,
      message: "Tạo đơn hàng tiền mặt thành công",
      order,
    });
  } catch (error) {
    console.error("❌ [Controller] createCashOrder Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn hàng tiền mặt",
    });
  }
},

  /** ===========================
   * 🔹 Gán shipper cho đơn
   * =========================== */
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

  /** ===========================
   * 🔹 Cập nhật trạng thái đơn
   * =========================== */
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

  /** ===========================
   * 🔹 Cập nhật trạng thái thanh toán
   * =========================== */
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

  /** ===========================
   * 🔹 Đánh dấu settled
   * =========================== */
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

  /** ===========================
   * 🔹 Thêm chi tiết món
   * =========================== */
  async addItems(req, res) {
    try {
      const { order_id, items, useProvidedUnitPrice = false } = req.body || {};
      const result = await orderService.addItems(order_id, items, { useProvidedUnitPrice });
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /** ===========================
   * 🔹 Lấy chi tiết order
   * =========================== */
  async listDetails(req, res) {
    try {
      const { order_id, withProduct } = req.body || {};
      const details = await orderDetailService.list(order_id, {
        withProduct: toBool(withProduct, true),
      });
      res.json(details);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /** ===========================
   * 🔹 Cập nhật số lượng món
   * =========================== */
  async updateDetailQuantity(req, res) {
    try {
      const { detail_id, quantity } = req.body || {};
      const updated = await orderDetailService.updateQuantity(detail_id, quantity);
      res.json(updated);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /** ===========================
   * 🔹 Xoá toàn bộ chi tiết theo order
   * =========================== */
  async deleteDetailsByOrder(req, res) {
    try {
      const { order_id } = req.body || {};
      const count = await orderDetailService.deleteByOrderId(order_id);
      res.json({ deleted: count });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  /** ===========================
   * 🔹 Lấy danh sách đơn theo shipper kèm details
   * =========================== */
  async listByShipperIdWithDetails(req, res) {
    try {
      const { shipper_id, status, limit = 20, offset = 0, withProduct = true } = req.body || {};
      if (!Number(shipper_id)) return res.status(400).json({ message: "shipper_id is required" });

      const orders = await orderService.listByShipper(Number(shipper_id), {
        status,
        limit: Number(limit),
        offset: Number(offset),
      });

      const items = await Promise.all(
        orders.map(async (o) => {
          const details = await orderDetailService.list(o.order_id, {
            withProduct: toBool(withProduct, true),
          });
          return { order: o, details };
        })
      );

      res.json({ items, limit: Number(limit), offset: Number(offset) });
    } catch (e) {
      res.status(400).json({ message: e.message || "Bad request" });
    }
  },

  /** ===========================
   * 🔹 Lấy danh sách orders của shipper
   * POST /api/orders/shipper/orders
   * Body: { shipper_id, status?, limit?, offset? }
   * =========================== */
  async getOrdersByShipperId(req, res) {
    try {
      const { shipper_id, status, limit = 20, offset = 0 } = req.body || {};

      if (!Number(shipper_id)) {
        return res.status(400).json({ 
          success: false,
          message: "shipper_id is required and must be a number" 
        });
      }

      const orders = await orderService.getOrdersByShipperId(Number(shipper_id), {
        status,
        limit: Number(limit),
        offset: Number(offset),
      });

      res.status(200).json({
        success: true,
        data: orders,
        meta: {
          total: orders.length,
          limit: Number(limit),
          offset: Number(offset),
        },
      });
    } catch (error) {
      console.error("❌ Error getting orders by shipperId:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi lấy danh sách đơn hàng",
      });
    }
  },
};
