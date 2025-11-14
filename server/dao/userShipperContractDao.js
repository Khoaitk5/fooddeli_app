const GenericDao = require("./generic_dao");
const UserShipperContract = require("../models/user_shipper_contract");
const pool = require("../config/db");

class UserShipperContractDao extends GenericDao {
  constructor() {
    super("user_shipper_contracts", UserShipperContract);
  }

  async findById(id) {
    return super.findById("id", id);
  }

  async findByUserId(userId) {
    const res = await pool.query(
      `SELECT * FROM user_shipper_contracts WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return res.rows.map((r) => new UserShipperContract(r));
  }

  async updateById(id, data) {
    return super.update("id", id, data);
  }

  async deleteById(id) {
    return super.delete("id", id);
  }
}

module.exports = new UserShipperContractDao();
