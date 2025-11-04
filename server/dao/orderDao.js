// dao/orderDao.js
const GenericDao = require("./generic_dao"); // GIỮ nguyên cách require theo project của bạn
const Order = require("../models/order");
const pool = require("../config/db");

class OrderDao extends GenericDao {
  constructor() {
    super("orders", Order);
  }

  /**
   * Lấy danh sách orders theo shipper_id
   * @param {number} shipperId
   * @param {object} options { status?: string, limit?: number, offset?: number }
   */
  async getOrdersByShipperId(
    shipperId,
    { status, limit = 20, offset = 0 } = {}
  ) {
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
    sql += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${
      params.length
    };`;

    const res = await pool.query(sql, params);
    return res.rows.map((r) => new this.Model(r));
  }

  /**
   * Lấy 1 "full order" (order + user + shop + details + products) để FE render đầy đủ
   * @param {number} orderId
   */
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

  /**
   * (Tuỳ nhu cầu) Lấy nhiều "full order" theo shipper_id có phân trang
   */
  async getFullOrdersByShipperId(
    shipperId,
    { status, limit = 20, offset = 0 } = {}
  ) {
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
    idSql += ` ORDER BY o.created_at DESC LIMIT $${
      baseParams.length - 1
    } OFFSET $${baseParams.length};`;

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

  /**
   * Gán shipper cho đơn
   */
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

  /**
   * Cập nhật trạng thái đơn (đúng constraint)
   */
  async updateStatus(orderId, status) {
    const allowed = [
      "pending",
      "cooking",
      "shipping",
      "completed",
      "cancelled",
    ];
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

  /**
   * Cập nhật payment_status (schema không có payment_id trong orders)
   */
  async updatePaymentStatus(orderId, paymentStatus) {
    const allowed = ["unpaid", "paid", "refunded"];
    if (!allowed.includes(paymentStatus))
      throw new Error(`Invalid payment status: ${paymentStatus}`);

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

  /**
   * Đánh dấu settle
   */
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
      SELECT *
      FROM orders
      WHERE shipper_id = $1
    `;
    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }
    params.push(limit, offset);
    sql += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${
      params.length
    };`;

    const res = await pool.query(sql, params);
    return res.rows.map((r) => new this.Model(r));
  }
}

module.exports = new OrderDao();
