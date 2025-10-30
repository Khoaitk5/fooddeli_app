const GenericDao = require("./generic_dao");
const ShipperProfile = require("../models/shipper_profile");
const pool = require("../config/db");

class ShipperProfileDao extends GenericDao {
  constructor() {
    super("shipper_profiles", ShipperProfile);
    this.db = pool;
  }

  /**
   * Lấy thông tin shipper theo user_id
   * @param {number} userId - ID người dùng
   * @returns {Promise<ShipperProfile|null>}
   */
  async getByUserId(userId) {
    const query = `
      SELECT * FROM shipper_profiles
      WHERE user_id = $1
      LIMIT 1;
    `;
    const result = await this.db.query(query, [userId]);
    return result.rows[0] ? new ShipperProfile(result.rows[0]) : null;
  }

  /**
   * Lấy danh sách shipper theo trạng thái online
   * @param {string} status - online/offline/busy
   * @returns {Promise<ShipperProfile[]>}
   */
  async getByOnlineStatus(status) {
    const query = `
      SELECT * FROM shipper_profiles
      WHERE online_status = $1
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query, [status]);
    return result.rows.map(row => new ShipperProfile(row));
  }

  /**
   * Cập nhật trạng thái online/offline/busy
   * @param {number} shipperId
   * @param {string} status
   * @returns {Promise<ShipperProfile|null>}
   */
  async updateOnlineStatus(shipperId, status) {
    const allowed = ["online", "offline", "busy"];
    if (!allowed.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const query = `
      UPDATE shipper_profiles
      SET online_status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await this.db.query(query, [status, shipperId]);
    return result.rows[0] ? new ShipperProfile(result.rows[0]) : null;
  }

  /**
   * Cập nhật vị trí hiện tại của shipper
   * @param {number} shipperId
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<ShipperProfile|null>}
   */
  async updateLocation(shipperId, latitude, longitude) {
    const query = `
      UPDATE shipper_profiles
      SET current_location = jsonb_build_object('lat', $1, 'lon', $2),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const result = await this.db.query(query, [latitude, longitude, shipperId]);
    return result.rows[0] ? new ShipperProfile(result.rows[0]) : null;
  }

  /**
   * Lấy danh sách shipper sẵn sàng nhận đơn (approved & online)
   * @returns {Promise<ShipperProfile[]>}
   */
  async getAvailableShippers() {
    const query = `
      SELECT * FROM shipper_profiles
      WHERE status = 'approved' AND online_status = 'online'
      ORDER BY created_at DESC;
    `;
    const result = await this.db.query(query);
    return result.rows.map(row => new ShipperProfile(row));
  }

  /**
   * Lấy thống kê hiệu suất của shipper
   * @param {number} shipperId - ID shipper profile
   * @returns {Promise<object>}
   */
  async getStatistics(shipperId) {
    const query = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN o.status='completed' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN o.status='cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        COALESCE(SUM(CASE WHEN o.status='completed' THEN o.delivery_fee ELSE 0 END), 0)::numeric as total_earnings,
        COALESCE(AVG(CASE WHEN o.status='completed' AND o.shipper_rating IS NOT NULL THEN o.shipper_rating END), 0)::numeric as avg_rating,
        ROUND(100 * SUM(CASE WHEN o.status='completed' THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0), 2)::numeric as completion_rate,
        COALESCE(AVG(CASE WHEN o.status='completed' THEN EXTRACT(EPOCH FROM (o.delivered_at - o.shipped_at))/60 END), 0)::numeric as avg_delivery_time_minutes
      FROM orders o
      WHERE o.shipper_id = $1;
    `;
    const result = await this.db.query(query, [shipperId]);
    return result.rows[0] || {};
  }

  /**
   * Lấy doanh thu theo khoảng thời gian
   * @param {number} shipperId - ID shipper profile
   * @param {string} period - "today", "week", "month", "all"
   * @returns {Promise<object>}
   */
  async getEarningsByPeriod(shipperId, period = "month") {
    let dateFilter = "NOW()";
    
    if (period === "today") {
      dateFilter = "NOW() - INTERVAL '1 day'";
    } else if (period === "week") {
      dateFilter = "NOW() - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "NOW() - INTERVAL '30 days'";
    }

    const query = `
      SELECT 
        DATE(o.created_at) as date,
        COUNT(*) as orders_count,
        SUM(o.delivery_fee)::numeric as daily_earnings,
        AVG(o.shipper_rating)::numeric as daily_avg_rating
      FROM orders o
      WHERE o.shipper_id = $1 
        AND o.status = 'completed'
        AND o.created_at >= ${dateFilter}
      GROUP BY DATE(o.created_at)
      ORDER BY DATE(o.created_at) DESC;
    `;
    
    const result = await this.db.query(query, [shipperId]);
    
    const total = result.rows.reduce((sum, row) => sum + (parseFloat(row.daily_earnings) || 0), 0);
    const totalOrders = result.rows.reduce((sum, row) => sum + (row.orders_count || 0), 0);
    
    return {
      period,
      total_earnings: total,
      total_orders: totalOrders,
      details: result.rows
    };
  }
}

module.exports = new ShipperProfileDao();
