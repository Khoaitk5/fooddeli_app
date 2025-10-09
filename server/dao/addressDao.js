// dao/addressDao.js
const GenericDao = require("./generic_dao");
const Address = require("../models/address");
const pool = require("../config/db");

class AddressDao extends GenericDao {
  constructor() {
    super("addresses", Address);
  }

  /**
   * 📍 Lấy tất cả địa chỉ của một user
   * @param {number} userId - ID người dùng
   * @returns {Promise<object[]>} - Danh sách địa chỉ
   */
  async getAddressesByUserId(userId) {
    const query = `
      SELECT * FROM addresses
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => new Address(row));
  }

  /**
   * ⭐ Lấy địa chỉ mặc định của một user
   * @param {number} userId - ID người dùng
   * @returns {Promise<object|null>} - Địa chỉ mặc định hoặc null nếu chưa có
   */
  async getDefaultAddress(userId) {
    const query = `
      SELECT * FROM addresses
      WHERE user_id = $1 AND is_default = TRUE
      LIMIT 1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] ? new Address(result.rows[0]) : null;
  }

  /**
   * 🏡 Thêm địa chỉ mới cho user
   * @param {object} addressData - { user_id, address_line, note, address_type, is_default }
   * @returns {Promise<object>} - Địa chỉ mới tạo
   */
  async addAddress(addressData) {
    const {
      user_id,
      address_line,
      note = "",
      address_type = "Nhà",
      is_default = false,
    } = addressData;

    // Nếu thêm địa chỉ mặc định → bỏ mặc định của địa chỉ cũ
    if (is_default) {
      await this.removeDefaultAddress(user_id);
    }

    const query = `
      INSERT INTO addresses (user_id, address_line, note, address_type, is_default)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await pool.query(query, [
      user_id,
      address_line,
      note,
      address_type,
      is_default,
    ]);

    return new Address(result.rows[0]);
  }

  /**
   * ✏️ Cập nhật địa chỉ
   * @param {number} addressId - ID địa chỉ
   * @param {object} updateData - { address_line?, note?, address_type?, is_default? }
   * @returns {Promise<object>} - Địa chỉ sau khi cập nhật
   */
  async updateAddress(addressId, updateData) {
    const { address_line, note, address_type, is_default } = updateData;

    // Nếu cập nhật sang mặc định → bỏ mặc định của địa chỉ cũ
    if (is_default) {
      const address = await this.findById(addressId);
      if (address) {
        await this.removeDefaultAddress(address.user_id);
      }
    }

    const query = `
      UPDATE addresses
      SET 
        address_line = COALESCE($1, address_line),
        note = COALESCE($2, note),
        address_type = COALESCE($3, address_type),
        is_default = COALESCE($4, is_default),
        updated_at = NOW()
      WHERE address_id = $5
      RETURNING *;
    `;
    const result = await pool.query(query, [
      address_line,
      note,
      address_type,
      is_default,
      addressId,
    ]);

    return result.rows[0] ? new Address(result.rows[0]) : null;
  }

  /**
   * ❌ Xóa một địa chỉ cụ thể
   * @param {number} addressId - ID địa chỉ cần xóa
   * @returns {Promise<boolean>} - true nếu xóa thành công
   */
  async deleteAddress(addressId) {
    const query = `
      DELETE FROM addresses
      WHERE address_id = $1;
    `;
    const result = await pool.query(query, [addressId]);
    return result.rowCount > 0;
  }

  /**
   * 🔄 Gỡ bỏ trạng thái mặc định khỏi tất cả địa chỉ của user
   * @param {number} userId - ID người dùng
   * @returns {Promise<number>} - Số địa chỉ đã cập nhật
   */
  async removeDefaultAddress(userId) {
    const query = `
      UPDATE addresses
      SET is_default = FALSE
      WHERE user_id = $1 AND is_default = TRUE;
    `;
    const result = await pool.query(query, [userId]);
    return result.rowCount;
  }
}

module.exports = new AddressDao();
