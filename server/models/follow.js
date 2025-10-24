class Follow {
  constructor({ user_id, shop_id, followed_at }) {
    this.user_id = user_id;
    this.shop_id = shop_id;
    this.followed_at = followed_at;
  }
}

module.exports = Follow;
