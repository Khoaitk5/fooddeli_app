const videoLikeDao = require("../dao/video_likeDao");

const videoLikeService = {
  async likeVideo(video_id, user_id) {
    return await videoLikeDao.likeVideo(video_id, user_id);
  },

  async unlikeVideo(video_id, user_id) {
    return await videoLikeDao.unlikeVideo(video_id, user_id);
  },

  async isLiked(video_id, user_id) {
    return await videoLikeDao.isLiked(video_id, user_id);
  },
};

module.exports = videoLikeService;
