// dao/cartItemDao.js
const GenericDao = require("./generic_dao");
const CartItem = require("../models/cart_item");

const cartItemDao = new GenericDao("cart_items", CartItem);

module.exports = cartItemDao;
