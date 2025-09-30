const order_voucherDao = require("../dao/order_voucherDao");

const order_voucherService = {
    async createOrderVoucher(orderVoucherData){
        return await order_voucherDao.create(orderVoucherData);
    },
    async getOrderVoucherById(orderVoucherId){
        return await order_voucherDao.findById(orderVoucherId);
    },
    async getAllOrderVouchers(){
        return await order_voucherDao.findAll();
    },
    async updateOrderVoucher(orderVoucherId, updateData){
        return await order_voucherDao.update(orderVoucherId, updateData);
    },
    async deleteOrderVoucher(orderVoucherId){
        return await order_voucherDao.delete(orderVoucherId);
    }
};

module.exports = order_voucherService;
