const contractsDao = require("../dao/contractsDao");

const contractsService = {
    async createContract(contractData){
        return await contractsDao.create(contractData);
    },
    async getContractById(contractId){
        return await contractsDao.findById(contractId);
    },
    async getAllContracts(){
        return await contractsDao.findAll();
    },
    async updateContract(contractId, updateData){
        return await contractsDao.update(contractId, updateData);
    },
    async deleteContract(contractId){
        return await contractsDao.delete(contractId);
    }
};

module.exports = contractsService;
