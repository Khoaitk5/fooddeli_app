const service = require('../services/adminService.js');

// =============================
// 🏪 SHOP
// =============================
async function getShops(req, res, next) {
  try {
    res.json(await service.listShops());
  } catch (err) {
    next(err);
  }
}

async function approveShop(req, res, next) {
  try {
    await service.approveShop(req.params.id);
    res.json({ message: 'Shop approved' });
  } catch (err) {
    next(err);
  }
}

async function suspendShop(req, res, next) {
  try {
    await service.suspendShop(req.params.id);
    res.json({ message: 'Shop suspended' });
  } catch (err) {
    next(err);
  }
}

// =============================
// 🚚 SHIPPER
// =============================
async function getShippers(req, res, next) {
  try {
    res.json(await service.listShippers());
  } catch (err) {
    next(err);
  }
}

async function verifyShipper(req, res, next) {
  try {
    await service.verifyShipper(req.params.id);
    res.json({ message: 'Shipper verified' });
  } catch (err) {
    next(err);
  }
}

// =============================
// 👤 CUSTOMER
// =============================
async function getCustomers(req, res, next) {
  try {
    res.json(await service.listCustomers());
  } catch (err) {
    next(err);
  }
}

async function banCustomer(req, res, next) {
  try {
    await service.banCustomer(req.params.id);
    res.json({ message: 'Customer banned' });
  } catch (err) {
    next(err);
  }
}

// =============================
// 📊 DASHBOARD STATS
// =============================
async function getOverview(req, res, next) {
  try {
    res.json(await service.getStats());
  } catch (err) {
    next(err);
  }
}

async function getDashboardMonthlyRevenue(req, res, next) {
  try {
    const data = await service.getMonthlyRevenue();
    res.json({ items: data });
  } catch (err) {
    console.error('❌ getDashboardMonthlyRevenue error:', err);
    next(err);
  }
}

async function getWeeklyOrders(req, res, next) {
  try {
    const data = await service.getWeeklyOrders();
    res.json({ items: data });
  } catch (err) {
    console.error('❌ getWeeklyOrders error:', err);
    next(err);
  }
}

async function getUserDistribution(req, res, next) {
  try {
    const summary = await service.getUserDistribution();
    res.json({ summary });
  } catch (err) {
    console.error('❌ getUserDistribution error:', err);
    next(err);
  }
}

// =============================
// 💰 SETTLEMENT
// =============================
async function settleOrders(req, res, next) {
  try {
    const count = await service.doSettlement();
    res.json({ message: `Settled ${count} orders.` });
  } catch (err) {
    next(err);
  }
}

// =============================
// 💹 REVENUE PAGE (Revenue.jsx)
// =============================
async function getRevenueComparison(req, res, next) {
  try {
    const data = await service.getRevenueComparison();
    res.json({ items: data });
  } catch (err) {
    console.error('❌ getRevenueComparison error:', err);
    next(err);
  }
}

async function getTopRevenueShops(req, res, next) {
  try {
    const data = await service.getTopRevenueShops();
    res.json({ items: data });
  } catch (err) {
    console.error('❌ getTopRevenueShops error:', err);
    next(err);
  }
}

async function getTopRevenueShippers(req, res, next) {
  try {
    const data = await service.getTopRevenueShippers();
    res.json({ items: data });
  } catch (err) {
    console.error('❌ getTopRevenueShippers error:', err);
    next(err);
  }
}

// =============================
// EXPORT MODULES
// =============================
module.exports = {
  // SHOP
  getShops,
  approveShop,
  suspendShop,

  // SHIPPER
  getShippers,
  verifyShipper,

  // CUSTOMER
  getCustomers,
  banCustomer,

  // DASHBOARD
  getOverview,
  getDashboardMonthlyRevenue,
  getWeeklyOrders,
  getUserDistribution,

  // SETTLEMENT
  settleOrders,

  // REVENUE PAGE
  getRevenueComparison,
  getTopRevenueShops,
  getTopRevenueShippers,
};
