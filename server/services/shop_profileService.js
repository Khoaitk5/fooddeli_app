// services/shopProfileService.js
const shopProfileDao = require("../dao/shop_profileDao");
const addressDao = require("../dao/addressDao");
const userDao = require("../dao/userDao");
const videoService = require("./videoService");

class ShopProfileService {
  /**
   * 🏪 Tạo hồ sơ cửa hàng mới cho user (role = 'shop')
   */
  async createShopProfile(userId, shopData) {
    try {
      // Kiểm tra user tồn tại
      const user = await userDao.findById("id", userId);
      if (!user) throw new Error("Người dùng không tồn tại.");
      if (user.role !== "shop") {
        throw new Error("Chỉ người dùng có role = 'shop' mới được tạo cửa hàng.");
      }

      // Tạo hồ sơ shop
      const shop = await shopProfileDao.create({
        user_id: userId,
        shop_name: shopData.shop_name,
        description: shopData.description ?? "",
        open_hours: shopData.open_hours ?? "",
        closed_hours: shopData.closed_hours ?? "",
        shop_address_id: shopData.shop_address_id ?? null,
      });

      // Trả về chi tiết (kèm user info)
      return await this.getShopById(shop.id);
    } catch (err) {
      console.error("[ShopProfileService:createShopProfile]", err.message);
      throw new Error("Không thể tạo hồ sơ cửa hàng.");
    }
  }

  /**
   * 🔍 Lấy thông tin shop theo user_id
   */
  async getShopByUserId(userId) {
    try {
      return await shopProfileDao.getByUserId(userId);
    } catch (err) {
      console.error("[ShopProfileService:getShopByUserId]", err.message);
      throw new Error("Không thể lấy thông tin cửa hàng.");
    }
  }

  /**
   * 🔍 Lấy thông tin shop theo ID (kèm avatar & rating user)
   */
  async getShopById(shopId) {
    try {
      const shop = await shopProfileDao.findDetailsById(shopId);
      if (!shop) throw new Error("Không tìm thấy cửa hàng.");
      return shop;
    } catch (err) {
      console.error("[ShopProfileService:getShopById]", err.message);
      throw err;
    }
  }

  /**
   * 📦 Lấy chi tiết cửa hàng + danh sách video của shop
   */
  async getShopDetail(shopId) {
    try {
      const shop = await this.getShopById(shopId);
      const videos = await videoService.getVideosByShop(shopId);
      return { shop, videos };
    } catch (err) {
      console.error("[ShopProfileService:getShopDetail]", err.message);
      throw new Error("Không thể lấy thông tin chi tiết cửa hàng.");
    }
  }

  /**
   * 📋 Lấy danh sách tất cả cửa hàng
   */
  async getAllShops() {
    try {
      return await shopProfileDao.findAll();
    } catch (err) {
      console.error("[ShopProfileService:getAllShops]", err.message);
      throw new Error("Không thể lấy danh sách cửa hàng.");
    }
  }

  /**
   * ✏️ Cập nhật thông tin cửa hàng
   */
  async updateShopInfo(shopId, updateData) {
    try {
      const shop = await shopProfileDao.update("id", shopId, {
        ...updateData,
        updated_at: new Date(),
      });
      return shop;
    } catch (err) {
      console.error("[ShopProfileService:updateShopInfo]", err.message);
      throw new Error("Không thể cập nhật thông tin cửa hàng.");
    }
  }

  /**
   * 🔄 Cập nhật trạng thái cửa hàng (open / closed / pending)
   */
  async updateShopStatus(shopId, status) {
    try {
      return await shopProfileDao.updateStatus(shopId, status);
    } catch (err) {
      console.error("[ShopProfileService:updateShopStatus]", err.message);
      throw new Error("Không thể thay đổi trạng thái cửa hàng.");
    }
  }

  /**
   * 📍 Lấy danh sách cửa hàng gần người dùng
   */
  async getNearbyShops(latitude, longitude, radiusKm = 5) {
    try {
      return await shopProfileDao.findNearbyShops(latitude, longitude, radiusKm);
    } catch (err) {
      console.error("[ShopProfileService:getNearbyShops]", err.message);
      throw new Error("Không thể lấy danh sách cửa hàng gần bạn.");
    }
  }

  /**
   * 🏠 Gán địa chỉ cho cửa hàng
   */
  async assignAddressToShop(shopId, addressId) {
    try {
      const address = await addressDao.findById("address_id", addressId);
      if (!address) throw new Error("Địa chỉ không tồn tại.");

      const updated = await shopProfileDao.update("id", shopId, {
        shop_address_id: addressId,
        updated_at: new Date(),
      });

      return updated;
    } catch (err) {
      console.error("[ShopProfileService:assignAddressToShop]", err.message);
      throw new Error("Không thể gán địa chỉ cho cửa hàng.");
    }
  }

  /**
   * ❌ Xóa hồ sơ cửa hàng
   */
  async deleteShop(shopId) {
    try {
      return await shopProfileDao.delete("id", shopId);
    } catch (err) {
      console.error("[ShopProfileService:deleteShop]", err.message);
      throw new Error("Không thể xóa hồ sơ cửa hàng.");
    }
  }
}

module.exports = new ShopProfileService();
