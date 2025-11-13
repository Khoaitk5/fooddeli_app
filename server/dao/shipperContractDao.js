const GenericDao = require("./generic_dao");
const ShipperContract = require("../models/shipper_contract");

class ShipperContractDao extends GenericDao {
  constructor() {
    super("shipper_contracts", ShipperContract);
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

module.exports = new ShipperContractDao();
