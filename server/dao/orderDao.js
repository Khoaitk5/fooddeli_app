const GenericDao = require("./generic_dao");
const Order = require("../models/order");
const pool = require("../config/db");

class OrderDao extends GenericDao {
  constructor() {
    super("orders", Order);
  }

  /**
   * Lấy 1 "full order" (order + user + shop + details + products) để FE render đầy đủ
   * @param {number} orderId
   */
  async getOrderFullById(orderId) {
    const sql = `
      SELECT
        o.*,

        -- 👤 Người đặt hàng
        u.full_name        AS user_full_name,
        u.phone            AS user_phone,

        -- 🏪 Thông tin quán
        sp.shop_name,
        su.avatar_url      AS shop_image,  -- ✅ ảnh từ user của shop
        COALESCE(
          a.address_line->>'line',
          a.address_line->>'address',
          a.address_line::text
        )                  AS shop_address,

        -- 🚚 Thông tin shipper
        sh.id              AS shipper_profile_id,
        sh.vehicle_type    AS shipper_vehicle,
        uu.full_name       AS shipper_name,
        uu.phone           AS shipper_phone,
        uu.avatar_url      AS shipper_avatar

      FROM orders o
      JOIN users u               ON u.id = o.user_id
      JOIN shop_profiles sp      ON sp.id = o.shop_id
      LEFT JOIN users su         ON su.id = sp.user_id   -- ✅ chủ shop (có avatar_url)
      LEFT JOIN addresses a      ON a.address_id = sp.shop_address_id
      LEFT JOIN shipper_profiles sh ON sh.id = o.shipper_id
      LEFT JOIN users uu         ON uu.id = sh.user_id
      WHERE o.order_id = $1
      LIMIT 1;
    `;

    const orderRes = await pool.query(sql, [orderId]);
    if (!orderRes.rows[0]) return null;

    const detailsRes = await pool.query(
      `
      SELECT
        od.*,
        p.name       AS product_name,
        p.image_url  AS product_image,
        p.price      AS product_price
      FROM order_details od
      JOIN products p ON p.product_id = od.product_id
      WHERE od.order_id = $1
      ORDER BY od.created_at ASC;
      `,
      [orderId]
    );

    return { order: orderRes.rows[0], details: detailsRes.rows };
  }

