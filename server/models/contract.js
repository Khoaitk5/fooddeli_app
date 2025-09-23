// models/Contract.js
class Contract {
  constructor({
    contract_id,
    user_id,
    role_type,
    contract_date,
    license_image,
    tax_code,
    status,
    created_at,
    updated_at,
  }) {
    this.contract_id = contract_id;
    this.user_id = user_id;
    this.role_type = role_type;
    this.contract_date = contract_date;
    this.license_image = license_image;
    this.tax_code = tax_code;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Contract;
