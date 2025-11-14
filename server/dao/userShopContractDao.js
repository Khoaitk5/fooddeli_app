const GenericDao = require("./generic_dao");
const UserShopContract = require("../models/user_shop_contract");
const pool = require("../config/db");

class UserShopContractDao extends GenericDao {
  constructor() {
    super("user_shop_contracts", UserShopContract);
  }

  async findById(id) {
    return super.findById("id", id);
  }

  async findByUserId(userId) {
    const res = await pool.query(
      `SELECT * FROM user_shop_contracts WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return res.rows.map((r) => new UserShopContract(r));
  }

  async updateById(id, data) {
    return super.update("id", id, data);
  }

  async deleteById(id) {
    return super.delete("id", id);
  }
}

module.exports = new UserShopContractDao();
