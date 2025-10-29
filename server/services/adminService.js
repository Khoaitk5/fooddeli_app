const dao = require("../dao/adminDao.js");

/* ============================================
 🏪 SHOP SERVICES
============================================ */
async function listShops() {
  console.log("📦 [Service] listShops()");
  return await dao.getAllShops();
}

async function approveShop(id) {
  console.log(`🟢 [Service] approveShop(${id})`);
  return await dao.updateShopStatus(id, "open");
}

async function suspendShop(id) {
  console.log(`🔴 [Service] suspendShop(${id})`);
  return await dao.updateShopStatus(id, "closed");
}

/* ============================================
 🚚 SHIPPER SERVICES
============================================ */
async function listShippers() {
  console.log("🚚 [Service] listShippers()");
  return await dao.getAllShippers();
}

async function verifyShipper(id) {
  console.log(`🟢 [Service] verifyShipper(${id})`);
  return await dao.updateShipperStatus(id, "approved");
}

async function suspendShipper(id) {
  console.log(`🔴 [Service] suspendShipper(${id})`);
  return await dao.updateShipperStatus(id, "rejected");
}

/* ============================================
 👤 CUSTOMER SERVICES
============================================ */
async function listCustomers() {
  console.log("👥 [Service] listCustomers()");
  return await dao.getAllCustomers();
}

async function getCustomerById(id) {
  console.log(`🔍 [Service] getCustomerById(${id})`);
  return await dao.getCustomerById(id);
}

async function banCustomer(id) {
  console.log(`🚫 [Service] banCustomer(${id})`);
  return await dao.updateUserStatus(id, "banned");
}

async function unbanCustomer(id) {
  console.log(`🔓 [Service] unbanCustomer(${id})`);
  return await dao.updateUserStatus(id, "active");
}

async function getCustomerRevenueStats() {
  console.log("📊 [Service] getCustomerRevenueStats()");
  return await dao.getCustomerRevenueStats();
}

/* ============================================
 📊 DASHBOARD STATS
============================================ */
async function getStats() {
  console.log("📈 [Service] getStats()");
  return await dao.getOverviewStats();
}

/* ============================================
 💰 SETTLEMENT SERVICES
============================================ */
async function doSettlement() {
  console.log("💰 [Service] doSettlement()");

  const orders = await dao.getPendingOrders?.();
  if (!orders || !orders.length) {
    console.warn("⚠️ [Service] No pending orders found");
    return 0;
  }

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

  console.log(`✅ [Service] Settled ${orders.length} orders`);
  return orders.length;
}

/* ============================================
 📊 DASHBOARD CHARTS (Dashboard.jsx)
============================================ */
async function getMonthlyRevenue(months = 6, year = new Date().getFullYear()) {
  console.log(`📊 [Service] getMonthlyRevenue(${months}, ${year})`);
  return await dao.getMonthlyRevenue(months, year);
}


async function getWeeklyOrders() {
  console.log("📅 [Service] getWeeklyOrders()");
  return await dao.getWeeklyOrders();
}

async function getUserDistribution() {
  console.log("🧩 [Service] getUserDistribution()");
  const rows = await dao.getUserDistribution();
  const summary = {};
  rows.forEach((r) => (summary[r.role] = r.count));
  return summary;
}

/* ============================================
 💹 REVENUE PAGE (Revenue.jsx)
============================================ */
async function getRevenueComparison() {
  console.log("💹 [Service] getRevenueComparison()");
  return await dao.getRevenueComparison();
}

async function getTopRevenueShops() {
  console.log("🏪 [Service] getTopRevenueShops()");
  return await dao.getTopRevenueShops();
}

async function getTopRevenueShippers() {
  console.log("🚚 [Service] getTopRevenueShippers()");
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
