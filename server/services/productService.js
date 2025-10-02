const productDao = require("../dao/productDao");

const productService = {
    async createProduct(productData){
        return await productDao.create(productData);
    },
    async getProductById(productId){
        return await productDao.findById(productId);
    },
    async getAllProducts(){
        return await productDao.findAll();
    },
    async updateProduct(productId, updateData){
        return await productDao.update(productId, updateData);
    },
    async deleteProduct(productId){
        return await productDao.delete(productId);
    },

     /**
     * Cập nhật trạng thái is_available (còn bán / ngừng bán) cho sản phẩm
     * @param {number} productId - ID sản phẩm cần cập nhật
     * @param {boolean} isAvailable - true = còn bán, false = ngừng bán
     * @returns {Promise<object>} - Sản phẩm sau khi cập nhật
     */
    async updateAvailability(productId, isAvailable) {
        return await productDao.updateAvailability(productId, isAvailable);
    }
};

module.exports = productService;
