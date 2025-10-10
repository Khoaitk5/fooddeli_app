class UserAddress {
  constructor({ user_id, address_id, is_primary, created_at }) {
    this.user_id = user_id;
    this.address_id = address_id;
    this.is_primary = is_primary;
    this.created_at = created_at;
  }
}

module.exports = UserAddress;
