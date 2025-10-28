const dao = require('../dao/adminDao.js');

/* ============================================
 🏪 SHOP SERVICES
============================================ */
async function listShops() {
  console.log('📦 [Service] listShops() → Fetching all shops');
  return await dao.getAllShops();
}

async function approveShop(id) {
  console.log(`🟢 [Service] approveShop(${id}) → Opening shop`);
  const result = await dao.updateShopStatus(id, 'open');
  console.log('✅ [Service] Shop approved:', result);
  return result;
}

async function suspendShop(id) {
  console.log(`🔴 [Service] suspendShop(${id}) → Closing shop`);
  const result = await dao.updateShopStatus(id, 'closed');
  console.log('✅ [Service] Shop suspended:', result);
  return result;
}

/* ============================================
 🚚 SHIPPER SERVICES
============================================ */
async function listShippers() {
  console.log('🚚 [Service] listShippers() → Fetching all shippers');
  return await dao.getAllShippers();
}

async function verifyShipper(id) {
  console.log(`🟢 [Service] verifyShipper(${id}) → Approving shipper`);
  const result = await dao.updateShipperStatus(id, 'approved');
  console.log('✅ [Service] Shipper verified:', result);
  return result;
}

async function suspendShipper(id) {
  console.log(`🔴 [Service] suspendShipper(${id}) → Rejecting shipper`);
  const result = await dao.updateShipperStatus(id, 'rejected');
  console.log('✅ [Service] Shipper suspended:', result);
  return result;
}

/* ============================================
 👤 CUSTOMER SERVICES
============================================ */
async function listCustomers() {
  console.log('👥 [Service] listCustomers() → Fetching all customers');
  return await dao.getAllCustomers();
}

async function getCustomerById(id) {
  console.log(`🔍 [Service] getCustomerById(${id})`);
  return await dao.getCustomerById(id);
}

async function banCustomer(id) {
  console.log(`🚫 [Service] banCustomer(${id}) → Banning user`);
  const result = await dao.updateUserStatus(id, 'banned');
  console.log('✅ [Service] Customer banned:', result);
  return result;
}

async function unbanCustomer(id) {
  console.log(`🔓 [Service] unbanCustomer(${id}) → Activating user`);
  const result = await dao.updateUserStatus(id, 'active');
  console.log('✅ [Service] Customer unbanned:', result);
  return result;
}

async function getCustomerRevenueStats() {
  console.log('📊 [Service] getCustomerRevenueStats()');
  return await dao.getCustomerRevenueStats();
}

/* ============================================
 📊 DASHBOARD STATS
============================================ */
async function getStats() {
  console.log('📈 [Service] getStats() → Fetching overview stats');
  return await dao.getOverviewStats();
}

async function getTopShops() {
  console.log('🏪 [Service] getTopShops() → Fetching top revenue shops');
  return await dao.getTopRevenueShops();
}

async function getTopShippers() {
  console.log('🚚 [Service] getTopShippers() → Fetching top revenue shippers');
  return await dao.getTopRevenueShippers();
}

/* ============================================
 💰 SETTLEMENT SERVICES
============================================ */
async function doSettlement() {
  console.log('💰 [Service] doSettlement() → Performing settlement process');
  const orders = await dao.getPendingOrders?.();
  if (!orders) {
    console.warn('⚠️ [Service] No pending orders found');
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
  console.log('📊 [Service] getMonthlyRevenue()');
  return await dao.getMonthlyRevenue();
}

async function getWeeklyOrders() {
  console.log('📅 [Service] getWeeklyOrders()');
  return await dao.getWeeklyOrders();
}

async function getUserDistribution() {
  console.log('🧩 [Service] getUserDistribution()');
  const rows = await dao.getUserDistribution();
  const summary = {};
  rows.forEach((r) => (summary[r.role] = r.count));
  return summary;
}

/* ============================================
 💹 REVENUE PAGE (Revenue.jsx)
============================================ */
async function getRevenueComparison() {
  console.log('💹 [Service] getRevenueComparison()');
  return await dao.getRevenueComparison();
}

async function getTopRevenueShops() {
  console.log('🏪 [Service] getTopRevenueShops()');
  return await dao.getTopRevenueShops();
}

async function getTopRevenueShippers() {
  console.log('🚚 [Service] getTopRevenueShippers()');
  return await dao.getTopRevenueShippers();
}

/* ============================================
 ✅ EXPORT
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
