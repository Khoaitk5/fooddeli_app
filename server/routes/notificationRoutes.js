const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");

router.get("/", notificationController.getMyNotifications);
router.get("/unread", notificationController.getMyUnreadNotifications);
router.post("/mark-all-read", notificationController.markAllAsRead);

module.exports = router;
