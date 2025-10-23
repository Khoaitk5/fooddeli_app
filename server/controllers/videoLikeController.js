const videoLikeService = require("../services/video_likeService");
const { getSessionUser } = require("../services/sessionService");

exports.likeVideo = async (req, res) => {
  console.log("🔥 [DEBUG] likeVideo() called");
  console.log("📦 [DEBUG] Body:", req.body);
  console.log("🍪 [DEBUG] Session cookie:", req.headers.cookie);
  try {
    const user = getSessionUser(req);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Bạn chưa đăng nhập" });

    const { video_id } = req.body;
    if (!video_id)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu video_id" });

    await videoLikeService.likeVideo(video_id, user.id);
    res.json({ success: true, message: "Đã tym video" });
  } catch (err) {
    console.error("❌ [likeVideo] Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.unlikeVideo = async (req, res) => {
  try {
    const user = getSessionUser(req);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Bạn chưa đăng nhập" });

    const { video_id } = req.body;
    if (!video_id)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu video_id" });

    await videoLikeService.unlikeVideo(video_id, user.id);
    res.json({ success: true, message: "Đã bỏ tym video" });
  } catch (err) {
    console.error("❌ [unlikeVideo] Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.isLiked = async (req, res) => {
  try {
    const user = getSessionUser(req);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Bạn chưa đăng nhập" });

    const { video_id } = req.body;
    if (!video_id)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu video_id" });

    const liked = await videoLikeService.isLiked(video_id, user.id);
    res.json({ success: true, liked });
  } catch (err) {
    console.error("❌ [isLiked] Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
