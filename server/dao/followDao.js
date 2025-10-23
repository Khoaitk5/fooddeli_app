const pool = require("../config/db");

class FollowDao {
  async followUser(follower_id, followed_id) {
    const query = `
      INSERT INTO follows (follower_id, followed_id)
      VALUES ($1, $2)
      ON CONFLICT (follower_id, followed_id) DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(query, [follower_id, followed_id]);
    return result.rows[0];
  }

  async unfollowUser(follower_id, followed_id) {
    const query = `
      DELETE FROM follows
      WHERE follower_id = $1 AND followed_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [follower_id, followed_id]);
    return result.rows[0];
  }

  async isFollowing(follower_id, followed_id) {
    const query = `
      SELECT 1 FROM follows
      WHERE follower_id = $1 AND followed_id = $2;
    `;
    const result = await pool.query(query, [follower_id, followed_id]);
    return result.rowCount > 0;
  }
}

module.exports = new FollowDao();
