class Voucher {
  constructor({
    voucher_id,
    code,
    type,
    discount_value,
    start_date,
    end_date,
    min_order_value,
    max_discount,
    status,
  }) {
    this.voucher_id = voucher_id;
    this.code = code;
    this.type = type;
    this.discount_value = discount_value;
    this.start_date = start_date;
    this.end_date = end_date;
    this.min_order_value = min_order_value;
    this.max_discount = max_discount;
    this.status = status;
  }
}

module.exports = Voucher;
