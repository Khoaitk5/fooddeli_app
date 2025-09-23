// models/Cart.js
class Cart {
  constructor({
    cart_id,
    user_id,
    items_count,
    subtotal,
    created_at,
    updated_at,
  }) {
    this.cart_id = cart_id;
    this.user_id = user_id;
    this.items_count = items_count;
    this.subtotal = subtotal;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Cart;
