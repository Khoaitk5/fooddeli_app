const GenericDao = require("./generic_dao");
const ShopContract = require("../models/shop_contract");

class ShopContractDao extends GenericDao {
  constructor() {
    super("shop_contracts", ShopContract);
  }

  async findById(id) {
    return super.findById("id", id);
  }

  async updateById(id, data) {
    return super.update("id", id, data);
  }

  async deleteById(id) {
    return super.delete("id", id);
  }
}

module.exports = new ShopContractDao();
