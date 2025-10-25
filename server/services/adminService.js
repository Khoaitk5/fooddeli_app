const dao = require('../dao/adminDao.js');

/* ============================================
 🏪 SHOP SERVICES
============================================ */
async function listShops() {
  console.log('📦 [Service] Fetching all shops');
  return await dao.getAllShops();
}

async function approveShop(id) {
  console.log(`✅ [Service] Approving shop ID: ${id}`);
  return await dao.updateShopStatus(id, 'open');
}

async function suspendShop(id) {
  console.log(`🚫 [Service] Suspending shop ID: ${id}`);
  return await dao.updateShopStatus(id, 'closed');
}

/* ============================================
 🚚 SHIPPER SERVICES
============================================ */
async function listShippers() {
  console.log('🚚 [Service] Fetching all shippers');
  return await dao.getAllShippers();
}

async function verifyShipper(id) {
  console.log(`✅ [Service] Verifying shipper ID: ${id}`);
  return await dao.updateShipperStatus(id, 'approved');
}

async function suspendShipper(id) {
  console.log(`🚫 [Service] Rejecting shipper ID: ${id}`);
  return await dao.updateShipperStatus(id, 'rejected');
}

/* ============================================
 👤 CUSTOMER SERVICES
============================================ */
async function listCustomers() {
  console.log('👥 [Service] Fetching all customers');
  return await dao.getAllCustomers();
}

async function getCustomerById(id) {
  console.log(`🔍 [Service] Fetching customer ID: ${id}`);
  return await dao.getCustomerById(id);
}

async function banCustomer(id) {
  console.log(`🚫 [Service] Banning customer ID: ${id}`);
  return await dao.updateUserStatus(id, 'banned');
}

async function unbanCustomer(id) {
  console.log(`🔓 [Service] Unbanning customer ID: ${id}`);
  return await dao.updateUserStatus(id, 'active');
}

async function getCustomerRevenueStats() {
  console.log('📊 [Service] Getting customer revenue stats');
  return await dao.getCustomerRevenueStats();
}

/* ============================================
 📊 DASHBOARD STATS
============================================ */
async function getStats() {
  console.log('📈 [Service] Fetching overview stats');
  return await dao.getOverviewStats();
}

async function getTopShops() {
  console.log('🏪 [Service] Fetching top revenue shops');
  return await dao.getTopRevenueShops();
}

async function getTopShippers() {
  console.log('🚚 [Service] Fetching top revenue shippers');
  return await dao.getTopRevenueShippers();
}

/* ============================================
 💰 SETTLEMENT SERVICES
============================================ */
async function doSettlement() {
  console.log('💰 [Service] Performing settlement process');
  const orders = await dao.getPendingOrders?.();
  if (!orders) {
    console.warn('⚠️ [Service] No pending orders for settlement');
    return 0;
  }

  for (const o of orders) {
    const merchant_earn = o.food_price * (1 - o.merchant_commission_rate);
    const shipper_earn = o.delivery_fee * (1 - o.shipper_commission_rate);
    const admin_earn =
      o.food_price * o.merchant_commission_rate +
      o.delivery_fee * o.shipper_commission_rate;

    await dao.updateOrderSettlement(o.order_id, merchant_earn, shipper_earn, admin_earn);
  }

  console.log(`✅ [Service] Settled ${orders.length} orders`);
  return orders.length;
}

/* ============================================
 📊 DASHBOARD CHARTS (Dashboard.jsx)
============================================ */
async function getMonthlyRevenue() {
  console.log('📊 [Service] Fetching monthly revenue');
  return await dao.getMonthlyRevenue();
}

async function getWeeklyOrders() {
  console.log('📅 [Service] Fetching weekly orders');
  return await dao.getWeeklyOrders();
}

async function getUserDistribution() {
  console.log('🧩 [Service] Fetching user role distribution');
  const rows = await dao.getUserDistribution();
  const summary = {};
  rows.forEach((r) => (summary[r.role] = r.count));
  return summary;
}

/* ============================================
 💹 REVENUE PAGE (Revenue.jsx)
============================================ */
async function getRevenueComparison() {
  console.log('💹 [Service] Fetching revenue comparison (Shop vs Shipper)');
  return await dao.getRevenueComparison();
}

async function getTopRevenueShops() {
  console.log('🏪 [Service] Fetching top revenue shops');
  return await dao.getTopRevenueShops();
}

async function getTopRevenueShippers() {
  console.log('🚚 [Service] Fetching top revenue shippers');
  return await dao.getTopRevenueShippers();
}

/* ============================================
 📦 EXPORT MODULES
============================================ */
module.exports = {
  // 🏪 SHOP
  listShops,
  approveShop,
  suspendShop,

  // 🚚 SHIPPER
  listShippers,
  verifyShipper,
  suspendShipper,

  // 👤 CUSTOMER
  listCustomers,
  getCustomerById,
  banCustomer,
  unbanCustomer,
  getCustomerRevenueStats,

  // 📊 DASHBOARD / STATS
  getStats,
  getTopShops,
  getTopShippers,

  // 💰 SETTLEMENT
  doSettlement,

  // 📊 DASHBOARD CHARTS
  getMonthlyRevenue,
  getWeeklyOrders,
  getUserDistribution,

  // 💹 REVENUE PAGE
  getRevenueComparison,
  getTopRevenueShops,
  getTopRevenueShippers,
};
