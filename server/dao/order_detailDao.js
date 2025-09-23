// dao/orderDetailDao.js
const GenericDao = require("./generic_dao");
const OrderDetail = require("../models/order_detail");

const orderDetailDao = new GenericDao("order_details", OrderDetail);

module.exports = orderDetailDao;
