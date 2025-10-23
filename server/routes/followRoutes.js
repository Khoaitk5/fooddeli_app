const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");

router.post("/follow", followController.followShop);
router.post("/unfollow", followController.unfollowShop);
router.post("/check", followController.isFollowingShop);

module.exports = router;
