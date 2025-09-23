// dao/orderDao.js
const GenericDao = require("./generic_dao");
const Order = require("../models/order");

const orderDao = new GenericDao("orders", Order);

module.exports = orderDao;
