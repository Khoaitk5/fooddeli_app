class Payment {
  constructor({
    id,
    order_id,
    provider,
    transaction_code,
    amount,
    status,
    paid_at,
  }) {
    this.id = id;
    this.order_id = order_id;
    this.provider = provider;
    this.transaction_code = transaction_code;
    this.amount = amount;
    this.status = status;
    this.paid_at = paid_at;
  }
}

module.exports = Payment;
