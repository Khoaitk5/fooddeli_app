// dao/reviewDao.js
const GenericDao = require("./generic_dao");
const Review = require("../models/review");

const reviewDao = new GenericDao("reviews", Review);

module.exports = reviewDao;
