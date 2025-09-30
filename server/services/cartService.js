const cartDao = require('../dao/cartDao');

const cartService = {
    async createCart(cartData){
        return await cartDao.create(cartData);
    },
    async getCartById(cartId){
        return await cartDao.findById(cartId);
    },
    async getAllCarts(){
        return await cartDao.findAll();
    },
    async updateCart(cartId, updateData){
        return await cartDao.update(cartId, updateData);
    },
    async deleteCart(cartId){
        return await cartDao.delete(cartId);
    }
};

module.exports = cartService;
