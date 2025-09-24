const productDao = require("../dao/productDao");

const productService = {
    async createProduct(productData){
        return await productDao.create(productData);
    },
    async getProductById(productId){
        return await productDao.getById(productId);
    },
    async getAllProducts(){
        return await productDao.getAll();
    },
    async updateProduct(productId, updateData){
        return await productDao.update(productId, updateData);
    },
    async deleteProduct(productId){
        return await productDao.delete(productId);
    }
};

module.exports = productService;
