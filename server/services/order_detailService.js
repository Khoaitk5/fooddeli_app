// services/orderDetailService.js
const orderDetailDao = require("../dao/order_detailDao");
const orderDao = require("../dao/orderDao");

class OrderDetailService {
  /**
   * 📋 Lấy chi tiết theo order_id
   */
  async list(orderId, { withProduct = true } = {}) {
    const id = Number(orderId);
    if (!id) throw new Error("orderId is required");

    console.log("🔍 [OrderDetailService] list() cho order_id:", id);
    const result = await orderDetailDao.getByOrderId(id, { withProduct });
    console.log("✅ [OrderDetailService] list() trả về", result?.length, "dòng chi tiết.");
    return result;
  }

  /**
   * 📦 Bulk add nhiều dòng chi tiết, rồi recalc tổng
   */
  async addMany(orderId, items, { useProvidedUnitPrice = false } = {}) {
    const id = Number(orderId);
    if (!id) throw new Error("orderId is required");
    if (!Array.isArray(items) || items.length === 0) throw new Error("items is empty");

    console.log("🚀 [OrderDetailService] addMany() START:", {
      order_id: id,
      itemCount: items.length,
      useProvidedUnitPrice,
    });

    try {
      console.log("🛒 [OrderDetailService] Gọi orderDetailDao.addMany() với items:", items);
      const result = await orderDetailDao.addMany(id, items, {
        mergeDuplicates: true,
        useProvidedUnitPrice,
      });
      console.log("✅ [OrderDetailService] addMany() DAO thành công:", result);

      console.log("🧮 [OrderDetailService] Gọi orderDao.recalcTotals() cho order_id:", id);
      const updatedOrder = await orderDao.recalcTotals(id);
      console.log("💰 [OrderDetailService] recalcTotals() trả về:", {
        order_id: updatedOrder?.order_id,
        food_price: updatedOrder?.food_price,
        total_price: updatedOrder?.total_price,
      });

      console.log("🎯 [OrderDetailService] addMany() HOÀN TẤT.");
      return { ...result, order: updatedOrder };
    } catch (err) {
      console.error("❌ [OrderDetailService] Lỗi trong addMany():", err.message);
      throw err;
    }
  }

  /**
   * ✏️ Cập nhật số lượng 1 dòng chi tiết
   */
  async updateQuantity(detailId, quantity) {
    const did = Number(detailId);
    const qty = Number(quantity);
    if (!did || !qty) throw new Error("detailId and quantity are required");

    console.log("✏️ [OrderDetailService] updateQuantity() gọi với:", { detailId: did, quantity: qty });
    const detail = await orderDetailDao.findById("id", did);
    if (!detail) throw new Error("Order detail not found");

    console.log("🔁 [OrderDetailService] updateQuantity() cập nhật chi tiết:", detail);
    const updated = await orderDetailDao.updateQuantity(did, qty);
    console.log("✅ [OrderDetailService] Cập nhật xong:", updated);

    await orderDao.recalcTotals(detail.order_id);
    console.log("💰 [OrderDetailService] Tổng đã được tính lại cho order_id:", detail.order_id);

    return updated;
  }

  /**
   * 🗑️ Xoá toàn bộ chi tiết theo order_id, rồi recalc tổng
   */
  async deleteByOrderId(orderId) {
    const id = Number(orderId);
    if (!id) throw new Error("orderId is required");

    console.log("🗑️ [OrderDetailService] deleteByOrderId() gọi với:", id);
    const count = await orderDetailDao.deleteByOrderId(id);
    console.log("✅ [OrderDetailService] Đã xoá", count, "chi tiết.");

    await orderDao.recalcTotals(id);
    console.log("💰 [OrderDetailService] recalcTotals() sau khi xoá hoàn tất.");

    return count;
  }
}

module.exports = new OrderDetailService();
