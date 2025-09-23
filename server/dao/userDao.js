// dao/userDao.js
const GenericDao = require("./generic_dao");
const User = require("../models/user");

// tạo instance cho bảng users
const userDao = new GenericDao("users", User);

module.exports = userDao;
