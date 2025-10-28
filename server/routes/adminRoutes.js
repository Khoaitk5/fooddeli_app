// server/routes/adminRoutes.js
const express = require('express');
const ctrl = require('../controllers/adminController.js');

const router = express.Router();

/* ============================================
 🏪 QUẢN LÝ CỬA HÀNG (SHOP)
============================================ */
router.get('/shops', ctrl.getShops);
router.post('/shops/:id/approve', ctrl.approveShop);
router.post('/shops/:id/suspend', ctrl.suspendShop);

/* ============================================
 🚚 QUẢN LÝ SHIPPER
============================================ */
router.get('/shippers', ctrl.getShippers);
router.post('/shippers/:id/verify', ctrl.verifyShipper);  // Duyệt shipper
router.post('/shippers/:id/suspend', ctrl.suspendShipper); // 🆕 Thêm suspend shipper (reject)

/* ============================================
 👤 QUẢN LÝ KHÁCH HÀNG
============================================ */
// Lấy toàn bộ khách hàng
router.get('/customers', ctrl.getCustomers);

// Lấy chi tiết 1 khách hàng
router.get('/customers/:id', ctrl.getCustomerById);

// Khóa tài khoản khách hàng
router.post('/customers/:id/ban', ctrl.banCustomer);

// Mở khóa tài khoản khách hàng
router.post('/customers/:id/unban', ctrl.unbanCustomer);

// Thống kê top khách hàng theo tổng chi tiêu
router.get('/customers/stats/revenue', ctrl.getCustomerRevenueStats);

/* ============================================
 📊 DASHBOARD STATS (mini charts)
============================================ */
// Tổng quan (4 thẻ đầu Dashboard)
router.get('/stats/overview', ctrl.getOverview);

// Doanh thu theo tháng (Bar chart)
router.get('/stats/dashboard/monthly', ctrl.getDashboardMonthlyRevenue);

// Đơn hàng theo tuần (Line chart)
router.get('/stats/dashboard/weekly', ctrl.getWeeklyOrders);

// Phân bố người dùng (Pie chart)
router.get('/stats/dashboard/users', ctrl.getUserDistribution);

/* ============================================
 💹 REVENUE PAGE (Revenue.jsx)
============================================ */
// So sánh doanh thu Shop vs Shipper
router.get('/stats/revenue/comparison', ctrl.getRevenueComparison);

// Top cửa hàng theo doanh thu
router.get('/stats/revenue/topshops', ctrl.getTopRevenueShops);

// Top shipper theo doanh thu
router.get('/stats/revenue/topshippers', ctrl.getTopRevenueShippers);

/* ============================================
 💰 CHIA DOANH THU (Settlement)
============================================ */
router.get('/settlements/do', ctrl.settleOrders);

/* ============================================
 🧩 MIDDLEWARE LOG (tuỳ chọn debug)
============================================ */
router.use((req, res, next) => {
  console.log(`📡 [Route] ${req.method} ${req.originalUrl}`);
  next();
});

module.exports = router;
