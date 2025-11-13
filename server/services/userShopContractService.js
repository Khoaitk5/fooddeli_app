const userShopContractDao = require("../dao/userShopContractDao");

const userShopContractService = {
  async link(data) {
    return userShopContractDao.create(data);
  },
  async getById(id) {
    return userShopContractDao.findById(id);
  },
  async list() {
    return userShopContractDao.findAll();
  },
  async listByUser(userId) {
    return userShopContractDao.findByUserId(userId);
  },
  async update(id, data) {
    return userShopContractDao.updateById(id, data);
  },
  async remove(id) {
    return userShopContractDao.deleteById(id);
  },
};

module.exports = userShopContractService;
