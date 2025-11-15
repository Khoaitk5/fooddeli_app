class Order {
  constructor({
    order_id,
    user_id,
    shop_id,
    shipper_id,
    food_price,
    delivery_fee,
    total_price,
    merchant_commission_rate,
    shipper_commission_rate,
    merchant_earn,
    shipper_earn,
    admin_earn,
    status,
    payment_method,
    payment_status,
    is_settled,
    settled_at,
    payment_id,
    created_at,
    updated_at,
  }) {
    this.order_id = order_id;
    this.user_id = user_id;
    this.shop_id = shop_id;
    this.shipper_id = shipper_id;
    this.food_price = food_price;
    this.delivery_fee = delivery_fee;
    this.total_price = total_price;
    this.merchant_commission_rate = merchant_commission_rate;
    this.shipper_commission_rate = shipper_commission_rate;
    this.merchant_earn = merchant_earn;
    this.shipper_earn = shipper_earn;
    this.admin_earn = admin_earn;
    this.status = status;
    this.payment_method = payment_method;
    this.payment_status = payment_status;
    this.is_settled = is_settled;
    this.settled_at = settled_at;
    this.payment_id = payment_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Order;
