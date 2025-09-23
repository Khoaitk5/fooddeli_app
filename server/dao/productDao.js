// dao/productDao.js
const GenericDao = require("./generic_dao");
const Product = require("../models/product");

const productDao = new GenericDao("products", Product);

module.exports = productDao;
