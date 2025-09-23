// dao/cartDao.js
const GenericDao = require("./generic_dao");
const Cart = require("../models/cart");

const cartDao = new GenericDao("carts", Cart);

module.exports = cartDao;
