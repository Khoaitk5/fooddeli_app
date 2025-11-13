const userShipperContractDao = require("../dao/userShipperContractDao");

const userShipperContractService = {
  async link(data) {
    return userShipperContractDao.create(data);
  },
  async getById(id) {
    return userShipperContractDao.findById(id);
  },
  async list() {
    return userShipperContractDao.findAll();
  },
  async listByUser(userId) {
    return userShipperContractDao.findByUserId(userId);
  },
  async update(id, data) {
    return userShipperContractDao.updateById(id, data);
  },
  async remove(id) {
    return userShipperContractDao.deleteById(id);
  },
};

module.exports = userShipperContractService;
