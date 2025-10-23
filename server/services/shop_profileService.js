const shopProfileDao = require("../dao/shop_profileDao");
const addressDao = require("../dao/addressDao");
const userDao = require("../dao/userDao");

/**
 * @class ShopProfileService
 * @description Xử lý nghiệp vụ liên quan đến cửa hàng (shop_profiles)
 */
class ShopProfileService {
  /**
   * @async
   * @function createShopProfile
   * @description Tạo hồ sơ cửa hàng mới cho user
   * @param {number} userId - ID người dùng
   * @param {object} shopData - Dữ liệu cửa hàng (shop_name, description, open_hours, closed_hours, shop_address_id)
   * @returns {Promise<object>} - Hồ sơ shop mới tạo
   */
  async createShopProfile(userId, shopData) {
    try {
      // Kiểm tra user có tồn tại và có vai trò phù hợp
      const user = await userDao.findById(userId);
      if (!user) throw new Error("Người dùng không tồn tại.");
      if (user.role !== "shop")
        throw new Error("Chỉ người dùng có role = 'shop' mới được tạo cửa hàng.");

      // Tạo hồ sơ shop
      const shop = await shopProfileDao.create({
        user_id: userId,
        shop_name: shopData.shop_name,
        description: shopData.description ?? "",
        open_hours: shopData.open_hours ?? "",
        closed_hours: shopData.closed_hours ?? "",
        shop_address_id: shopData.shop_address_id ?? null,
      });

      return shop;
    } catch (err) {
      console.error("❌ Error creating shop profile:", err.message);
      throw new Error("Không thể tạo hồ sơ cửa hàng.");
    }
  }

  /**
   * @async
   * @function getShopByUserId
   * @description Lấy thông tin shop theo user_id
   * @param {number} userId - ID người dùng
   * @returns {Promise<object|null>} - Hồ sơ shop hoặc null
   */
  async getShopByUserId(userId) {
    try {
      return await shopProfileDao.getByUserId(userId);
    } catch (err) {
      console.error("❌ Error fetching shop by user_id:", err.message);
      throw new Error("Không thể lấy thông tin cửa hàng.");
    }
  }

  /**
   * @async
   * @function getAllShops
   * @description Lấy danh sách tất cả cửa hàng
   * @returns {Promise<object[]>} - Danh sách shop
   */
  async getAllShops() {
    try {
      return await shopProfileDao.findAll();
    } catch (err) {
      console.error("❌ Error fetching all shops:", err.message);
      throw new Error("Không thể lấy danh sách cửa hàng.");
    }
  }

  /**
   * @async
   * @function updateShopInfo
   * @description Cập nhật thông tin cửa hàng
   * @param {number} shopId - ID cửa hàng
   * @param {object} updateData - Dữ liệu cập nhật
   * @returns {Promise<object>} - Shop sau khi cập nhật
   */
  async updateShopInfo(shopId, updateData) {
    try {
      const updated = await shopProfileDao.update("id", shopId, updateData);
      if (!updated) {
        console.warn(`⚠️ Shop profile ID ${shopId} không cập nhật được`);
        throw new Error("Không tìm thấy hồ sơ cửa hàng hoặc dữ liệu không hợp lệ.");
      }
      return updated;
    } catch (err) {
      console.error("❌ Error updating shop info:", err.message);
      throw err;
    }
  }

  /**
   * @async
   * @function updateShopStatus
   * @description Thay đổi trạng thái cửa hàng (open / closed / pending)
   * @param {number} shopId - ID cửa hàng
   * @param {"open"|"closed"|"pending"} status - Trạng thái mới
   * @returns {Promise<object>} - Shop sau khi cập nhật
   */
  async updateShopStatus(shopId, status) {
    try {
      return await shopProfileDao.updateStatus(shopId, status);
    } catch (err) {
      console.error("❌ Error updating shop status:", err.message);
      throw new Error("Không thể thay đổi trạng thái cửa hàng.");
    }
  }

  /**
   * @async
   * @function getNearbyShops
   * @description Lấy danh sách cửa hàng trong bán kính nhất định (dựa vào địa chỉ)
   * @param {number} latitude - Vĩ độ người dùng
   * @param {number} longitude - Kinh độ người dùng
   * @param {number} [radiusKm=5] - Bán kính (km)
   * @returns {Promise<object[]>} - Danh sách shop gần người dùng
   */
  async getNearbyShops(latitude, longitude, radiusKm = 5) {
    try {
      return await shopProfileDao.findNearbyShops(latitude, longitude, radiusKm);
    } catch (err) {
      console.error("❌ Error finding nearby shops:", err.message);
      throw new Error("Không thể lấy danh sách cửa hàng gần bạn.");
    }
  }

  /**
   * @async
   * @function assignAddressToShop
   * @description Gán địa chỉ cho cửa hàng
   * @param {number} shopId - ID cửa hàng
   * @param {number} addressId - ID địa chỉ
   * @returns {Promise<object>} - Hồ sơ shop sau khi cập nhật
   */
  async assignAddressToShop(shopId, addressId) {
    try {
      // kiểm tra address tồn tại
      const address = await addressDao.findById("address_id", addressId);
      if (!address) throw new Error("Địa chỉ không tồn tại.");

      const updated = await shopProfileDao.update("id", shopId, {
        shop_address_id: addressId,
      });

      return updated;
    } catch (err) {
      console.error("❌ Error assigning address to shop:", err.message);
      throw new Error("Không thể gán địa chỉ cho cửa hàng.");
    }
  }

  /**
   * @async
   * @function deleteShop
   * @description Xóa hồ sơ cửa hàng (thường khi user bị xóa)
   * @param {number} shopId - ID cửa hàng
   * @returns {Promise<object>} - Hồ sơ shop đã xóa
   */
  async deleteShop(shopId) {
    try {
      return await shopProfileDao.delete("id", shopId);
    } catch (err) {
      console.error("❌ Error deleting shop profile:", err.message);
      throw new Error("Không thể xóa hồ sơ cửa hàng.");
    }
  }
}

module.exports = new ShopProfileService();
