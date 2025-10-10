class CartItem {
  constructor({
    id,
    cart_id,
    shop_id,
    product_id,
    quantity,
    unit_price,
    line_total,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.cart_id = cart_id;
    this.shop_id = shop_id;
    this.product_id = product_id;
    this.quantity = quantity;
    this.unit_price = unit_price;
    this.line_total = line_total;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = CartItem;
