const User = require("./user");

class ShopProfile extends User {
  constructor({
    id,
    user_id,
    username,
    password,
    email,
    phone,
    rating,
    full_name,
    avatar_url,
    role,
    status,
    created_at,
    updated_at,
    shop_name,
    shop_address_id,
    description,
    open_hours,
    closed_hours,
    status_shop,
  }) {
    super({
      id: user_id,
      username,
      password,
      email,
      phone,
      rating,
      full_name,
      avatar_url,
      role,
      status,
      created_at,
      updated_at,
    });

    this.shop_profile_id = id;
    this.user_id = user_id;
    this.shop_name = shop_name;
    this.shop_address_id = shop_address_id;
    this.description = description;
    this.open_hours = open_hours;
    this.closed_hours = closed_hours;
    this.status = status_shop;
  }
}

module.exports = ShopProfile;
