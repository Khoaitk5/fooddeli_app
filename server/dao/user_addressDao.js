const GenericDao = require("./generic_dao");
const UserAddress = require("../models/user_address");
const Address = require("../models/address");
const pool = require("../config/db");

/**
 * @class UserAddressDao
 * @extends GenericDao
 * @description Data Access Object cho bảng `user_addresses`
 */
class UserAddressDao extends GenericDao {
  constructor() {
    super("user_addresses", UserAddress);
  }

  /**
   * @async
   * @function getAllAddressesByUserId
   * @description Lấy danh sách tất cả địa chỉ của user
   * @param {number} userId - ID của user
   * @returns {Promise<Address[]>} Danh sách các địa chỉ
   */
  async getAllAddressesByUserId(userId) {
    const query = `
      SELECT a.*
      FROM user_addresses ua
      JOIN addresses a ON ua.address_id = a.address_id
      WHERE ua.user_id = $1
      ORDER BY ua.created_at DESC;
    `;
    const res = await pool.query(query, [userId]);
    return res.rows.map(row => new Address(row));
  }

  /**
   * @async
   * @function getPrimaryAddressByUserId
   * @description Lấy địa chỉ chính (is_primary = TRUE) của user
   * @param {number} userId - ID của user
   * @returns {Promise<Address|null>} Địa chỉ chính hoặc null nếu không có
   */
  async getPrimaryAddressByUserId(userId) {
    const query = `
      SELECT a.*
      FROM user_addresses ua
      JOIN addresses a ON ua.address_id = a.address_id
      WHERE ua.user_id = $1 AND ua.is_primary = TRUE
      LIMIT 1;
    `;
    const res = await pool.query(query, [userId]);
    return res.rows[0] ? new Address(res.rows[0]) : null;
  }
}

module.exports = new UserAddressDao();
