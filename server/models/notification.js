class Notification {
  constructor({ id, user_id, title, body, is_read, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.title = title;
    this.body = body;
    this.is_read = is_read;
    this.created_at = created_at;
  }
}

module.exports = Notification;
