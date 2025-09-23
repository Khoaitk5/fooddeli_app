// dao/videoDao.js
const GenericDao = require("./generic_dao");
const Video = require("../models/video");

const videoDao = new GenericDao("videos", Video);

module.exports = videoDao;
