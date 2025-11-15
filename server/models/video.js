class Video {
  constructor({
    video_id,
    shop_id,
    title,
    description,
    video_url,
    thumbnail_url,
    duration,
    views_count,
    likes_count,
    comments_count,
    status,
    moderation_result,
    moderation_date,
    created_at,
    updated_at,
  }) {
    this.video_id = video_id;
    this.shop_id = shop_id;
    this.title = title;
    this.description = description;
    this.video_url = video_url;
    this.thumbnail_url = thumbnail_url;
    this.duration = duration;
    this.views_count = views_count;
    this.likes_count = likes_count;
    this.comments_count = comments_count;
    this.status = status;
    this.moderation_result = moderation_result;
    this.moderation_date = moderation_date;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Video;
