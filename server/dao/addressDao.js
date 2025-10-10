const GenericDao = require("./generic_dao");
const Address = require("../models/address");

class AddressDao extends GenericDao {
  constructor() {
    super("addresses", Address);
  }
}

module.exports = new AddressDao();
