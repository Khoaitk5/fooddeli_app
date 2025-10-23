const admin = require("../config/firebase");

const videoLikeDao = {
  db: admin.firestore(),
  collection: "video_likes",

  // ❤️ Thêm tym
  async likeVideo(video_id, user_id) {
    try {
      const docId = `${video_id}_${user_id}`;
      const docRef = this.db.collection(this.collection).doc(docId);

      // Kiểm tra nếu đã tym rồi
      const existingDoc = await docRef.get();
      if (existingDoc.exists) {
        return true; // Đã tym rồi
      }

      // Thêm tym
      await docRef.set({
        id: docId,
        video_id,
        user_id,
        created_at: admin.firestore.Timestamp.now(),
      });

      return true;
    } catch (err) {
      console.error("❌ Error in likeVideo:", err.message);
      throw err;
    }
  },

  // 💔 Bỏ tym
  async unlikeVideo(video_id, user_id) {
    try {
      const docId = `${video_id}_${user_id}`;
      const docRef = this.db.collection(this.collection).doc(docId);

      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.delete();
        return true;
      }

      return false;
    } catch (err) {
      console.error("❌ Error in unlikeVideo:", err.message);
      throw err;
    }
  },

  // 🔍 Kiểm tra đã tym chưa
  async isLiked(video_id, user_id) {
    try {
      const docId = `${video_id}_${user_id}`;
      const doc = await this.db.collection(this.collection).doc(docId).get();
      return doc.exists;
    } catch (err) {
      console.error("❌ Error in isLiked:", err.message);
      throw err;
    }
  },
};

module.exports = videoLikeDao;
