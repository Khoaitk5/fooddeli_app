const reviewDao = require("../dao/reviewDao");

const reviewService = {
    async createReview(reviewData){
        return await reviewDao.create(reviewData);
    },
    async getReviewById(reviewId){
        return await reviewDao.getById(reviewId);
    },
    async getAllReviews(){
        return await reviewDao.getAll();
    },
    async updateReview(reviewId, updateData){
        return await reviewDao.update(reviewId, updateData);
    },
    async deleteReview(reviewId){
        return await reviewDao.delete(reviewId);
    }
};

module.exports = reviewService;