  /** ============================================================
   * 🚚 LẤY DANH SÁCH ĐƠN THEO SHIPPER_ID
   * ============================================================ */
  async getOrdersByShipperId(shipperId, { status, limit = 20, offset = 0 } = {}) {
    const params = [shipperId];
    let sql = `
      SELECT *
      FROM orders
      WHERE shipper_id = $1
    `;
    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }
    params.push(limit, offset);
    sql += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length};`;

    const res = await pool.query(sql, params);
    return res.rows.map((r) => new this.Model(r));
  }

  /** ============================================================
   * 👤 LẤY DANH SÁCH ĐƠN THEO USER_ID (FULL THÔNG TIN)
   * ============================================================ */
  async getFullOrdersByUserId(userId, { status, limit = 20, offset = 0 } = {}) {
    const baseParams = [userId];
    let idSql = `
      SELECT o.order_id
      FROM orders o
      WHERE o.user_id = $1
    `;
    if (status) {
      baseParams.push(status);
      idSql += ` AND o.status = $${baseParams.length}`;
    }
    baseParams.push(limit, offset);
    idSql += ` ORDER BY o.created_at DESC LIMIT $${baseParams.length - 1} OFFSET $${baseParams.length};`;

    const idsRes = await pool.query(idSql, baseParams);
    const ids = idsRes.rows.map(r => r.order_id);
    if (ids.length === 0) return [];

    const ordersRes = await pool.query(
      `
      SELECT
        o.*,
        sp.shop_name,
        su.avatar_url        AS shop_image,  -- ✅ ảnh của chủ shop (từ users)
        COALESCE(
          a.address_line->>'line',
          a.address_line->>'address',
          a.address_line::text
        )                    AS shop_address,
        uu.full_name         AS shipper_name,
        uu.phone             AS shipper_phone,
        uu.avatar_url        AS shipper_avatar,
        sh.vehicle_type      AS shipper_vehicle
      FROM orders o
      JOIN shop_profiles sp      ON sp.id = o.shop_id
      LEFT JOIN users su         ON su.id = sp.user_id   -- ✅ liên kết user của shop
      LEFT JOIN addresses a      ON a.address_id = sp.shop_address_id
      LEFT JOIN shipper_profiles sh ON sh.id = o.shipper_id
      LEFT JOIN users uu         ON uu.id = sh.user_id
      WHERE o.order_id = ANY($1::int[])
      ORDER BY o.created_at DESC;
      `,
      [ids]
    );

    const detailsRes = await pool.query(
      `
      SELECT
        od.*,
        p.name       AS product_name,
        p.image_url  AS product_image,
        p.price      AS product_price
      FROM order_details od
      JOIN products p ON p.product_id = od.product_id
      WHERE od.order_id = ANY($1::int[])
      ORDER BY od.created_at ASC;
      `,
      [ids]
    );

    const detailMap = new Map();
    for (const row of detailsRes.rows) {
      if (!detailMap.has(row.order_id)) detailMap.set(row.order_id, []);
      detailMap.get(row.order_id).push(row);
    }

    return ordersRes.rows.map(or => ({
      order: or,
      details: detailMap.get(or.order_id) || [],
    }));
  }

  /** ============================================================
   * 🔄 CẬP NHẬT / HỖ TRỢ TRẠNG THÁI
   * ============================================================ */
  async assignShipper(orderId, shipperId) {
    const res = await pool.query(
      `
      UPDATE orders
      SET shipper_id = $1,
          updated_at = NOW()
      WHERE order_id = $2
      RETURNING *;
      `,
      [shipperId, orderId]
    );
    return res.rows[0] ? new this.Model(res.rows[0]) : null;
  }

  async updateStatus(orderId, status) {
    const allowed = ["pending", "cooking", "shipping", "completed", "cancelled"];
    if (!allowed.includes(status)) throw new Error(`Invalid status: ${status}`);

    const res = await pool.query(
      `
      UPDATE orders
      SET status = $1,
          updated_at = NOW()
      WHERE order_id = $2
      RETURNING *;
      `,
      [status, orderId]
    );
    return res.rows[0] ? new this.Model(res.rows[0]) : null;
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    const allowed = ["unpaid", "paid", "refunded"];
    if (!allowed.includes(paymentStatus)) throw new Error(`Invalid payment status: ${paymentStatus}`);

    const res = await pool.query(
      `
      UPDATE orders
      SET payment_status = $1,
          updated_at = NOW()
      WHERE order_id = $2
      RETURNING *;
      `,
      [paymentStatus, orderId]
    );
    return res.rows[0] ? new this.Model(res.rows[0]) : null;
  }

  async markSettled(orderId) {
    const res = await pool.query(
      `
      UPDATE orders
      SET is_settled = TRUE,
          settled_at = NOW(),
          updated_at = NOW()
      WHERE order_id = $1
      RETURNING *;
      `,
      [orderId]
    );
    return res.rows[0] ? new this.Model(res.rows[0]) : null;
  }

  /**
   * Lấy danh sách orders theo shipper_id (có lọc trạng thái & phân trang)
   * @param {number} shipperId
   * @param {{status?: string, limit?: number, offset?: number}} options
   */
  async getOrdersByShipperId(
    shipperId,
    { status, limit = 20, offset = 0 } = {}
  ) {
    const params = [shipperId];
    let sql = `
      SELECT 
        o.*,
        u.full_name AS user_full_name,
        u.phone AS user_phone,
        sp.shop_name,
        sp.id AS shop_profile_id
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN shop_profiles sp ON sp.id = o.shop_id
      WHERE o.shipper_id = $1
    `;
    if (status) {
      params.push(status);
      sql += ` AND o.status = $${params.length}`;
    }
    params.push(limit, offset);
    sql += ` ORDER BY o.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length};`;

    const res = await pool.query(sql, params);
    return res.rows;
  }
  // Lấy tất cả order status='cooking' + join shop address (để lọc bằng JS)
  async listCookingWithShopAddress({ limit = 200, offset = 0 } = {}) {
    const sql = `
      SELECT
        o.*,
        sp.shop_name,
        a.address_id,
        (a.lat_lon->>'lat')::float AS shop_lat,
        (a.lat_lon->>'lon')::float AS shop_lon,
        a.address_line
      FROM orders o
      JOIN shop_profiles sp ON sp.id = o.shop_id
      JOIN addresses a ON a.address_id = sp.shop_address_id
      WHERE o.status = 'cooking'
      ORDER BY o.created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    const res = await pool.query(sql, [limit, offset]);
    return res.rows;
  }

  async hasShippingOfShipper(shipperId) {
    const sql = `
      SELECT 1
      FROM orders
      WHERE shipper_id = $1
        AND status IN ('cooking','shipping')
      LIMIT 1;
    `;
    const r = await pool.query(sql, [shipperId]);
    return !!r.rows[0];
  }

  /** ============================================================
   * 🏪 LẤY ĐƠN THEO SHOP_ID
   * ============================================================ */
  async listByShop(shopId, { status, limit = 20, offset = 0 } = {}) {
    const params = [shopId];
    let sql = `
      SELECT
        o.*,
        u.full_name  AS user_full_name,
        u.phone      AS user_phone,
        sp.shop_name AS shop_name
      FROM orders o
      JOIN users u          ON u.id = o.user_id
      JOIN shop_profiles sp ON sp.id = o.shop_id
      WHERE o.shop_id = $1
    `;
    if (status) {
      params.push(status);
      sql += ` AND o.status = $${params.length}`;
    }
    params.push(limit, offset);
    sql += ` ORDER BY o.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length};`;

    const res = await pool.query(sql, params);
    return res.rows.map((r) => ({ ...r }));
  }

  async getShopMonthlyRevenue(shopId, year = new Date().getFullYear()) {
    const query = `
      WITH months AS (
        SELECT generate_series(1, 12) AS month
      ),
      stats AS (
        SELECT
          EXTRACT(MONTH FROM created_at)::int AS month,
          SUM(total_price) AS revenue,
          COUNT(*)::int AS orders
        FROM orders
        WHERE shop_id = $1
          AND status = 'completed'
          AND EXTRACT(YEAR FROM created_at)::int = $2
        GROUP BY EXTRACT(MONTH FROM created_at)
      )
      SELECT
        m.month,
        COALESCE(s.revenue, 0)::numeric AS revenue,
        COALESCE(s.orders, 0)::int AS orders
      FROM months m
      LEFT JOIN stats s ON s.month = m.month
      ORDER BY m.month;
    `;

    const { rows } = await pool.query(query, [shopId, year]);
    return rows;
  }

  async getShopTodayStats(shopId) {
    const sql = `
      SELECT
        COUNT(*)::int AS total_orders,
        COALESCE(SUM(total_price), 0)::numeric AS total_revenue,
        COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_count,
        COUNT(*) FILTER (WHERE status = 'cooking')::int AS cooking_count,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_count,
        COUNT(*) FILTER (WHERE status = 'shipping')::int AS shipping_count,
        COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled_count
      FROM orders
      WHERE shop_id = $1
        AND created_at::date = CURRENT_DATE;
    `;

    const { rows } = await pool.query(sql, [shopId]);
    return rows[0] || null;
  }

  async getShopRecentOrders(shopId, limit = 5) {
    const sql = `
      SELECT
        o.order_id,
        o.status,
        o.total_price,
        o.created_at,
        u.full_name AS customer_name,
        u.phone AS customer_phone,
        COALESCE(
          STRING_AGG(p.name || ' x' || od.quantity, ', ' ORDER BY od.created_at),
          ''
        ) AS items_summary
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN order_details od ON od.order_id = o.order_id
      LEFT JOIN products p ON p.product_id = od.product_id
      WHERE o.shop_id = $1
      GROUP BY
        o.order_id,
        o.status,
        o.total_price,
        o.created_at,
        u.full_name,
        u.phone
      ORDER BY o.created_at DESC
      LIMIT $2;
    `;

    const { rows } = await pool.query(sql, [shopId, limit]);
    return rows;
  }

  async recalcTotals(orderId) {
    const sql = `
      WITH food_sum AS (
        SELECT COALESCE(SUM(line_total), 0) AS total
        FROM order_details
        WHERE order_id = $1
      )
      UPDATE orders
      SET
        food_price = fs.total,
        total_price = fs.total + delivery_fee,
        merchant_earn = fs.total * (1 - merchant_commission_rate),
        shipper_earn  = delivery_fee * (1 - shipper_commission_rate),
        admin_earn    = (fs.total * merchant_commission_rate)
                      + (delivery_fee * shipper_commission_rate),
        updated_at = NOW()
      FROM food_sum fs
      WHERE orders.order_id = $1
      RETURNING *;
    `;

    const res = await pool.query(sql, [orderId]);
    return res.rows[0] || null;
  }

  async listByUser(userId, { status, limit = 20, offset = 0 } = {}) {
    const params = [userId];
    let sql = `
      SELECT *
      FROM orders
      WHERE user_id = $1
    `;
    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }
    params.push(limit, offset);
    sql += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length};`;

    const res = await pool.query(sql, params);
    return res.rows.map(r => new this.Model(r));
  }

  async getStatusOnly(orderId) {
    const res = await pool.query(
      `SELECT order_id, status, updated_at FROM orders WHERE order_id = $1 LIMIT 1`,
      [orderId]
    );
    return res.rows[0] || null;
  }

  /**
   * Đếm số đơn hàng của một user
   * @param {number} userId - ID người dùng
   * @returns {Promise<number>} - Số đơn hàng
   */
  async countOrdersByUserId(userId) {
    const query = `SELECT COUNT(*) as count FROM orders WHERE user_id = $1`;
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count) || 0;
  }
}

module.exports = new OrderDao();
