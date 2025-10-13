const GenericDao = require("./generic_dao");
const UserAddress = require("../models/user_address");
const Address = require("../models/address");
const pool = require("../config/db");

/**
 * @class UserAddressDao
 * @extends GenericDao
 * @description DAO cho bảng `user_addresses`
 */
class UserAddressDao extends GenericDao {
  constructor() {
    super("user_addresses", UserAddress);
  }

  /**
   * Lấy tất cả địa chỉ của 1 user (JOIN addresses)
   */
  async getAddressesByUserId(userId) {
    const query = `
      SELECT a.*, ua.is_primary
      FROM user_addresses ua
      JOIN addresses a ON ua.address_id = a.address_id
      WHERE ua.user_id = $1
      ORDER BY ua.created_at DESC;
    `;
    const res = await pool.query(query, [userId]);
    return res.rows.map(row => new Address(row));
  }

  /**
   * Lấy địa chỉ mặc định (is_primary = TRUE)
   */
  async getDefaultAddressByUserId(userId) {
    const query = `
      SELECT a.*, ua.is_primary
      FROM user_addresses ua
      JOIN addresses a ON ua.address_id = a.address_id
      WHERE ua.user_id = $1 AND ua.is_primary = TRUE
      LIMIT 1;
    `;
    const res = await pool.query(query, [userId]);
    return res.rows[0] ? new Address(res.rows[0]) : null;
  }

  /**
   * Cập nhật quan hệ user ↔ address (vd: đổi is_primary)
   */
  async updateByAddressId(addressId, updateData) {
    const keys = Object.keys(updateData);
    const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    const values = [addressId, ...Object.values(updateData)];

    const query = `
      UPDATE user_addresses
      SET ${setClause}, updated_at = NOW()
      WHERE address_id = $1
      RETURNING *;
    `;
    const res = await pool.query(query, values);
    return res.rows[0] ? new UserAddress(res.rows[0]) : null;
  }

  /**
   * Tạo quan hệ giữa user và address (vì GenericDao.create() chỉ tạo trong 1 bảng)
   */
  async createRelation(userId, addressId, isPrimary = false) {
    const query = `
      INSERT INTO user_addresses (user_id, address_id, is_primary, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const res = await pool.query(query, [userId, addressId, isPrimary]);
    return res.rows[0] ? new UserAddress(res.rows[0]) : null;
  }
}

module.exports = new UserAddressDao();
