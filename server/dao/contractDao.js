// dao/contractDao.js
const GenericDao = require("./generic_dao");
const Contract = require("../models/contract");

class ContractDao extends GenericDao {
  constructor() {
    super("contracts", Contract);
  }

  /**
   * Khóa hợp đồng (chuyển trạng thái từ 'active' sang 'inactive')
   * @param {number} contractId - ID của hợp đồng cần khóa
   * @returns {Promise<object>} - Hợp đồng sau khi cập nhật
   * @throws {Error} - Nếu hợp đồng không tồn tại hoặc không ở trạng thái 'active'
   */
  async lockContract(contractId) {
    // Lấy hợp đồng theo ID
    const contract = await this.findById(contractId);

    if (!contract) {
      throw new Error("Contract not found");
    }

    if (contract.status !== "active") {
      throw new Error("Only active contracts can be locked");
    }

    // Cập nhật trạng thái hợp đồng sang inactive
    const query = `
      UPDATE contracts
      SET status = 'inactive',
          updated_at = NOW()
      WHERE contract_id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [contractId]);
    return result.rows[0];
  }

  /**
   * Lấy danh sách hợp đồng theo user_id
   * @param {number} userId - ID của người dùng
   * @returns {Promise<object[]>} - Danh sách hợp đồng
   */
  async getContractsByUserId(userId) {
    const query = `
      SELECT * FROM contracts
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = new ContractDao();
