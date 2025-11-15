class ShipperScore {
  constructor({
    id,
    shipper_id,
    total_points,
    completed_orders,
    last_updated,
  }) {
    this.id = id;
    this.shipper_id = shipper_id;
    this.total_points = Number(total_points || 0);
    this.completed_orders = Number(completed_orders || 0);
    this.last_updated = last_updated;
  }
}

module.exports = ShipperScore;
