const shipperScoreDao = require("../dao/shipper_scoreDao");

const shipperScoreService = {
  async getScoreByShipperId(shipperId) {
    if (!shipperId) throw new Error("shipperId is required");
    return await shipperScoreDao.getByShipperId(shipperId);
  },

  async addScoreForCompletedOrder({ shipperId, order = null, basePoints = 10, bonusPoints = 0 }) {
    if (!shipperId) throw new Error("shipperId is required");

    const totalPoints = Number(basePoints) + Number(bonusPoints || 0);

    return await shipperScoreDao.upsertScore({
      shipperId,
      pointsDelta: totalPoints,
      completedDelta: 1,
    });
  },

  async getLeaderboard({ limit = 50, offset = 0 } = {}) {
    return await shipperScoreDao.getLeaderboard({ limit, offset });
  },
};

module.exports = shipperScoreService;
