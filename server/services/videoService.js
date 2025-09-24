const videoDao = require("../dao/videoDao");

const videoService = {
    async createVideo(videoData){
        return await videoDao.create(videoData);
    },
    async getVideoById(videoId){
        return await videoDao.getById(videoId);
    },
    async getAllVideos(){
        return await videoDao.getAll();
    },
    async updateVideo(videoId, updateData){
        return await videoDao.update(videoId, updateData);
    },
    async deleteVideo(videoId){
        return await videoDao.delete(videoId);
    }
};

module.exports = videoService;
