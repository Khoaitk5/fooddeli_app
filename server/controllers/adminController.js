const service = require("../services/adminService.js");

// =============================
// 🏪 SHOP
// =============================
async function getShops(req, res, next) {
  try {
    console.log("📦 [Controller] GET /api/admin/shops");
    const data = await service.listShops();
    res.json(data);
  } catch (err) {
    console.error("❌ getShops error:", err);
    next(err);
  }
}

async function approveShop(req, res, next) {
  try {
    console.log(`🟢 [Controller] Approving shop ID: ${req.params.id}`);
    await service.approveShop(req.params.id);
    res.json({ message: "Shop approved" });
  } catch (err) {
    console.error("❌ approveShop error:", err);
    next(err);
  }
}

async function suspendShop(req, res, next) {
  try {
    console.log(`🔴 [Controller] Suspending shop ID: ${req.params.id}`);
    await service.suspendShop(req.params.id);
    res.json({ message: "Shop suspended" });
  } catch (err) {
    console.error("❌ suspendShop error:", err);
    next(err);
  }
}

// =============================
// 🚚 SHIPPER
// =============================
async function getShippers(req, res, next) {
  try {
    console.log("📦 [Controller] GET /api/admin/shippers");
    const data = await service.listShippers();
    console.log(`✅ [Controller] Lấy ${data.length} shipper thành công`);
    res.json(data);
  } catch (err) {
    console.error("❌ getShippers error:", err);
    next(err);
  }
}

async function verifyShipper(req, res, next) {
  try {
    const { id } = req.params;
    console.log(`🟢 [Controller] VERIFY shipper ID: ${id}`);
    await service.verifyShipper(id);
    res.json({ message: "Shipper verified" });
  } catch (err) {
    console.error("❌ verifyShipper error:", err);
    next(err);
  }
}

async function suspendShipper(req, res, next) {
  try {
    const { id } = req.params;
    console.log(`🔴 [Controller] SUSPEND shipper ID: ${id}`);
    await service.suspendShipper(id);
    res.json({ message: "Shipper suspended" });
  } catch (err) {
    console.error("❌ suspendShipper error:", err);
    next(err);
  }
}

// =============================
// 👤 CUSTOMER
// =============================
async function getCustomers(req, res, next) {
  try {
    console.log("📦 [Controller] GET /api/admin/customers");
    const data = await service.listCustomers();
    res.json(data);
  } catch (err) {
    console.error("❌ getCustomers error:", err);
    next(err);
  }
}

async function getCustomerById(req, res, next) {
  try {
    const { id } = req.params;
    console.log(`📦 [Controller] GET /api/admin/customers/${id}`);
    const customer = await service.getCustomerById(id);
    res.json(customer);
  } catch (err) {
    console.error("❌ getCustomerById error:", err);
    next(err);
  }
}

async function banCustomer(req, res, next) {
  try {
    const { id } = req.params;
    console.log(`🔒 [Controller] BAN customer ID: ${id}`);
    await service.banCustomer(id);
    res.json({ message: "Customer banned" });
  } catch (err) {
    console.error("❌ banCustomer error:", err);
    next(err);
  }
}

async function unbanCustomer(req, res, next) {
  try {
    const { id } = req.params;
    console.log(`🔓 [Controller] UNBAN customer ID: ${id}`);
    await service.unbanCustomer(id);
    res.json({ message: "Customer unbanned" });
  } catch (err) {
    console.error("❌ unbanCustomer error:", err);
    next(err);
  }
}

async function getCustomerRevenueStats(req, res, next) {
  try {
    console.log("📊 [Controller] GET /api/admin/customers/stats/revenue");
    const stats = await service.getCustomerRevenueStats();
    res.json({ items: stats });
  } catch (err) {
    console.error("❌ getCustomerRevenueStats error:", err);
    next(err);
  }
}

// =============================
// 📊 DASHBOARD STATS
// =============================
async function getOverview(req, res, next) {
  try {
    const data = await service.getStats();
    res.json(data);
  } catch (err) {
    console.error("❌ getOverview error:", err);
    next(err);
  }
}
async function getDashboardMonthlyRevenue(req, res, next) {
  try {
    // ✅ Lấy tham số months từ query, mặc định = 6
    const months = parseInt(req.query.months) || 6;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    console.log(
      `📊 [Controller] GET /api/admin/stats/dashboard/monthly?months=${months}&year=${year}`
    );

    const data = await service.getMonthlyRevenue(months, year);

    res.json({ items: data });
  } catch (err) {
    console.error("❌ getDashboardMonthlyRevenue error:", err);
    next(err);
  }
}

async function getWeeklyOrders(req, res, next) {
  try {
    const data = await service.getWeeklyOrders();
    res.json({ items: data });
  } catch (err) {
    console.error("❌ getWeeklyOrders error:", err);
    next(err);
  }
}

async function getUserDistribution(req, res, next) {
  try {
    const summary = await service.getUserDistribution();
    res.json({ summary });
  } catch (err) {
    console.error("❌ getUserDistribution error:", err);
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
    console.error("❌ settleOrders error:", err);
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
    console.error("❌ getRevenueComparison error:", err);
    next(err);
  }
}

async function getTopRevenueShops(req, res, next) {
  try {
    const data = await service.getTopRevenueShops();
    res.json({ items: data });
  } catch (err) {
    console.error("❌ getTopRevenueShops error:", err);
    next(err);
  }
}

async function getTopRevenueShippers(req, res, next) {
  try {
    const data = await service.getTopRevenueShippers();
    res.json({ items: data });
  } catch (err) {
    console.error("❌ getTopRevenueShippers error:", err);
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
  suspendShipper,

  // CUSTOMER
  getCustomers,
  getCustomerById,
  banCustomer,
  unbanCustomer,
  getCustomerRevenueStats,

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
