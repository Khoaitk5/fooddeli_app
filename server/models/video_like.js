class VideoLike {
  constructor({ video_id, user_id, created_at }) {
    this.video_id = video_id;
    this.user_id = user_id;
    this.created_at = created_at;
  }
}

module.exports = VideoLike;
