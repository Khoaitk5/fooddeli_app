// services/notificationService.js
const notificationDao = require("../dao/notificationDao");

const notificationService = {
  /**
   * 📩 Tạo thông báo mới
   * @param {object} notificationData - { user_id, title, body }
   * @returns {Promise<object>}
   */
  async createNotification(notificationData) {
    return await notificationDao.create(notificationData);
  },

  /**
   * 📬 Lấy thông báo theo ID
   * @param {number} notificationId
   * @returns {Promise<object|null>}
   */
  async getNotificationById(notificationId) {
    return await notificationDao.findById(notificationId);
  },

  /**
   * 📬 Lấy toàn bộ thông báo của một user (mới nhất trước)
   * @param {number} userId
   * @returns {Promise<object[]>}
   */
  async getNotificationsByUserId(userId) {
    return await notificationDao.getNotificationsByUserId(userId);
  },

  /**
   * 📩 Lấy danh sách thông báo chưa đọc của một user
   * @param {number} userId
   * @returns {Promise<object[]>}
   */
  async getUnreadNotifications(userId) {
    return await notificationDao.getUnreadNotifications(userId);
  },

  /**
   * ✅ Đánh dấu tất cả thông báo là đã đọc cho một user
   * @param {number} userId
   * @returns {Promise<number>} - Số lượng thông báo được cập nhật
   */
  async markAllAsRead(userId) {
    return await notificationDao.markAllAsRead(userId);
  },

  /**
   * 📥 Đánh dấu 1 thông báo cụ thể là đã đọc
   * @param {number} notificationId
   * @returns {Promise<object>}
   */
  async markAsRead(notificationId) {
    // Kiểm tra xem thông báo có tồn tại không
    const notification = await notificationDao.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    return await notificationDao.markAsRead(notificationId);
  },

  /**
   * 🗑️ Xóa một thông báo cụ thể
   * @param {number} notificationId
   * @returns {Promise<boolean>}
   */
  async deleteNotification(notificationId) {
    const notification = await notificationDao.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    return await notificationDao.delete(notificationId);
  },

  /**
   * 🗑️ Xóa toàn bộ thông báo của một user
   * @param {number} userId
   * @returns {Promise<number>} - Số lượng thông báo đã xóa
   */
  async deleteAllNotificationsByUser(userId) {
    const notifications = await notificationDao.getNotificationsByUserId(userId);
    if (notifications.length === 0) {
      return 0;
    }

    let deletedCount = 0;
    for (const n of notifications) {
      const deleted = await notificationDao.delete(n.id);
      if (deleted) deletedCount++;
    }
    return deletedCount;
  },
};

module.exports = notificationService;
