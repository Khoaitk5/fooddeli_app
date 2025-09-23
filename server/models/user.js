// models/User.js
class User {
  constructor({
    id,
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
  }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.rating = rating;
    this.full_name = full_name;
    this.avatar_url = avatar_url;
    this.role = role;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = User;
