class VideoComment {
  constructor({ comment_id, video_id, user_id, content, created_at }) {
    this.comment_id = comment_id;
    this.video_id = video_id;
    this.user_id = user_id;
    this.content = content;
    this.created_at = created_at;
  }
}

module.exports = VideoComment;
