// dao/contractDao.js
const GenericDao = require("./generic_dao");
const Contract = require("../models/contract");

const contractDao = new GenericDao("contracts", Contract);

/**
 * Lock a contract (change status from 'active' to 'inactive')
 * @param {string} contractId - ID of the contract to lock
 * @returns {Promise<object>} - Returns the updated contract or throws an error
 */
contractDao.lockContract = async (contractId) => {
  try {
    const contract = await Contract.findById(contractId);

    if (!contract) {
      throw new Error("Contract not found");
    }

    if (contract.status !== "active") {
      throw new Error("Only active contracts can be locked");
    }

    contract.status = "inactive";
    await contract.save();

    return contract;
  } catch (error) {
    console.error("Error locking contract:", error.message);
    throw error;
  }
};

module.exports = contractDao;
