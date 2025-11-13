// services/orderService.js
const orderDao = require("../dao/orderDao");
const orderDetailDao = require("../dao/order_detailDao");
const orderDetailService = require("./order_detailService");

class OrderService {
  /**
   * 📦 Lấy danh sách đơn theo shipper_id
   */
  async listByShipper(shipperId, { status, limit = 20, offset = 0, full = false } = {}) {
    const sid = Number(shipperId);
    if (!sid) throw new Error("shipperId is required");

    if (full) {
      return await orderDao.getFullOrdersByShipperId(sid, {
        status,
        limit: Number(limit),
        offset: Number(offset),
      });
    }
    return await orderDao.getOrdersByShipperId(sid, {
      status,
      limit: Number(limit),
      offset: Number(offset),
    });
  }

  /**
   * 📦 Lấy danh sách orders của shipper (chỉ lấy orders completed)
   * @param {number} shipperId
   * @param {object} options { status?, limit?, offset? }
   */
  async getOrdersByShipperId(shipperId, options = {}) {
    const sid = Number(shipperId);
    if (!sid) throw new Error("shipperId is required");
    
    // Chỉ lấy orders có status = 'completed'
    return await orderDao.getOrdersByShipperId(sid, {
      status: 'completed', // Luôn filter chỉ lấy completed
      limit: Number(options.limit) || 20,
      offset: Number(options.offset) || 0,
    });
  }

  /**
   * 🏪 Lấy danh sách đơn theo shop_id
   */
  async listByShop(shopId, { status, limit = 20, offset = 0, full = false } = {}) {
    const sid = Number(shopId);
    if (!sid) throw new Error("shopId is required");

    if (!full) {
      return await orderDao.listByShop(sid, { status, limit, offset });
    }

    const orders = await orderDao.listByShop(sid, { status, limit, offset });
    const items = await Promise.all(
      orders.map(async (o) => {
        const details = await orderDetailService.list(o.order_id, { withProduct: true });
        return { order: { ...o }, details };
      })
    );
    return items;
  }

  /**
   * 🔎 Lấy full 1 đơn (order + details + user/shop info)
   */
  async getFull(orderId) {
    const id = Number(orderId);
    if (!id) throw new Error("orderId is required");
    const data = await orderDao.getOrderFullById(id);
    if (!data) throw new Error("Order not found");
    return data;
  }

  /**
   * 👷‍♂️ Gán shipper cho đơn
   */
  async assignShipper(orderId, shipperId) {
    const id = Number(orderId);
    const sid = Number(shipperId);
    if (!id || !sid) throw new Error("orderId and shipperId are required");
    return await orderDao.assignShipper(id, sid);
  }

  /**
   * 🔄 Cập nhật trạng thái đơn
   */
  async updateStatus(orderId, status) {
    const id = Number(orderId);
    if (!id || !status) throw new Error("orderId and status are required");
    return await orderDao.updateStatus(id, status);
  }

  /**
   * 💳 Cập nhật trạng thái thanh toán
   */
  async updatePaymentStatus(orderId, paymentStatus) {
    const id = Number(orderId);
    if (!id || !paymentStatus) throw new Error("orderId and paymentStatus are required");
    return await orderDao.updatePaymentStatus(id, paymentStatus);
  }

  /**
   * 💰 Đánh dấu settled
   */
  async markSettled(orderId) {
    const id = Number(orderId);
    if (!id) throw new Error("orderId is required");
    return await orderDao.markSettled(id);
  }

  /**
   * 🧮 Tính lại tổng tiền đơn từ order_details
   */
  async recalcTotals(orderId) {
    const id = Number(orderId);
    if (!id) throw new Error("orderId is required");
    return await orderDao.recalcTotals(id);
  }

  /**
   * 🆕 Tạo 1 order trống (đơn cơ bản)
   */
  async createEmptyOrder({ user_id, shop_id, payment_method = "COD", delivery_fee = 0 }) {
    const uid = Number(user_id);
    const sid = Number(shop_id);
    if (!uid || !sid) throw new Error("user_id and shop_id are required");

    // Tạo order rỗng, total_price = delivery_fee (chưa có món)
    return await orderDao.create({
      user_id: uid,
      shop_id: sid,
      shipper_id: null,

      food_price: 0,
      delivery_fee: Number(delivery_fee) || 0,
      total_price: Number(delivery_fee) || 0,

      merchant_commission_rate: 0.25,
      shipper_commission_rate: 0.15,

      merchant_earn: 0,
      shipper_earn: 0,
      admin_earn: 0,

      status: "pending", // ✅ khớp với DB enum
      payment_method,    // ✅ "COD" hoặc "VNPay"
      payment_status: "unpaid",

      is_settled: false,
    });
  }

  /**
   * 🍱 Thêm nhiều item vào order_details và tính lại tổng
   */
  async addItems(orderId, items, { useProvidedUnitPrice = false } = {}) {
    const id = Number(orderId);
    if (!id) throw new Error("orderId is required");
    if (!Array.isArray(items) || items.length === 0) throw new Error("items is empty");

    const result = await orderDetailDao.addMany(id, items, {
      mergeDuplicates: true,
      useProvidedUnitPrice,
    });

    const updatedOrder = await orderDao.recalcTotals(id);
    return { ...result, order: updatedOrder };
  }

  /**
   * 💵 Tạo đơn hàng tiền mặt (COD)
   */
  async createCashOrder({ user_id, shop_id, items = [], note = "" }) {
    const uid = Number(user_id);
    const sid = Number(shop_id);

    if (!uid || !sid) throw new Error("Thiếu user_id hoặc shop_id");

    // 1️⃣ Tạo order trống
    const order = await this.createEmptyOrder({
      user_id: uid,
      shop_id: sid,
      payment_method: "COD", // ✅ khớp enum trong DB
      delivery_fee: 15000,
    });

    // 2️⃣ Thêm sản phẩm
    if (Array.isArray(items) && items.length > 0) {
      await orderDetailService.addMany(order.order_id, items, {
        useProvidedUnitPrice: true,
      });
    }

    // 3️⃣ Cập nhật trạng thái ban đầu
    await orderDao.updateStatus(order.order_id, "pending"); // ✅ khớp enum

    // 4️⃣ Tính lại tổng
    const updated = await orderDao.recalcTotals(order.order_id);

    return updated;
  }
}

module.exports = new OrderService();
