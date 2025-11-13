// models/Review.js
class Review {
  constructor({
    review_id,
    reviewer_id,
    target_id,
    target_type,
    order_id,
    rating,
    comment,
    created_at,
    updated_at,
  }) {
    this.review_id = review_id;
    this.reviewer_id = reviewer_id;
    this.target_id = target_id;
    this.target_type = target_type;
    this.order_id = order_id;
    this.rating = rating;
    this.comment = comment;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Review;
