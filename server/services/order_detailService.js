const order_detailDao = require("../dao/order_detailDao");

const order_detailService = {
  async createOrderDetail(orderDetailData) {
    if (Array.isArray(orderDetailData)) {
      // Nếu truyền vào là danh sách -> insert từng dòng
      const results = [];
      for (const detail of orderDetailData) {
        const created = await order_detailDao.create(detail);
        results.push(created);
      }
      return results; // trả về mảng các order_detail đã tạo
    } else {
      // Nếu truyền 1 object -> tạo 1 dòng
      return await order_detailDao.create(orderDetailData);
    }
  },

  async getOrderDetailById(orderDetailId) {
    return await order_detailDao.findById(orderDetailId);
  },
  async getAllOrderDetails() {
    return await order_detailDao.findAll();
  },
  async updateOrderDetail(orderDetailId, updateData) {
    return await order_detailDao.update(orderDetailId, updateData);
  },
  async deleteOrderDetail(orderDetailId) {
    return await order_detailDao.delete(orderDetailId);
  },
};

module.exports = order_detailService;
