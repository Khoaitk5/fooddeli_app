// services/orderDetailService.js
const orderDetailDao = require("../dao/order_detailDao");
const orderDao = require("../dao/orderDao");

class OrderDetailService {
  /**
   * Lấy chi tiết theo order_id
   */
  async list(orderId, { withProduct = true } = {}) {
    const id = Number(orderId);
    if (!id) throw new Error("orderId is required");
    return await orderDetailDao.getByOrderId(id, { withProduct });
  }

  /**
   * Bulk add nhiều dòng chi tiết (chỉ gọi DAO), rồi recalc tổng (gọi DAO)
   */
  async addMany(orderId, items, { useProvidedUnitPrice = false } = {}) {
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
   * Cập nhật số lượng 1 dòng chi tiết:
   * - lấy detail để biết order_id (DAO.findById)
   * - gọi DAO.updateQuantity
   * - gọi orderDao.recalcTotals(order_id)
   */
  async updateQuantity(detailId, quantity) {
    const did = Number(detailId);
    const qty = Number(quantity);
    if (!did || !qty) throw new Error("detailId and quantity are required");

    const detail = await orderDetailDao.findById("id", did);
    if (!detail) throw new Error("Order detail not found");

    const updated = await orderDetailDao.updateQuantity(did, qty);
    await orderDao.recalcTotals(detail.order_id);

    return updated;
  }

  /**
   * Xoá toàn bộ chi tiết theo order_id rồi recalc tổng
   */
  async deleteByOrderId(orderId) {
    const id = Number(orderId);
    if (!id) throw new Error("orderId is required");

    const count = await orderDetailDao.deleteByOrderId(id);
    await orderDao.recalcTotals(id); // subtotal = 0 => total_price = delivery_fee
    return count;
  }
}

module.exports = new OrderDetailService();
