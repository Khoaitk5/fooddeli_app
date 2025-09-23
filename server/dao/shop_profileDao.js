const GenericDao = require("./generic_dao");
const ShopProfile = require("../models/shop_profile");

const shopProfileDao = new GenericDao("shop_profiles", ShopProfile);

module.exports = shopProfileDao;