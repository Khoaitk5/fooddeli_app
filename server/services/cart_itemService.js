const cart_itemDao = require("../dao/cart_itemDao");

const cart_itemService = {
    async createCartItem(itemData){
        return await cart_itemDao.create(itemData);
    },
    async getCartItemById(itemId){
        return await cart_itemDao.getById(itemId);
    },
    async getAllCartItems(){
        return await cart_itemDao.getAll();
    },
    async updateCartItem(itemId, updateData){
        return await cart_itemDao.update(itemId, updateData);
    },
    async deleteCartItem(itemId){
        return await cart_itemDao.delete(itemId);
    }
};

module.exports = cart_itemService;
