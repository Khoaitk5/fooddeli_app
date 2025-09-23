// dao/videoLikeDao.js
const GenericDao = require("./generic_dao");
const VideoLike = require("../models/video_like");

const videoLikeDao = new GenericDao("video_likes", VideoLike);

module.exports = videoLikeDao;
