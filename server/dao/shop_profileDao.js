// dao/shop_profileDao.js
const FirestoreDao = require("./firestore_dao");
const ShopProfile = require("../models/shop_profile");

class ShopProfileDao extends FirestoreDao {
  constructor() {
    super("shop_profiles", ShopProfile);
  }

  /**
   * Lấy thông tin shop theo user_id (mỗi shop gắn với một user duy nhất)
   * @param {string} userId - ID người dùng
   * @returns {Promise<ShopProfile|null>} - Hồ sơ shop hoặc null nếu không tồn tại
   */
  async getByUserId(userId) {
    return this.findOneByField("user_id", userId);
  }

  /**
   * Lấy thông tin chi tiết shop (kèm avatar và rating từ users collection)
   */
  async findDetailsById(shopId) {
    try {
      const shop = await this.findById(shopId);
      return shop ? new ShopProfile(shop) : null;
    } catch (err) {
      console.error("❌ Error in findDetailsById:", err.message);
      throw err;
    }
  }

  /**
   * Cập nhật trạng thái cửa hàng (open/closed/pending)
   * @param {string} shopId - ID shop
   * @param {"open"|"closed"|"pending"} status - trạng thái mới
   * @returns {Promise<ShopProfile|null>} - Shop sau khi cập nhật
   */
  async updateStatus(shopId, status) {
    const allowed = ["open", "closed", "pending"];
    if (!allowed.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    return this.update(shopId, { status });
  }

  /**
   * Tìm các cửa hàng trong bán kính nhất định (dựa trên latitude/longitude)
   * @param {number} latitude - vĩ độ người dùng
   * @param {number} longitude - kinh độ người dùng
   * @param {number} radiusKm - bán kính tính theo km
   * @returns {Promise<ShopProfile[]>} - Danh sách cửa hàng trong bán kính
   */
  async findNearbyShops(latitude, longitude, radiusKm = 5) {
    try {
      const conditions = [{ field: "status", operator: "==", value: "open" }];
      const shops = await this.findWithConditions(conditions);

      // Lọc theo khoảng cách (tính toán ở app)
      return shops.filter(shop => {
        // Nếu shop có lat_lon, tính khoảng cách
        if (shop.lat && shop.lng) {
          const distance = this.calculateDistance(latitude, longitude, shop.lat, shop.lng);
          return distance <= radiusKm;
        }
        return false;
      });
    } catch (err) {
      console.error("❌ Error in findNearbyShops:", err.message);
      throw err;
    }
  }

  /**
   * Tính khoảng cách giữa hai điểm (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Bán kính Trái Đất tính bằng km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

module.exports = new ShopProfileDao();
