class Address {
  constructor({
    address_id,
    address_line,
    lat_lon,
    note,
    address_type,
    created_at,
    updated_at,
  }) {
    this.address_id = address_id;
    this.address_line = address_line; // JSON object
    this.lat_lon = lat_lon;
    this.note = note;
    this.address_type = address_type;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Address;
