const orderDao = require("../dao/orderDao");
const productDao = require("../dao/productDao");
const videoDao = require("../dao/videoDao");

async function getDashboard(shopId) {
  const sid = Number(shopId);
  if (!sid) {
    throw new Error("shopId is required");
  }

  const year = new Date().getFullYear();

  const [monthly, todayStats, recentOrders, products, videos] = await Promise.all([
    orderDao.getShopMonthlyRevenue(sid, year),
    orderDao.getShopTodayStats(sid),
    orderDao.getShopRecentOrders(sid, 5),
    productDao.getProductsByShop(sid),
    videoDao.getVideosByShop(sid),
  ]);

  const monthlyNormalized = (monthly || []).map((row) => ({
    month: row.month,
    revenue: Number(row.revenue) || 0,
    orders: row.orders || 0,
  }));

  const today = todayStats || {};
  const todayNormalized = {
    totalOrders: today.total_orders || 0,
    revenue: Number(today.total_revenue || 0),
    statusCounts: {
      completed: today.completed_count || 0,
      cooking: today.cooking_count || 0,
      pending: today.pending_count || 0,
      shipping: today.shipping_count || 0,
      cancelled: today.cancelled_count || 0,
    },
  };

  const recentNormalized = (recentOrders || []).map((row) => ({
    id: row.order_id,
    status: row.status,
    total: Number(row.total_price || 0),
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    itemsSummary: row.items_summary || "",
    createdAt: row.created_at,
  }));

  return {
    totalProducts: (products || []).length,
    totalVideos: (videos || []).length,
    monthly: monthlyNormalized,
    today: todayNormalized,
    recentOrders: recentNormalized,
  };
}

module.exports = {
  getDashboard,
};
