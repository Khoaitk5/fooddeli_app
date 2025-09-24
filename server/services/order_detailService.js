const order_detailDao = require("../dao/order_detailDao");

const order_detailService = {
    async createOrderDetail(orderDetailData){
        return await order_detailDao.create(orderDetailData);
    },
    async getOrderDetailById(orderDetailId){
        return await order_detailDao.getById(orderDetailId);
    },
    async getAllOrderDetails(){
        return await order_detailDao.getAll();
    },
    async updateOrderDetail(orderDetailId, updateData){
        return await order_detailDao.update(orderDetailId, updateData);
    },
    async deleteOrderDetail(orderDetailId){
        return await order_detailDao.delete(orderDetailId);
    }
};

module.exports = order_detailService;
