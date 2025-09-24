const contractsDao = require("../dao/contractsDao");

const contractsService = {
    async createContract(contractData){
        return await contractsDao.create(contractData);
    },
    async getContractById(contractId){
        return await contractsDao.getById(contractId);
    },
    async getAllContracts(){
        return await contractsDao.getAll();
    },
    async updateContract(contractId, updateData){
        return await contractsDao.update(contractId, updateData);
    },
    async deleteContract(contractId){
        return await contractsDao.delete(contractId);
    }
};

module.exports = contractsService;
