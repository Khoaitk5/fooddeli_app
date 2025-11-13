class ShipperContract {
  constructor({
    id,
    full_name,
    phone,
    email,
    relative_name,
    relative_phone,
    relative_relationship,
    bank_owner_name,
    bank_name,
    bank_account_number,
    bank_account_name,
    vehicle_plate_number,
    id_card_number,
    id_document_expiry_date,
    driver_license_number,
    portrait_photo_url,
    id_card_front_url,
    id_card_back_url,
    vehicle_registration_url,
    driving_license_front_url,
    driving_license_back_url,
    motorcycle_license_front_url,
    motorcycle_license_back_url,
    health_certificate_url,
    criminal_record_url,
    lltp_01_url,
    lltp_appointment_url,
    status,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.full_name = full_name;
    this.phone = phone;
    this.email = email;
    this.relative_name = relative_name;
    this.relative_phone = relative_phone;
    this.relative_relationship = relative_relationship;
    this.bank_owner_name = bank_owner_name;
    this.bank_name = bank_name;
    this.bank_account_number = bank_account_number;
    this.bank_account_name = bank_account_name;
    this.vehicle_plate_number = vehicle_plate_number;
    this.id_card_number = id_card_number;
    this.id_document_expiry_date = id_document_expiry_date;
    this.driver_license_number = driver_license_number;
    this.portrait_photo_url = portrait_photo_url;
    this.id_card_front_url = id_card_front_url;
    this.id_card_back_url = id_card_back_url;
    this.vehicle_registration_url = vehicle_registration_url;
    this.driving_license_front_url = driving_license_front_url;
    this.driving_license_back_url = driving_license_back_url;
    this.motorcycle_license_front_url = motorcycle_license_front_url;
    this.motorcycle_license_back_url = motorcycle_license_back_url;
    this.health_certificate_url = health_certificate_url;
    this.criminal_record_url = criminal_record_url;
    this.lltp_01_url = lltp_01_url;
    this.lltp_appointment_url = lltp_appointment_url;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = ShipperContract;
