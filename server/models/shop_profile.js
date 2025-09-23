// models/ShopProfile.js
const User = require("./User");

class ShopProfile extends User {
  constructor({
    id, // id trong shop_profiles
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
    address,
    latitude,
    longitude,
    description,
    open_hours,
    shop_status,
    shop_created_at,
    shop_updated_at,
  }) {
    // gọi constructor User
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

    // thuộc tính riêng của shop_profiles
    this.shop_profile_id = id;
    this.shop_name = shop_name;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.description = description;
    this.open_hours = open_hours;
    this.shop_status = shop_status;
    this.shop_created_at = shop_created_at;
    this.shop_updated_at = shop_updated_at;
  }
}

module.exports = ShopProfile;
