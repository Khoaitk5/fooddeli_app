// services/orderDetailService.js
const orderDetailDao = require("../dao/order_detailDao");

const orderDetailService = {
  /**
   * ➕ Thêm mới 1 hoặc nhiều dòng chi tiết đơn hàng
   * @param {object|object[]} orderDetailData - Dữ liệu chi tiết đơn hàng
   * @returns {Promise<object|object[]>}
   */
  async createOrderDetail(orderDetailData) {
    if (Array.isArray(orderDetailData)) {
      const results = [];
      for (const detail of orderDetailData) {
        if (detail.quantity <= 0) {
          throw new Error("Số lượng phải lớn hơn 0");
        }
        const created = await orderDetailDao.create(detail);
        results.push(created);
      }
      return results;
    } else {
      if (orderDetailData.quantity <= 0) {
        throw new Error("Số lượng phải lớn hơn 0");
      }
      return await orderDetailDao.create(orderDetailData);
    }
  },

  /**
   * 📦 Lấy chi tiết đơn hàng theo ID dòng chi tiết
   * @param {number} orderDetailId
   * @returns {Promise<object|null>}
   */
  async getOrderDetailById(orderDetailId) {
    return await orderDetailDao.findById(orderDetailId);
  },

  /**
   * 📜 Lấy tất cả chi tiết đơn hàng
   * @returns {Promise<object[]>}
   */
  async getAllOrderDetails() {
    return await orderDetailDao.findAll();
  },

  /**
   * 📦 Lấy tất cả chi tiết theo order_id
   * @param {number} orderId - ID đơn hàng
   * @returns {Promise<object[]>}
   */
  async getDetailsByOrderId(orderId) {
    return await orderDetailDao.getByOrderId(orderId);
  },

  /**
   * ✏️ Cập nhật thông tin chi tiết đơn hàng
   * @param {number} orderDetailId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateOrderDetail(orderDetailId, updateData) {
    const existing = await orderDetailDao.findById(orderDetailId);
    if (!existing) {
      throw new Error("Chi tiết đơn hàng không tồn tại");
    }
    return await orderDetailDao.update(orderDetailId, updateData);
  },

  /**
   * ✏️ Cập nhật số lượng dòng chi tiết đơn hàng
   * @param {number} orderDetailId
   * @param {number} quantity
   * @returns {Promise<object>}
   */
  async updateQuantity(orderDetailId, quantity) {
    return await orderDetailDao.updateQuantity(orderDetailId, quantity);
  },

  /**
   * 🗑️ Xóa một dòng chi tiết đơn hàng
   * @param {number} orderDetailId
   * @returns {Promise<boolean>}
   */
  async deleteOrderDetail(orderDetailId) {
    const existing = await orderDetailDao.findById(orderDetailId);
    if (!existing) {
      throw new Error("Chi tiết đơn hàng không tồn tại");
    }
    return await orderDetailDao.delete(orderDetailId);
  },

  /**
   * 🗑️ Xóa toàn bộ chi tiết theo order_id (khi hủy đơn)
   * @param {number} orderId
   * @returns {Promise<number>} - Số dòng chi tiết đã bị xóa
   */
  async deleteDetailsByOrderId(orderId) {
    return await orderDetailDao.deleteByOrderId(orderId);
  },
};

module.exports = orderDetailService;
