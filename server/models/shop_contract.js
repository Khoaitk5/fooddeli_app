class ShopContract {
  constructor({
    id,
    shop_name,
    shop_description,
    shop_address,
    phone,
    email,
    business_license_number,
    opening_time,
    closing_time,
    business_type,
    bank_name,
    bank_account_number,
    bank_account_name,
    shop_logo_url,
    shop_cover_url,
    // New ID card fields per schema
    id_card_number,
    id_card_front_url,
    id_card_back_url,
    household_business_cert_url,
    storefront_photo_url,
    tax_code_doc_url,
    company_business_cert_url,
    authorization_letter_url,
    food_safety_cert_url,
    representative_id_card_front_url,
    representative_id_card_back_url,
    status,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.shop_name = shop_name;
    this.shop_description = shop_description;
    this.shop_address = shop_address;
    this.phone = phone;
    this.email = email;
    this.business_license_number = business_license_number;
    this.opening_time = opening_time;
    this.closing_time = closing_time;
    this.business_type = business_type;
    this.bank_name = bank_name;
    this.bank_account_number = bank_account_number;
    this.bank_account_name = bank_account_name;
    this.shop_logo_url = shop_logo_url;
    this.shop_cover_url = shop_cover_url;
    this.id_card_number = id_card_number;
    this.id_card_front_url = id_card_front_url;
    this.id_card_back_url = id_card_back_url;
    this.household_business_cert_url = household_business_cert_url;
    this.storefront_photo_url = storefront_photo_url;
    this.tax_code_doc_url = tax_code_doc_url;
    this.company_business_cert_url = company_business_cert_url;
    this.authorization_letter_url = authorization_letter_url;
    this.food_safety_cert_url = food_safety_cert_url;
    this.representative_id_card_front_url = representative_id_card_front_url;
    this.representative_id_card_back_url = representative_id_card_back_url;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = ShopContract;
