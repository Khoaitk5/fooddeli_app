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

  // Lấy bản ghi link mới nhất theo user_id (để suy ra contract_id từ user)
  async findLatestByUserId(userId) {
    const res = await pool.query(
      `SELECT * FROM user_shipper_contracts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    return res.rows[0] ? new UserShipperContract(res.rows[0]) : null;
  }

  async findLatestByContractId(contractId) {
    const res = await pool.query(
      `SELECT * FROM user_shipper_contracts WHERE contract_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [contractId]
    );
    return res.rows[0] ? new UserShipperContract(res.rows[0]) : null;
  }

  async updateById(id, data) {
    return super.update("id", id, data);
  }

  async deleteById(id) {
    return super.delete("id", id);
  }
}

module.exports = new UserShipperContractDao();
