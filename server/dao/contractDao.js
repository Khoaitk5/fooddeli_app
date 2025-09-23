// dao/contractDao.js
const GenericDao = require("./generic_dao");
const Contract = require("../models/contract");

const contractDao = new GenericDao("contracts", Contract);

module.exports = contractDao;
