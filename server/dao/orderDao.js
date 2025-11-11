// dao/orderDao.js
const GenericDao = require("./generic_dao");
const Order = require("../models/order");
const pool = require("../config/db");

class OrderDao extends GenericDao {
  constructor() {
    super("orders", Order);
  }

  /** -------------------- LẤY DỮ LIỆU -------------------- **/
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

  async getOrderFullById(orderId) {
    const orderRes = await pool.query(
      `
      SELECT
        o.*,
        u.full_name  AS user_full_name,
        u.phone      AS user_phone,
        sp.shop_name AS shop_name
      FROM orders o
      JOIN users u          ON u.id = o.user_id
      JOIN shop_profiles sp ON sp.id = o.shop_id
      WHERE o.order_id = $1
      LIMIT 1;
      `,
      [orderId]
    );
    if (!orderRes.rows[0]) return null;

    const detailsRes = await pool.query(
      `
      SELECT
        od.*,
        p.name      AS product_name,
        p.image_url AS product_image,
        p.price     AS product_price
      FROM order_details od
      JOIN products p ON p.product_id = od.product_id
      WHERE od.order_id = $1
      ORDER BY od.created_at ASC;
      `,
      [orderId]
    );

    return { order: orderRes.rows[0], details: detailsRes.rows };
  }

  async getFullOrdersByShipperId(shipperId, { status, limit = 20, offset = 0 } = {}) {
    const baseParams = [shipperId];
    let idSql = `
      SELECT o.order_id
      FROM orders o
      WHERE o.shipper_id = $1
    `;
    if (status) {
      baseParams.push(status);
      idSql += ` AND o.status = $${baseParams.length}`;
    }
    baseParams.push(limit, offset);
    idSql += ` ORDER BY o.created_at DESC LIMIT $${baseParams.length - 1} OFFSET $${baseParams.length};`;

    const idsRes = await pool.query(idSql, baseParams);
    const ids = idsRes.rows.map((r) => r.order_id);
    if (ids.length === 0) return [];

    const ordersRes = await pool.query(
      `
      SELECT
        o.*,
        u.full_name  AS user_full_name,
        u.phone      AS user_phone,
        sp.shop_name AS shop_name
      FROM orders o
      JOIN users u          ON u.id = o.user_id
      JOIN shop_profiles sp ON sp.id = o.shop_id
      WHERE o.order_id = ANY($1::int[])
      ORDER BY o.created_at DESC;
      `,
      [ids]
    );

    const detailsRes = await pool.query(
      `
      SELECT
        od.*,
        p.name      AS product_name,
        p.image_url AS product_image,
        p.price     AS product_price
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

    return ordersRes.rows.map((or) => ({
      order: or,
      details: detailMap.get(or.order_id) || [],
    }));
  }

  /** -------------------- CẬP NHẬT TRẠNG THÁI -------------------- **/
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

  /** -------------------- HỖ TRỢ CHO SHIPPER & SHOP -------------------- **/
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

  async assignShipperIfCooking({ orderId, shipperId }) {
    const result = await pool.query(
      `
      UPDATE orders
      SET shipper_id = $1, updated_at = NOW()
      WHERE order_id = $2
        AND status = 'cooking'
        AND shipper_id IS NULL;
      `,
      [shipperId, orderId]
    );
    return result.rowCount > 0;
  }

  async updateStatusToShipping({ orderId, shipperId }) {
    const sql = `
      UPDATE orders
      SET status='shipping', updated_at=NOW()
      WHERE order_id=$1
        AND shipper_id=$2
        AND status='cooking';
    `;
    const r = await pool.query(sql, [orderId, shipperId]);
    return r.rowCount > 0;
  }

  async completeIfOwnedByShipper({ orderId, shipperId }) {
    const sql = `
      UPDATE orders
      SET status='completed', updated_at=NOW()
      WHERE order_id=$1
        AND shipper_id=$2
        AND status IN ('shipping')
      RETURNING *;
    `;
    const r = await pool.query(sql, [orderId, shipperId]);
    return r.rows[0] || null;
  }

async recalcTotals(orderId) {
  console.log("🧮 [DAO] recalcTotals() bắt đầu với orderId:", orderId);

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
  console.log("✅ [DAO] recalcTotals() KẾT QUẢ:", res.rows[0]);
  return res.rows[0] || null;
}

}

module.exports = new OrderDao();
