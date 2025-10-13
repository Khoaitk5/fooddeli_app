class Product {
  constructor({
    product_id,
    shop_id,
    name,
    description,
    price,
    image_url,
    is_available,
    category,      // ✅ thêm mới
    updated_at,
  }) {
    this.product_id = product_id;
    this.shop_id = shop_id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.image_url = image_url;
    this.is_available = is_available;
    this.category = category;  // ✅ thêm mới
    this.updated_at = updated_at;
  }
}

module.exports = Product;
