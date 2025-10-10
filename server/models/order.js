class Order {
  constructor({
    order_id,
    user_id,
    shop_id,
    shipper_id,
    total_price,
    status,
    payment_method,
    created_at,
    updated_at,
  }) {
    this.order_id = order_id;
    this.user_id = user_id;
    this.shop_id = shop_id;
    this.shipper_id = shipper_id;
    this.total_price = total_price;
    this.status = status;
    this.payment_method = payment_method;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Order;
