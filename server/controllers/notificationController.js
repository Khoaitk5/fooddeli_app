const notificationService = require("../services/notificationService");

const getSessionUserId = (req) => req.session?.user?.id;

const ensureAuthenticated = (req, res) => {
  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({
      success: false,
      message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
    });
    return null;
  }
  return userId;
};

const getMyNotifications = async (req, res) => {
  try {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    const notifications = await notificationService.getNotificationsByUserId(
      userId
    );

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("❌ Lỗi getMyNotifications:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách thông báo.",
    });
  }
};

const getMyUnreadNotifications = async (req, res) => {
  try {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    const notifications = await notificationService.getUnreadNotifications(
      userId
    );

    res.status(200).json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error("❌ Lỗi getMyUnreadNotifications:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông báo chưa đọc.",
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    const updatedCount = await notificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      updatedCount,
    });
  } catch (error) {
    console.error("❌ Lỗi markAllAsRead:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái thông báo.",
    });
  }
};

module.exports = {
  getMyNotifications,
  getMyUnreadNotifications,
  markAllAsRead,
};
