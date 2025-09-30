const orderDao = require("../dao/orderDao");

const orderService = {
    async createOrder(orderData){
        return await orderDao.create(orderData);
    },
    async getOrderById(orderId){
        return await orderDao.findById(orderId);
    },
    async getAllOrders(){
        return await orderDao.findAll();
    },
    async updateOrder(orderId, updateData){
        return await orderDao.update(orderId, updateData);
    },
    async deleteOrder(orderId){
        return await orderDao.delete(orderId);
    }
};

module.exports = orderService;
