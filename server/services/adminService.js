const dao = require('../dao/adminDao.js');

// =============================
// 🏪 SHOP
// =============================
async function listShops() {
  return await dao.getAllShops();
}

async function approveShop(id) {
  return await dao.updateShopStatus(id, 'open');
}

async function suspendShop(id) {
  return await dao.updateShopStatus(id, 'closed');
}

// =============================
// 🚚 SHIPPER
// =============================
async function listShippers() {
  return await dao.getAllShippers();
}

async function verifyShipper(id) {
  return await dao.updateShipperStatus(id, 'approved');
}

async function suspendShipper(id) {
  return await dao.updateShipperStatus(id, 'rejected');
}

// =============================
// 👤 CUSTOMER
// =============================
async function listCustomers() {
  return await dao.getAllCustomers();
}

async function banCustomer(id) {
  return await dao.updateUserStatus(id, 'banned');
}

async function unbanCustomer(id) {
  return await dao.updateUserStatus(id, 'active');
}

// =============================
// 📊 STATS
// =============================
async function getStats() {
  return await dao.getOverviewStats();
}

async function getTopShops() {
  return await dao.getTopShops();
}

async function getTopShippers() {
  return await dao.getTopShippers();
}

// =============================
// 💰 SETTLEMENT
// =============================
async function doSettlement() {
  const orders = await dao.getPendingOrders();

  for (const o of orders) {
    const merchant_earn = o.food_price * (1 - o.merchant_commission_rate);
    const shipper_earn = o.delivery_fee * (1 - o.shipper_commission_rate);
    const admin_earn =
      o.food_price * o.merchant_commission_rate +
      o.delivery_fee * o.shipper_commission_rate;

    await dao.updateOrderSettlement(
      o.order_id,
      merchant_earn,
      shipper_earn,
      admin_earn
    );
  }

  return orders.length;
}

// =============================
// 📊 DASHBOARD CHARTS (Dashboard.jsx)
// =============================
async function getMonthlyRevenue() {
  return await dao.getMonthlyRevenue();
}

async function getWeeklyOrders() {
  return await dao.getWeeklyOrders();
}

async function getUserDistribution() {
  const rows = await dao.getUserDistribution();
  const summary = {};
  rows.forEach((r) => (summary[r.role] = r.count));
  return summary;
}

// =============================
// 💹 REVENUE PAGE (Revenue.jsx)
// =============================

// 1️⃣ So sánh doanh thu Shop vs Shipper
async function getRevenueComparison() {
  return await dao.getRevenueComparison();
}

// 2️⃣ Top cửa hàng theo doanh thu
async function getTopRevenueShops() {
  return await dao.getTopRevenueShops();
}

// 3️⃣ Top shipper theo doanh thu
async function getTopRevenueShippers() {
  return await dao.getTopRevenueShippers();
}

// =============================
// 📦 EXPORT MODULES
// =============================
module.exports = {
  // SHOP
  listShops,
  approveShop,
  suspendShop,

  // SHIPPER
  listShippers,
  verifyShipper,
  suspendShipper,

  // CUSTOMER
  listCustomers,
  banCustomer,
  unbanCustomer,

  // STATS
  getStats,
  getTopShops,
  getTopShippers,

  // SETTLEMENT
  doSettlement,

  // DASHBOARD CHARTS
  getMonthlyRevenue,
  getWeeklyOrders,
  getUserDistribution,

  // REVENUE PAGE
  getRevenueComparison,
  getTopRevenueShops,
  getTopRevenueShippers,
};
