const video_likeDao = require("../dao/video_likeDao");

const videoLikeService = {
    async createVideoLike(videoLikeData){
        return await video_likeDao.create(videoLikeData);
    },
    async getVideoLikeById(videoLikeId){
        return await video_likeDao.findById(videoLikeId);
    },
    async getAllVideoLikes(){
        return await video_likeDao.findAll();
    },
    async updateVideoLike(videoLikeId, updateData){
        return await video_likeDao.update(videoLikeId, updateData);
    },
    async deleteVideoLike(videoLikeId){
        return await video_likeDao.delete(videoLikeId);
    }
};

module.exports = videoLikeService;
