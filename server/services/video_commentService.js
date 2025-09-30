const video_commentDao = require("../dao/video_commentDao");

const videoCommentService = {
    async createVideoComment(videoCommentData){
        return await video_commentDao.create(videoCommentData);
    },
    async getVideoCommentById(videoCommentId){
        return await video_commentDao.findById(videoCommentId);
    },
    async getAllVideoComments(){
        return await video_commentDao.findAll();
    },
    async updateVideoComment(videoCommentId, updateData){
        return await video_commentDao.update(videoCommentId, updateData);
    },
    async deleteVideoComment(videoCommentId){
        return await video_commentDao.delete(videoCommentId);
    }
};

module.exports = videoCommentService;
