const pool = require("../config/db");

const videoLikeDao = {
  // ❤️ Thêm tym
  async likeVideo(video_id, user_id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Kiểm tra nếu đã tym rồi
      const checkQuery = `
        SELECT 1 FROM video_likes WHERE video_id = $1 AND user_id = $2;
      `;
      const check = await client.query(checkQuery, [video_id, user_id]);
      if (check.rowCount === 0) {
        // Thêm tym
        await client.query(
          `INSERT INTO video_likes (video_id, user_id) VALUES ($1, $2);`,
          [video_id, user_id]
        );

        // +1 vào video
        await client.query(
          `UPDATE videos SET likes_count = likes_count + 1 WHERE video_id = $1;`,
          [video_id]
        );
      }

      await client.query("COMMIT");
      return true;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  // 💔 Bỏ tym
  async unlikeVideo(video_id, user_id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const delRes = await client.query(
        `DELETE FROM video_likes WHERE video_id = $1 AND user_id = $2;`,
        [video_id, user_id]
      );

      if (delRes.rowCount > 0) {
        await client.query(
          `UPDATE videos SET likes_count = GREATEST(likes_count - 1, 0) WHERE video_id = $1;`,
          [video_id]
        );
      }

      await client.query("COMMIT");
      return delRes.rowCount > 0;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  // 🔍 Kiểm tra đã tym chưa
  async isLiked(video_id, user_id) {
    const query = `
      SELECT 1 FROM video_likes
      WHERE video_id = $1 AND user_id = $2;
    `;
    const result = await pool.query(query, [video_id, user_id]);
    return result.rowCount > 0;
  },
};

module.exports = videoLikeDao;
