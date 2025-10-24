// server/routes/adminRoutes.js
const express = require('express');
const ctrl = require('../controllers/adminController.js');

const router = express.Router();

// =============================
// 🏪 QUẢN LÝ CỬA HÀNG
// =============================
router.get('/shops', ctrl.getShops);
router.post('/shops/:id/approve', ctrl.approveShop);
router.post('/shops/:id/suspend', ctrl.suspendShop);

// =============================
// 🚚 QUẢN LÝ SHIPPER
// =============================
router.get('/shippers', ctrl.getShippers);
router.post('/shippers/:id/verify', ctrl.verifyShipper);

// =============================
// 👤 QUẢN LÝ KHÁCH HÀNG
// =============================
router.get('/customers', ctrl.getCustomers);
router.post('/customers/:id/ban', ctrl.banCustomer);

// =============================
// 📊 DASHBOARD STATS (mini charts)
// =============================
router.get('/stats/overview', ctrl.getOverview);
router.get('/stats/dashboard/monthly', ctrl.getDashboardMonthlyRevenue);
router.get('/stats/dashboard/weekly', ctrl.getWeeklyOrders);
router.get('/stats/dashboard/users', ctrl.getUserDistribution);

// =============================
// 💹 REVENUE PAGE (đã rút gọn theo yêu cầu)
// =============================
// So sánh doanh thu Shop vs Shipper
router.get('/stats/revenue/comparison', ctrl.getRevenueComparison);

// Top cửa hàng theo doanh thu
router.get('/stats/revenue/topshops', ctrl.getTopRevenueShops);

// Top shipper theo doanh thu
router.get('/stats/revenue/topshippers', ctrl.getTopRevenueShippers);

// =============================
// 💰 CHIA DOANH THU (Settlement)
// =============================
router.get('/settlements/do', ctrl.settleOrders);

module.exports = router;
