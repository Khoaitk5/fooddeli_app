// services/orderService.js
const orderDao = require("../dao/orderDao");
const orderDetailDao = require("../dao/order_detailDao");
const orderDetailService = require("./order_detailService");

class OrderService {
  /**
   * Lấy danh sách đơn theo shipper_id (+ lọc + phân trang)
   * Chỉ gọi DAO, không query trong service
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
   * 🏪 Lấy danh sách đơn theo shop_id (+ lọc + phân trang)
   * Có thể trả dạng đơn giản hoặc kèm chi tiết (full)
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
        return { order: o, details };
      })
    );
    return items;
  }

  /**
   * Lấy full 1 đơn (order + details + user/shop info)
   */
  async getFull(orderId) {
    const id = Number(orderId);
    if (!id) throw new Error("orderId is required");
    const data = await orderDao.getOrderFullById(id);
    if (!data) throw new Error("Order not found");
    return data;
  }

  /**
   * Gán shipper cho đơn
   */
  async assignShipper(orderId, shipperId) {
    const id = Number(orderId);
    const sid = Number(shipperId);
    if (!id || !sid) throw new Error("orderId and shipperId are required");
    return await orderDao.assignShipper(id, sid);
  }

  /**
   * Cập nhật trạng thái đơn
   */
  async updateStatus(orderId, status) {
    const id = Number(orderId);
    if (!id || !status) throw new Error("orderId and status are required");
    return await orderDao.updateStatus(id, status);
  }

  /**
   * Cập nhật trạng thái thanh toán
   */
  async updatePaymentStatus(orderId, paymentStatus) {
    const id = Number(orderId);
    if (!id || !paymentStatus) throw new Error("orderId and paymentStatus are required");
    return await orderDao.updatePaymentStatus(id, paymentStatus);
  }

  /**
   * Đánh dấu settle
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
   * Tạo 1 order trống (dùng GenericDao.create), rồi FE có thể add items sau
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

      status: "pending",
      payment_method,
      payment_status: "unpaid",

      is_settled: false,
    });
  }

  /**
   * Thêm nhiều item vào order_details (gọi DAO) rồi recalc tổng (gọi DAO)
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
}

module.exports = new OrderService();
