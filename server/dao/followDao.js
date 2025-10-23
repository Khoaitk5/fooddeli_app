const admin = require("../config/firebase");

class FollowDao {
  constructor() {
    this.db = admin.firestore();
    this.collection = "follows";
  }

  /**
   * Theo dõi một người dùng
   */
  async followUser(follower_id, followed_id) {
    try {
      const docId = `${follower_id}_${followed_id}`;
      const docRef = this.db.collection(this.collection).doc(docId);
      
      // Kiểm tra xem đã follow chưa
      const existingDoc = await docRef.get();
      if (existingDoc.exists) {
        return existingDoc.data();
      }

      const followData = {
        id: docId,
        follower_id,
        followed_id,
        created_at: admin.firestore.Timestamp.now(),
      };
      
      await docRef.set(followData);
      return followData;
    } catch (err) {
      console.error("❌ Error in followUser:", err.message);
      throw err;
    }
  }

  /**
   * Bỏ theo dõi một người dùng
   */
  async unfollowUser(follower_id, followed_id) {
    try {
      const docId = `${follower_id}_${followed_id}`;
      const docRef = this.db.collection(this.collection).doc(docId);
      
      const doc = await docRef.get();
      const data = doc.exists ? doc.data() : null;
      
      if (doc.exists) {
        await docRef.delete();
      }
      
      return data;
    } catch (err) {
      console.error("❌ Error in unfollowUser:", err.message);
      throw err;
    }
  }

  /**
   * Kiểm tra xem có đang follow không
   */
  async isFollowing(follower_id, followed_id) {
    try {
      const docId = `${follower_id}_${followed_id}`;
      const doc = await this.db.collection(this.collection).doc(docId).get();
      return doc.exists;
    } catch (err) {
      console.error("❌ Error in isFollowing:", err.message);
      throw err;
    }
  }
}

module.exports = new FollowDao();
