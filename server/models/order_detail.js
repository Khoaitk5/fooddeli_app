// models/OrderDetail.js

class OrderDetail {
  constructor({
    id,
    order_id,
    product_id,
    quantity,
    unit_price,
    line_total,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.order_id = order_id;
    this.product_id = product_id;
    this.quantity = quantity;
    this.unit_price = unit_price;
    this.line_total = line_total;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = OrderDetail;
