
const GenericDao = require("./generic_dao");
const ShipperProfile = require("../models/shipper_profile");

const shipperProfileDao = new GenericDao("shipper_profiles", ShipperProfile);

module.exports = shipperProfileDao;
