// dao/order_detailDao.js
const GenericDao = require("./generic_dao");
const OrderDetail = require("../models/order_detail");
const pool = require("../config/db");

class OrderDetailDao extends GenericDao {
  constructor() {
    super("order_details", OrderDetail);
  }

  /**
   * Bulk add/upsert nhiều dòng vào order_details của 1 order
   * @param {number} orderId
   * @param {Array<{product_id:number, quantity:number, unit_price?:number}>} items
   * @param {{ mergeDuplicates?: boolean, useProvidedUnitPrice?: boolean }} options
   *  - mergeDuplicates: gộp các product_id trùng trong payload
   *  - useProvidedUnitPrice: nếu true sẽ dùng unit_price từ input (nếu có), ngược lại snapshot từ products.price
   * @returns {Promise<{ inserted:any[], rowCount:number }>}
   */
  async addMany(orderId, items, { mergeDuplicates = true, useProvidedUnitPrice = false } = {}) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("items must be a non-empty array");
    }

    // Gộp trùng product_id nếu cần
    let merged = items;
    if (mergeDuplicates) {
      const map = new Map();
      for (const it of items) {
        const pid = Number(it.product_id);
        const q = Number(it.quantity);
        if (!pid || !q || q <= 0) continue;
        const prev = map.get(pid) || { product_id: pid, quantity: 0, unit_price: it.unit_price };
        prev.quantity += q;
        // ưu tiên giữ unit_price đầu tiên (nếu dùng provided price)
        if (useProvidedUnitPrice && typeof it.unit_price === "number") prev.unit_price = it.unit_price;
        map.set(pid, prev);
      }
      merged = Array.from(map.values());
      if (merged.length === 0) throw new Error("No valid items to insert");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Chuẩn bị mảng cho UNNEST
      const productIds = [];
      const quantities = [];
      const prices = [];

      if (useProvidedUnitPrice) {
        // Dùng unit_price từ payload (nếu thiếu thì fallback từ DB)
        const pids = merged.map(i => i.product_id);
        const dbPrices = await client.query(
          `SELECT product_id, price FROM products WHERE product_id = ANY($1::int[])`,
          [pids]
        );
        const priceMap = new Map(dbPrices.rows.map(r => [Number(r.product_id), r.price]));

        for (const it of merged) {
          if (!priceMap.has(it.product_id) && typeof it.unit_price !== "number") {
            throw new Error(`Missing unit_price for product_id=${it.product_id}`);
          }
          productIds.push(it.product_id);
          quantities.push(it.quantity);
          prices.push(typeof it.unit_price === "number" ? it.unit_price : priceMap.get(it.product_id));
        }
      } else {
        // Snapshot giá từ products.price
        const pids = merged.map(i => i.product_id);
        const dbPrices = await client.query(
          `SELECT product_id, price FROM products WHERE product_id = ANY($1::int[])`,
          [pids]
        );
        const priceMap = new Map(dbPrices.rows.map(r => [Number(r.product_id), r.price]));

        for (const it of merged) {
          if (!priceMap.has(it.product_id)) {
            throw new Error(`Product not found: ${it.product_id}`);
          }
          productIds.push(it.product_id);
          quantities.push(it.quantity);
          prices.push(priceMap.get(it.product_id));
        }
      }

      // Bulk insert + upsert cộng dồn
      const sql = `
        INSERT INTO order_details (order_id, product_id, quantity, unit_price)
        SELECT $1, u.product_id, u.quantity, u.unit_price
        FROM UNNEST($2::int[], $3::int[], $4::numeric[]) AS u(product_id, quantity, unit_price)
        ON CONFLICT (order_id, product_id)
        DO UPDATE SET
          quantity   = order_details.quantity + EXCLUDED.quantity,
          updated_at = NOW()
        RETURNING *;
      `;
      const res = await client.query(sql, [orderId, productIds, quantities, prices]);

      await client.query("COMMIT");
      return { inserted: res.rows, rowCount: res.rowCount };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Lấy chi tiết theo order_id (tuỳ chọn join product info)
   */
  async getByOrderId(orderId, { withProduct = true } = {}) {
    if (!withProduct) {
      const res = await pool.query(
        `SELECT * FROM order_details WHERE order_id = $1 ORDER BY created_at ASC;`,
        [orderId]
      );
      return res.rows.map(r => new this.Model(r));
    }
    const res = await pool.query(
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
    return res.rows;
  }

  async updateQuantity(detailId, quantity) {
    if (quantity <= 0) throw new Error("Số lượng phải lớn hơn 0");
    const res = await pool.query(
      `
      UPDATE order_details
      SET quantity = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *;
      `,
      [quantity, detailId]
    );
    return res.rows[0] ? new this.Model(res.rows[0]) : null;
  }

  async deleteByOrderId(orderId) {
    const res = await pool.query(`DELETE FROM order_details WHERE order_id = $1;`, [orderId]);
    return res.rowCount;
  }
}

module.exports = new OrderDetailDao();
