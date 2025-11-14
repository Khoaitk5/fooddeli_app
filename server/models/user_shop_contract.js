class UserShopContract {
  constructor({
    id,
    user_id,
    contract_id,
    status,
    is_active,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.user_id = user_id;
    this.contract_id = contract_id;
    this.status = status;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = UserShopContract;
