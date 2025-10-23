// dao/notificationDao.js
const FirestoreDao = require("./firestore_dao");
const Notification = require("../models/notification");

class NotificationDao extends FirestoreDao {
  constructor() {
    super("notifications", Notification);
  }

  /**
   * Lấy tất cả thông báo của 1 user (mới nhất lên trước)
   * @param {string} userId - ID người dùng
   * @returns {Promise<object[]>} - Danh sách thông báo
   */
  async getNotificationsByUserId(userId) {
    const conditions = [{ field: "user_id", operator: "==", value: userId }];
    return this.findWithConditions(conditions, "created_at", "desc");
  }

  /**
   * Lấy danh sách thông báo chưa đọc của 1 user
   * @param {string} userId - ID người dùng
   * @returns {Promise<object[]>} - Danh sách thông báo chưa đọc
   */
  async getUnreadNotifications(userId) {
    try {
      const allNotifications = await this.getNotificationsByUserId(userId);
      return allNotifications.filter(n => !n.is_read);
    } catch (err) {
      console.error("❌ Error in getUnreadNotifications:", err.message);
      throw err;
    }
  }

  /**
   * Đánh dấu tất cả thông báo là đã đọc cho 1 user
   * @param {string} userId - ID người dùng
   * @returns {Promise<number>} - Số lượng thông báo được cập nhật
   */
  async markAllAsRead(userId) {
    try {
      const unreadNotifications = await this.getUnreadNotifications(userId);
      let count = 0;

      for (const notification of unreadNotifications) {
        await this.update(notification.id, { is_read: true });
        count++;
      }

      return count;
    } catch (err) {
      console.error("❌ Error in markAllAsRead:", err.message);
      throw err;
    }
  }

  /**
   * Đánh dấu 1 thông báo cụ thể là đã đọc
   * @param {string} notificationId - ID thông báo
   * @returns {Promise<object>} - Thông báo sau khi cập nhật
   */
  async markAsRead(notificationId) {
    return this.update(notificationId, { is_read: true });
  }
}

module.exports = new NotificationDao();
