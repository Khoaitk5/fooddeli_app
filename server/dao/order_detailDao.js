// dao/orderDetailDao.js
const FirestoreDao = require("./firestore_dao");
const OrderDetail = require("../models/order_detail");

class OrderDetailDao extends FirestoreDao {
  constructor() {
    super("order_details", OrderDetail);
  }

  /**
   * Lấy danh sách chi tiết đơn hàng theo order_id
   * @param {string} orderId - ID của đơn hàng
   * @returns {Promise<object[]>} - Danh sách các dòng chi tiết đơn hàng
   */
  async getByOrderId(orderId) {
    const conditions = [{ field: "order_id", operator: "==", value: orderId }];
    return this.findWithConditions(conditions, "created_at", "asc");
  }

  /**
   * Cập nhật số lượng và tổng tiền cho một dòng sản phẩm trong đơn hàng
   * @param {string} detailId - ID dòng chi tiết
   * @param {number} quantity - Số lượng mới
   * @returns {Promise<object>} - Chi tiết đơn hàng sau khi cập nhật
   */
  async updateQuantity(detailId, quantity) {
    if (quantity <= 0) throw new Error("Số lượng phải lớn hơn 0");

    try {
      const detail = await this.findById(detailId);
      if (!detail) return null;

      const lineTotal = (detail.unit_price || 0) * quantity;
      return this.update(detailId, { quantity, line_total: lineTotal });
    } catch (err) {
      console.error("❌ Error in updateQuantity:", err.message);
      throw err;
    }
  }

  /**
   * Xóa tất cả chi tiết theo đơn hàng (khi huỷ đơn)
   * @param {string} orderId - ID đơn hàng
   * @returns {Promise<number>} - Số dòng chi tiết đã bị xóa
   */
  async deleteByOrderId(orderId) {
    try {
      const details = await this.getByOrderId(orderId);
      let count = 0;

      for (const detail of details) {
        await this.delete(detail.id);
        count++;
      }

      return count;
    } catch (err) {
      console.error("❌ Error in deleteByOrderId:", err.message);
      throw err;
    }
  }
}

module.exports = new OrderDetailDao();
