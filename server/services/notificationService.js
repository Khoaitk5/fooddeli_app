const notificationDao = require("../dao/notificationDao");

const notificationService = {
    async createNotification(notificationData){
        return await notificationDao.create(notificationData);
    },
    async getNotificationById(notificationId){
        return await notificationDao.findById(notificationId);
    },
    async getAllNotifications(){
        return await notificationDao.findAll();
    },
    async updateNotification(notificationId, updateData){
        return await notificationDao.update(notificationId, updateData);
    },
    async deleteNotification(notificationId){
        return await notificationDao.delete(notificationId);
    }
};

module.exports = notificationService;
