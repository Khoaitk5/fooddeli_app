const shopContractDao = require("../dao/shopContractDao");

const shopContractService = {
  async create(data) {
    return shopContractDao.create(data);
  },
  async getById(id) {
    return shopContractDao.findById(id);
  },
  async list() {
    return shopContractDao.findAll();
  },
  async update(id, data) {
    return shopContractDao.updateById(id, data);
  },
  async remove(id) {
    return shopContractDao.deleteById(id);
  },
};

module.exports = shopContractService;
