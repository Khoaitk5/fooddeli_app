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
  console.log('🧩 [DAO] getAllShops()');
  const { rows } = await pool.query(sql);
  return rows;
}

async function updateShopStatus(id, status) {
  console.log(`🧩 [DAO] updateShopStatus(${id}, ${status})`);
  const result = await pool.query(
    `UPDATE shop_profiles SET status = $1 WHERE id = $2 RETURNING id, status`,
    [status, id]
  );
  console.log('✅ [DAO] Shop updated:', result.rows[0]);
  return result.rows[0];
}

/* ============================================
 🚚 SHIPPER DAO
============================================ */
async function getAllShippers() {
  console.log('🧩 [DAO] getAllShippers()');
  const sql = `
    SELECT
      s.id,
      s.user_id,
      u.username,
      u.email,
      u.phone,
      s.vehicle_type,
      s.status,
      s.online_status
    FROM shipper_profiles s
    JOIN users u ON u.id = s.user_id
    ORDER BY s.created_at DESC;
  `;
  const { rows } = await pool.query(sql);
  return rows;
}

async function updateShipperStatus(id, status) {
  console.log(`🧩 [DAO] updateShipperStatus(${id}, ${status})`);
  const result = await pool.query(
    `UPDATE shipper_profiles SET status = $1 WHERE id = $2 RETURNING id, status`,
    [status, id]
  );
  console.log('✅ [DAO] Shipper updated:', result.rows[0]);
  return result.rows[0];
}

/* ============================================
 👤 CUSTOMER DAO
============================================ */
async function getAllCustomers() {
  console.log('🧩 [DAO] getAllCustomers()');
  const { rows } = await pool.query(`
    SELECT id, username, email, phone, status, rating, created_at
    FROM users
    WHERE role = 'user'
    ORDER BY created_at DESC;
  `);
  return rows;
}

async function getCustomerById(id) {
  console.log(`🧩 [DAO] getCustomerById(${id})`);
  const { rows } = await pool.query(
    `SELECT id, username, email, phone, status, rating, created_at
     FROM users WHERE id = $1 AND role = 'user'`,
    [id]
  );
  return rows[0];
}

async function updateUserStatus(id, status) {
  console.log(`🧩 [DAO] updateUserStatus(${id}, ${status})`);
  const result = await pool.query(
    `UPDATE users SET status = $1 WHERE id = $2 RETURNING id, status`,
    [status, id]
  );
  console.log('✅ [DAO] User updated:', result.rows[0]);
  return result.rows[0];
}

async function getCustomerRevenueStats() {
  console.log('🧩 [DAO] getCustomerRevenueStats()');
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
  console.log('🧩 [DAO] getOverviewStats()');
  const [orders] = (
    await pool.query(`
      SELECT COUNT(*)::int AS total_orders,
             COALESCE(SUM(total_price), 0)::numeric AS total_revenue
      FROM orders WHERE status = 'completed';
    `)
  ).rows;

  const [shops] = (
    await pool.query(`SELECT COUNT(*)::int AS total_shops FROM shop_profiles`)
  ).rows;

  const [shippers] = (
    await pool.query(`SELECT COUNT(*)::int AS total_shippers FROM shipper_profiles`)
  ).rows;

  const [users] = (
    await pool.query(`SELECT COUNT(*)::int AS total_customers FROM users WHERE role='user'`)
  ).rows;

  return { ...orders, ...shops, ...shippers, ...users };
}

/* ============================================
 📊 CHARTS
============================================ */
async function getMonthlyRevenue(months = 6, year = new Date().getFullYear()) {
  console.log(`🧩 [DAO] getMonthlyRevenue(${months}, ${year}) → Lấy ${months} tháng gần nhất của năm ${year}`);

  const query = `
    WITH filtered_orders AS (
      SELECT 
        DATE_TRUNC('month', created_at) AS month_date,
        SUM(total_price) AS revenue
      FROM orders
      WHERE status = 'completed'
        AND EXTRACT(YEAR FROM created_at)::INT = $2::INT
        AND EXTRACT(MONTH FROM created_at)::INT BETWEEN
            GREATEST(EXTRACT(MONTH FROM NOW())::INT - ($1 - 1), 1)
            AND EXTRACT(MONTH FROM NOW())::INT
      GROUP BY DATE_TRUNC('month', created_at)
    )
    SELECT 
      TO_CHAR(month_date, 'Mon YYYY') AS month,
      COALESCE(revenue, 0)::numeric AS revenue
    FROM filtered_orders
    ORDER BY month_date ASC;
  `;

  const { rows } = await pool.query(query, [months, year]);
  console.log("✅ Dữ liệu doanh thu trả về:", rows);
  return rows;
}

async function getWeeklyOrders() {
  console.log('🧩 [DAO] getWeeklyOrders()');
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
  console.log('🧩 [DAO] getUserDistribution()');
  const { rows } = await pool.query(`
    SELECT role, COUNT(*)::int AS count
    FROM users
    GROUP BY role;
  `);
  return rows;
}

/* ============================================
 💹 REVENUE PAGE DAO (CÓ LỌC NĂM)
============================================ */
async function getRevenueComparison(year = new Date().getFullYear()) {
  console.log(`🧩 [DAO] getRevenueComparison(${year})`);
  const { rows } = await pool.query(`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', o.created_at), 'Mon YYYY') AS month,
      SUM(o.food_price * o.merchant_commission_rate)::numeric AS shop_revenue,
      SUM(o.delivery_fee * o.shipper_commission_rate)::numeric AS shipper_revenue
    FROM orders o
    WHERE o.status = 'completed'
      AND EXTRACT(YEAR FROM o.created_at)::INT = $1
    GROUP BY DATE_TRUNC('month', o.created_at)
    ORDER BY DATE_TRUNC('month', o.created_at);
  `, [year]);
  return rows;
}

async function getTopRevenueShops(year = new Date().getFullYear()) {
  console.log(`🧩 [DAO] getTopRevenueShops(${year})`);
  const { rows } = await pool.query(`
    SELECT 
      sp.shop_name,
      SUM(o.total_price)::numeric AS revenue
    FROM orders o
    JOIN shop_profiles sp ON sp.id = o.shop_id
    WHERE o.status = 'completed'
      AND EXTRACT(YEAR FROM o.created_at)::INT = $1
    GROUP BY sp.shop_name
    ORDER BY revenue DESC
    LIMIT 10;
  `, [year]);
  return rows;
}

async function getTopRevenueShippers(year = new Date().getFullYear()) {
  console.log(`🧩 [DAO] getTopRevenueShippers(${year})`);
  const { rows } = await pool.query(`
    SELECT 
      u.username,
      SUM(o.delivery_fee * (1 - o.shipper_commission_rate))::numeric AS total_fee
    FROM orders o
    JOIN shipper_profiles s ON s.id = o.shipper_id
    JOIN users u ON u.id = s.user_id
    WHERE o.status = 'completed'
      AND EXTRACT(YEAR FROM o.created_at)::INT = $1
    GROUP BY u.username
    ORDER BY total_fee DESC
    LIMIT 10;
  `, [year]);
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
