const shipperContractDao = require("../dao/shipperContractDao");

const shipperContractService = {
  async create(data) {
    return shipperContractDao.create(data);
  },
  async getById(id) {
    return shipperContractDao.findById(id);
  },
  async list() {
    return shipperContractDao.findAll();
  },
  async update(id, data) {
    return shipperContractDao.updateById(id, data);
  },
  async remove(id) {
    return shipperContractDao.deleteById(id);
  },
};

module.exports = shipperContractService;
