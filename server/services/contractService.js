// services/contractService.js
const contractDao = require("../dao/contractDao");

const contractService = {
  /**
   * ✍️ Tạo hợp đồng mới
   * @param {object} contractData - Dữ liệu hợp đồng
   * @returns {Promise<object>}
   */
  async createContract(contractData) {
    return await contractDao.create(contractData);
  },

  /**
   * 📄 Lấy hợp đồng theo ID
   * @param {number} contractId
   * @returns {Promise<object|null>}
   */
  async getContractById(contractId) {
    return await contractDao.findById(contractId);
  },

  /**
   * 📜 Lấy toàn bộ hợp đồng
   * @returns {Promise<object[]>}
   */
  async getAllContracts() {
    return await contractDao.findAll();
  },

  /**
   * ✏️ Cập nhật hợp đồng
   * @param {number} contractId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateContract(contractId, updateData) {
    const existing = await contractDao.findById(contractId);
    if (!existing) {
      throw new Error("Contract not found");
    }
    return await contractDao.update(contractId, updateData);
  },

  /**
   * 🗑️ Xóa hợp đồng theo ID
   * @param {number} contractId
   * @returns {Promise<boolean>} - true nếu xóa thành công
   */
  async deleteContract(contractId) {
    const existing = await contractDao.findById(contractId);
    if (!existing) {
      throw new Error("Contract not found");
    }
    return await contractDao.delete(contractId);
  },

  /**
   * 🔐 Khóa hợp đồng (đổi trạng thái từ 'active' sang 'inactive')
   * @param {number} contractId
   * @returns {Promise<object>}
   */
  async lockContract(contractId) {
    return await contractDao.lockContract(contractId);
  },

  /**
   * 📍 Lấy tất cả hợp đồng của 1 người dùng
   * @param {number} userId
   * @returns {Promise<object[]>}
   */
  async getContractsByUserId(userId) {
    return await contractDao.getContractsByUserId(userId);
  },
};

module.exports = contractService;
