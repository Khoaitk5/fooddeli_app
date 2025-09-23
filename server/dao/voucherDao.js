// dao/voucherDao.js
const GenericDao = require("./generic_dao");
const Voucher = require("../models/voucher");

const voucherDao = new GenericDao("vouchers", Voucher);

module.exports = voucherDao;
