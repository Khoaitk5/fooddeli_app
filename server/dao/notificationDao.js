// dao/notificationDao.js
const GenericDao = require("./generic_dao");
const Notification = require("../models/notification");

const notificationDao = new GenericDao("notifications", Notification);

module.exports = notificationDao;
