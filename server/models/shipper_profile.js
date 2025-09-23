// models/ShipperProfile.js
const User = require("./User");

class ShipperProfile extends User {
  constructor({
    id, // id trong shipper_profiles
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
    vehicle_type,
    vehicle_number,
    identity_card,
    shipper_status,
    online_status,
    latitude,
    longitude,
    shipper_created_at,
    shipper_updated_at,
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

    // thuộc tính riêng của shipper_profiles
    this.shipper_profile_id = id;
    this.vehicle_type = vehicle_type;
    this.vehicle_number = vehicle_number;
    this.identity_card = identity_card;
    this.shipper_status = shipper_status;
    this.online_status = online_status;
    this.latitude = latitude;
    this.longitude = longitude;
    this.shipper_created_at = shipper_created_at;
    this.shipper_updated_at = shipper_updated_at;
  }
}

module.exports = ShipperProfile;
