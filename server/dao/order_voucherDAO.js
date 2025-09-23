// dao/orderVoucherDao.js
const GenericDao = require("./generic_dao");
const OrderVoucher = require("../models/OrderVoucher");

const orderVoucherDao = new GenericDao("order_vouchers", OrderVoucher);

module.exports = orderVoucherDao;
