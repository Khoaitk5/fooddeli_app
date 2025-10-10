const User = require("./user");

class ShipperProfile extends User {
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
    vehicle_type,
    vehicle_number,
    identity_card,
    status_shipper,
    online_status,
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

    this.shipper_profile_id = id;
    this.vehicle_type = vehicle_type;
    this.vehicle_number = vehicle_number;
    this.identity_card = identity_card;
    this.status = status_shipper;
    this.online_status = online_status;
  }
}

module.exports = ShipperProfile;
