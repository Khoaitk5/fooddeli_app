// models/orderVoucherModel.js

class OrderVoucher {
  constructor({ order_id, voucher_id }) {
    this.order_id = order_id;
    this.voucher_id = voucher_id;
  }
}

module.exports = OrderVoucher;
