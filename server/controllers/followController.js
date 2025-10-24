const followService = require("../services/followService");
const { getSessionUser } = require("../services/sessionService");

exports.followShop = async (req, res) => {
  try {
    // console.log("🍪 [DEBUG] Cookie headers:", req.headers.cookie);
    // console.log("🧠 [DEBUG] Session object:", req.session);
    // console.log("👤 [DEBUG] Session user:", req.session?.user);

    const sessionUser = getSessionUser(req);
    if (!sessionUser)
      return res
        .status(401)
        .json({ success: false, message: "Bạn chưa đăng nhập" });

    const follower_id = sessionUser.id;
    const { shopUserId } = req.body; // chính là user_id chủ shop

    console.log("🧠 [DEBUG] followerId:", follower_id);
    console.log("🏪 [DEBUG] followedId:", shopUserId);

    const result = await followService.followUser(follower_id, shopUserId);
    res.json({ success: true, message: "Đã theo dõi cửa hàng", data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.unfollowShop = async (req, res) => {
  try {
    const sessionUser = getSessionUser(req);
    if (!sessionUser)
      return res
        .status(401)
        .json({ success: false, message: "Bạn chưa đăng nhập" });

    const follower_id = sessionUser.id;
    const { shopUserId } = req.body;

    const result = await followService.unfollowUser(follower_id, shopUserId);
    res.json({ success: true, message: "Đã hủy theo dõi", data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.isFollowingShop = async (req, res) => {
  try {
    const sessionUser = getSessionUser(req);
    if (!sessionUser)
      return res
        .status(401)
        .json({ success: false, message: "Bạn chưa đăng nhập" });

    const follower_id = sessionUser.id;
    const { shopUserId } = req.body;

    const isFollowing = await followService.isFollowing(
      follower_id,
      shopUserId
    );
    res.json({ success: true, isFollowing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
