// services/orderService.js
const orderDao = require("../dao/orderDao");
const orderDetailDao = require("../dao/order_detailDao");
const orderDetailService = require("./order_detailService");
const notificationService = require("./notificationService");

const ORDER_STATUS_MESSAGES = {
  pending: {
    title: (label) => `${label} đang chờ xác nhận`,
    body: () => "Cửa hàng đã nhận được đơn và sẽ xử lý trong ít phút nữa.",
  },
  cooking: {
    title: (label) => `${label} đang được chế biến`,
    body: () => "Đầu bếp đang chuẩn bị món ăn cho bạn, vui lòng đợi trong giây lát.",
  },
  shipping: {
    title: (label) => `${label} đang trên đường giao`,
    body: () => "Shipper đã rời quán và sẽ sớm tới địa chỉ của bạn.",
  },
  completed: {
    title: (label) => `${label} đã giao thành công`,
    body: () => "Chúc bạn ngon miệng! Đừng quên chia sẻ đánh giá về trải nghiệm nhé.",
  },
  cancelled: {
    title: (label) => `${label} đã bị huỷ`,
    body: () => "Đơn hàng đã bị huỷ. Nếu cần hỗ trợ, vui lòng liên hệ chăm sóc khách hàng.",
  },
};

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
    const updated = await orderDao.updateStatus(id, status);
    if (updated) {
      await this.#notifyOrderStatus(updated).catch((err) =>
        console.error("[OrderService] notifyOrderStatus error", err)
      );
    }
    return updated;
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
   * 💵 Tạo đơn hàng tiền mặt (COD)
   */
  async createCashOrder({ user_id, shop_id, items = [], note = "", delivery_address = null }) {
    const uid = Number(user_id);
    const sid = Number(shop_id);

    if (!uid || !sid) throw new Error("Thiếu user_id hoặc shop_id");

    console.log("🚀 [Service] createCashOrder() START", {
      user_id: uid,
      shop_id: sid,
      itemsCount: items.length,
    });

    // 1️⃣ Tạo order trống
    console.log("🧾 [Service] Tạo order rỗng (COD)...");
    const order = await this.createEmptyOrder({
      user_id: uid,
      shop_id: sid,
      payment_method: "COD",
      delivery_fee: 15000,
      delivery_address,
    });
    console.log("✅ [Service] Order rỗng tạo xong:", {
      order_id: order.order_id,
      status: order.status,
      total_price: order.total_price,
    });

    // 2️⃣ Thêm sản phẩm
    if (Array.isArray(items) && items.length > 0) {
      console.log("🛒 [Service] Thêm sản phẩm vào order_details...");
      await orderDetailService.addMany(order.order_id, items, {
        useProvidedUnitPrice: true,
      });
      console.log("✅ [Service] Đã thêm sản phẩm vào order_details.");
    } else {
      console.warn("⚠️ [Service] Không có sản phẩm để thêm.");
    }

    // 3️⃣ Cập nhật trạng thái ban đầu
    console.log("🔄 [Service] Cập nhật trạng thái order -> 'pending'");
    await orderDao.updateStatus(order.order_id, "pending");

    // 4️⃣ Tính lại tổng
    console.log("💰 [Service] Gọi recalcTotals() để tính lại tổng...");
    const updated = await orderDao.recalcTotals(order.order_id);

    console.log("✅ [Service] Tổng tiền sau tính toán:", {
      order_id: order.order_id,
      food_price: updated?.food_price,
      total_price: updated?.total_price,
    });

    console.log("🎯 [Service] createCashOrder() HOÀN TẤT.");
    return updated;

    // 🕒 Tự động hủy sau 5 phút nếu shop chưa xác nhận (cooking)
    setTimeout(async () => {
      try {
        const currentOrder = await orderDao.findById("order_id", order.order_id);
        if (currentOrder && currentOrder.status === "pending") {
          console.log(`⏰ [Auto-cancel] Hủy đơn ${order.order_id} sau 5 phút do shop chưa xác nhận`);
          await orderDao.updateStatus(order.order_id, "cancelled");
        }
      } catch (err) {
        console.error("❌ Lỗi auto-cancel:", err);
      }
    }, 5 * 60 * 1000); // 5 phút
  }

  /**
   * 🆕 Tạo 1 order trống (đơn cơ bản)
   */
  async createEmptyOrder({ user_id, shop_id, payment_method = "COD", delivery_fee = 0, delivery_address = null }) {
    const uid = Number(user_id);
    const sid = Number(shop_id);
    if (!uid || !sid) throw new Error("user_id và shop_id là bắt buộc");

    console.log("📦 [Service] createEmptyOrder() - tạo order rỗng...");

    const result = await orderDao.create({
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
      delivery_address,
    });

    console.log("✅ [Service] Order rỗng đã tạo:", result);

    if (result) {
      await this.#notifyOrderStatus(result).catch((err) =>
        console.error("[OrderService] notifyOrderStatus error", err)
      );
    }

    return result;
  }
async listByUser(userId, { status, limit = 20, offset = 0, full = false } = {}) {
  const uid = Number(userId);
  if (!uid) throw new Error("userId is required");
  if (full) {
    return await orderDao.getFullOrdersByUserId(uid, { status, limit, offset });
  }
  return await orderDao.listByUser(uid, { status, limit, offset });
}

async getStatusOnly(orderId) {
  const id = Number(orderId);
  if (!id) throw new Error("orderId is required");
  return await orderDao.getStatusOnly(id);
}
/**
 * 👤 Lấy danh sách đầy đủ đơn theo user_id (bao gồm shop + shipper + details)
 */
async getFullOrdersByUserId(userId, { status, limit = 20, offset = 0 } = {}) {
  const uid = Number(userId);
  if (!uid) throw new Error("userId is required");
  return await orderDao.getFullOrdersByUserId(uid, { status, limit, offset });
  }

  /**
   * ❌ Hủy đơn hàng (chỉ khi pending và thuộc user)
   */
  async cancelOrder(orderId, userId) {
    const id = Number(orderId);
    const uid = Number(userId);
    if (!id || !uid) throw new Error("orderId và userId là bắt buộc");

    console.log("🗑️ [Service Cancel] Start:", { id, uid });

    // Kiểm tra đơn hàng tồn tại và thuộc user
    const order = await orderDao.findById("order_id", id);
    console.log("📦 [Service Cancel] Found order:", order);
    if (!order || order.user_id !== uid) {
      console.log("❌ [Service Cancel] Not found or not owned");
      return null;
    }

    // Chỉ hủy nếu pending
    if (order.status !== "pending") {
      console.log("❌ [Service Cancel] Status not pending:", order.status);
      throw new Error("Chỉ có thể hủy đơn hàng đang chờ xác nhận");
    }

    // Cập nhật status thành cancelled
    const result = await orderDao.updateStatus(id, "cancelled");
    console.log("✅ [Service Cancel] Updated:", result);
    return result;
  }
}

module.exports = new OrderService();