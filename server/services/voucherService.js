const voucherDao = require("../dao/voucherDao");

const voucherService = {
    async createVoucher(voucherData){
        return await voucherDao.create(voucherData);
    },
    async getVoucherById(voucherId){
        return await voucherDao.findById(voucherId);
    },
    async getAllVouchers(){
        return await voucherDao.findAll();
    },
    async updateVoucher(voucherId, updateData){
        return await voucherDao.update(voucherId, updateData);
    },
    async deleteVoucher(voucherId){
        return await voucherDao.delete(voucherId);
    }
};

module.exports = voucherService;
