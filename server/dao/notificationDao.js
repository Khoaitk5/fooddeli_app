// dao/notificationDao.js
const GenericDao = require("./generic_dao");
const Notification = require("../models/notification");

class NotificationDao extends GenericDao {
  constructor() {
    // Gọi constructor của GenericDao, truyền tên bảng và model tương ứng
    super("notifications", Notification);
  }

  /**
   * Lấy tất cả thông báo của 1 user (mới nhất lên trước)
   * @param {number} userId - ID người dùng
   * @returns {Promise<object[]>} - Danh sách thông báo
   */
  async getNotificationsByUserId(userId) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Lấy danh sách thông báo chưa đọc của 1 user
   * @param {number} userId - ID người dùng
   * @returns {Promise<object[]>} - Danh sách thông báo chưa đọc
   */
  async getUnreadNotifications(userId) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1 AND is_read = FALSE
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Đánh dấu tất cả thông báo là đã đọc cho 1 user
   * @param {number} userId - ID người dùng
   * @returns {Promise<number>} - Số lượng thông báo được cập nhật
   */
  async markAllAsRead(userId) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1 AND is_read = FALSE;
    `;
    const result = await pool.query(query, [userId]);
    return result.rowCount; // số bản ghi được cập nhật
  }

  /**
   * Đánh dấu 1 thông báo cụ thể là đã đọc
   * @param {number} notificationId - ID thông báo
   * @returns {Promise<object>} - Thông báo sau khi cập nhật
   */
  async markAsRead(notificationId) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [notificationId]);
    return result.rows[0];
  }
}

// Export một instance để dùng trong service/controller
module.exports = new NotificationDao();
