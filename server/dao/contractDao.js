// dao/contractDao.js
const FirestoreDao = require("./firestore_dao");
const Contract = require("../models/contract");

class ContractDao extends FirestoreDao {
  constructor() {
    super("contracts", Contract);
  }

  /**
   * Khóa hợp đồng (chuyển trạng thái từ 'active' sang 'inactive')
   * @param {string} contractId - ID của hợp đồng cần khóa
   * @returns {Promise<object>} - Hợp đồng sau khi cập nhật
   * @throws {Error} - Nếu hợp đồng không tồn tại hoặc không ở trạng thái 'active'
   */
  async lockContract(contractId) {
    try {
      const contract = await this.findById(contractId);

      if (!contract) {
        throw new Error("Contract not found");
      }

      if (contract.status !== "active") {
        throw new Error("Only active contracts can be locked");
      }

      return this.update(contractId, { status: "inactive" });
    } catch (err) {
      console.error("❌ Error in lockContract:", err.message);
      throw err;
    }
  }

  /**
   * Lấy danh sách hợp đồng theo user_id
   * @param {string} userId - ID của người dùng
   * @returns {Promise<object[]>} - Danh sách hợp đồng
   */
  async getContractsByUserId(userId) {
    const conditions = [{ field: "user_id", operator: "==", value: userId }];
    return this.findWithConditions(conditions, "created_at", "desc");
  }
}

module.exports = new ContractDao();
