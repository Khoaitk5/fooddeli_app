// dao/videoCommentDao.js
const GenericDao = require("./generic_dao");
const VideoComment = require("../models/video_comment");

const videoCommentDao = new GenericDao("video_comments", VideoComment);

module.exports = videoCommentDao;
