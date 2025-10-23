const followDao = require("../dao/followDao");

const followService = {
  async followUser(follower_id, followed_id) {
    if (follower_id === followed_id)
      throw new Error("Không thể tự theo dõi chính mình");
    return await followDao.followUser(follower_id, followed_id);
  },

  async unfollowUser(follower_id, followed_id) {
    return await followDao.unfollowUser(follower_id, followed_id);
  },

  async isFollowing(follower_id, followed_id) {
    return await followDao.isFollowing(follower_id, followed_id);
  },
};

module.exports = followService;
