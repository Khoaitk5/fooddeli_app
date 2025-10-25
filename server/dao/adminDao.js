const pool = require('../config/db.js');

/* ============================================
 🏪 SHOP DAO
============================================ */
async function getAllShops() {
  const sql = `
    SELECT sp.id, sp.shop_name, u.username, u.status, sp.status AS shop_status,
           COUNT(p.product_id) AS total_products
    FROM shop_profiles sp
    JOIN users u ON u.id = sp.user_id
    LEFT JOIN products p ON p.shop_id = sp.id
    GROUP BY sp.id, u.username, u.status
    ORDER BY sp.created_at DESC;
  `;
  const { rows } = await pool.query(sql);
  return rows;
}

async function updateShopStatus(id, status) {
  await pool.query(`UPDATE shop_profiles SET status = $1 WHERE id = $2`, [status, id]);
}

/* ============================================
 🚚 SHIPPER DAO
============================================ */
async function getAllShippers() {
  const sql = `
    SELECT s.id, u.username, s.vehicle_type, s.status, s.online_status
    FROM shipper_profiles s
    JOIN users u ON u.id = s.user_id
    ORDER BY s.created_at DESC;
  `;
  const { rows } = await pool.query(sql);
  return rows;
}

async function updateShipperStatus(id, status) {
  await pool.query(`UPDATE shipper_profiles SET status = $1 WHERE id = $2`, [status, id]);
}

/* ============================================
 👤 CUSTOMER DAO
============================================ */
async function getAllCustomers() {
  const { rows } = await pool.query(`
    SELECT id, username, email, phone, status, rating, created_at
    FROM users
    WHERE role = 'user'
    ORDER BY created_at DESC;
  `);
  return rows;
}

async function getCustomerById(id) {
  const { rows } = await pool.query(
    `SELECT id, username, email, phone, status, rating, created_at
     FROM users WHERE id = $1 AND role = 'user'`,
    [id]
  );
  return rows[0];
}

// ⚙️ Dùng chung cho ban / unban / block
async function updateUserStatus(id, status) {
  console.log(`🧩 [DAO] updateUserStatus(${id}, ${status})`);
  await pool.query(`UPDATE users SET status = $1 WHERE id = $2`, [status, id]);
}

async function getCustomerRevenueStats() {
  const { rows } = await pool.query(`
    SELECT 
      u.id,
      u.username,
      u.email,
      u.phone,
      COUNT(o.id)::int AS total_orders,
      COALESCE(SUM(o.total_price), 0)::numeric AS total_spent
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'completed'
    WHERE u.role = 'user'
    GROUP BY u.id, u.username, u.email, u.phone
    ORDER BY total_spent DESC;
  `);
  return rows;
}

/* ============================================
 📊 DASHBOARD STATS
============================================ */
async function getOverviewStats() {
  const [orders] = (
    await pool.query(`
      SELECT COUNT(*)::int AS total_orders,
             COALESCE(SUM(total_price), 0)::numeric AS total_revenue
      FROM orders WHERE status = 'completed';
    `)
  ).rows;

  const [shops] = (await pool.query(`SELECT COUNT(*)::int AS total_shops FROM shop_profiles`)).rows;
  const [shippers] = (await pool.query(`SELECT COUNT(*)::int AS total_shippers FROM shipper_profiles`)).rows;
  const [users] = (await pool.query(`SELECT COUNT(*)::int AS total_customers FROM users WHERE role='user'`)).rows;

  return { ...orders, ...shops, ...shippers, ...users };
}

/* ============================================
 📊 CHARTS: Monthly, Weekly, Users
============================================ */
async function getMonthlyRevenue() {
  const { rows } = await pool.query(`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
      COALESCE(SUM(total_price), 0)::numeric AS revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at);
  `);
  return rows;
}

async function getWeeklyOrders() {
  const { rows } = await pool.query(`
    SELECT 
      TO_CHAR(DATE_TRUNC('day', created_at), 'DD/MM') AS day,
      COUNT(*)::int AS orders
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY DATE_TRUNC('day', created_at);
  `);
  return rows;
}

async function getUserDistribution() {
  const { rows } = await pool.query(`
    SELECT role, COUNT(*)::int AS count
    FROM users
    GROUP BY role;
  `);
  return rows;
}

/* ============================================
 💹 REVENUE PAGE DAO
============================================ */
async function getRevenueComparison() {
  const { rows } = await pool.query(`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
      SUM(CASE WHEN shop_id IS NOT NULL THEN total_price ELSE 0 END)::numeric AS shop_revenue,
      SUM(CASE WHEN shipper_id IS NOT NULL THEN delivery_fee ELSE 0 END)::numeric AS shipper_revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at);
  `);
  return rows;
}

async function getTopRevenueShops() {
  const { rows } = await pool.query(`
    SELECT 
      sp.shop_name,
      SUM(o.total_price)::numeric AS revenue
    FROM orders o
    JOIN shop_profiles sp ON sp.id = o.shop_id
    WHERE o.status = 'completed'
    GROUP BY sp.shop_name
    ORDER BY revenue DESC
    LIMIT 10;
  `);
  return rows;
}

async function getTopRevenueShippers() {
  const { rows } = await pool.query(`
    SELECT 
      u.username,
      SUM(o.delivery_fee)::numeric AS total_fee
    FROM orders o
    JOIN shipper_profiles s ON s.id = o.shipper_id
    JOIN users u ON u.id = s.user_id
    WHERE o.status = 'completed'
    GROUP BY u.username
    ORDER BY total_fee DESC
    LIMIT 10;
  `);
  return rows;
}

/* ============================================
 ✅ EXPORT
============================================ */
module.exports = {
  // 🏪 SHOP
  getAllShops,
  updateShopStatus,

  // 🚚 SHIPPER
  getAllShippers,
  updateShipperStatus,

  // 👤 CUSTOMER
  getAllCustomers,
  getCustomerById,
  updateUserStatus,
  getCustomerRevenueStats,

  // 📊 DASHBOARD
  getOverviewStats,
  getMonthlyRevenue,
  getWeeklyOrders,
  getUserDistribution,

  // 💹 REVENUE PAGE
  getRevenueComparison,
  getTopRevenueShops,
  getTopRevenueShippers,
};
