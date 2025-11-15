const GenericDao = require("./generic_dao");
const ShipperScore = require("../models/shipper_score");
const pool = require("../config/db");

class ShipperScoreDao extends GenericDao {
  constructor() {
    super("shipper_scores", ShipperScore);
  }

  async getByShipperId(shipperId) {
    const res = await pool.query(
      "SELECT * FROM shipper_scores WHERE shipper_id = $1 LIMIT 1",
      [shipperId]
    );
    return res.rows[0] ? new ShipperScore(res.rows[0]) : null;
  }

  async upsertScore({ shipperId, pointsDelta = 0, completedDelta = 0 }) {
    const sql = `
      INSERT INTO shipper_scores (shipper_id, total_points, completed_orders)
      VALUES ($1, $2, $3)
      ON CONFLICT (shipper_id)
      DO UPDATE SET
        total_points = shipper_scores.total_points + EXCLUDED.total_points,
        completed_orders = shipper_scores.completed_orders + EXCLUDED.completed_orders,
        last_updated = NOW()
      RETURNING *;
    `;

    const values = [
      shipperId,
      Number(pointsDelta) || 0,
      Number(completedDelta) || 0,
    ];

    const res = await pool.query(sql, values);
    return res.rows[0] ? new ShipperScore(res.rows[0]) : null;
  }

  async getLeaderboard({ limit = 50, offset = 0 } = {}) {
    const sql = `
      SELECT *
      FROM shipper_scores
      ORDER BY total_points DESC, completed_orders DESC, last_updated DESC
      LIMIT $1 OFFSET $2;
    `;
    const res = await pool.query(sql, [limit, offset]);
    return res.rows.map((row) => new ShipperScore(row));
  }
}

module.exports = new ShipperScoreDao();
