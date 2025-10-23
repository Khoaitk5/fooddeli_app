// controllers/shopController.js
const shopService = require("../services/shop_profileService");

/**
 * 🏪 Tạo hồ sơ cửa hàng mới (role = 'shop')
 */
exports.createShopProfile = async (req, res) => {
  try {
    // ✅ Fix: Accept cả userId và user_id
    const { userId, user_id, ...shopData } = req.body;
    const finalUserId = userId || user_id;
    
    if (!finalUserId) {
      return res.status(400).json({ success: false, message: "Thiếu userId hoặc user_id" });
    }

    const result = await shopService.createShopProfile(finalUserId, shopData);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error("[ShopController:createShopProfile]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 📋 Lấy danh sách tất cả cửa hàng
 */
exports.getAllShops = async (req, res) => {
  try {
    const shops = await shopService.getAllShops();
    res.status(200).json({ success: true, data: shops });
  } catch (err) {
    console.error("[ShopController:getAllShops]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 🔍 Lấy thông tin chi tiết cửa hàng (ẩn ID khỏi URL)
 *  → frontend gửi shopId trong body
 */
exports.getShopDetail = async (req, res) => {
  try {
    const { shopId } = req.body;
    if (!shopId) {
      return res.status(400).json({ success: false, message: "Thiếu shopId trong body" });
    }

    const data = await shopService.getShopDetail(shopId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("[ShopController:getShopDetail]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 🔍 Lấy thông tin cửa hàng theo ID
 */
exports.getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await shopService.getShopById(id);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Không tìm thấy cửa hàng" });
    }
    res.status(200).json({ success: true, data: shop });
  } catch (err) {
    console.error("[ShopController:getShopById]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ✏️ Cập nhật thông tin cửa hàng
 */
exports.updateShopInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedShop = await shopService.updateShopInfo(id, req.body);
    if (!updatedShop) {
      return res.status(404).json({ success: false, message: "Không tìm thấy cửa hàng" });
    }
    res.status(200).json({ success: true, data: updatedShop });
  } catch (err) {
    console.error("[ShopController:updateShopInfo]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 🔄 Thay đổi trạng thái cửa hàng (open/closed/pending)
 */
exports.updateShopStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await shopService.updateShopStatus(id, status);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("[ShopController:updateShopStatus]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 📍 Lấy danh sách cửa hàng gần người dùng
 */
exports.getNearbyShops = async (req, res) => {
  try {
    // ✅ Fix: Đọc từ body vì route dùng POST
    const { latitude, longitude, radiusKm, radius } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: "Thiếu tọa độ người dùng" });
    }

    const shops = await shopService.getNearbyShops(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radiusKm || radius) || 5
    );
    res.status(200).json({ success: true, data: shops });
  } catch (err) {
    console.error("[ShopController:getNearbyShops]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 🏠 Gán địa chỉ cho cửa hàng
 */
exports.assignAddressToShop = async (req, res) => {
  try {
    const { shopId, addressId } = req.body;
    if (!shopId || !addressId) {
      return res.status(400).json({ success: false, message: "Thiếu shopId hoặc addressId" });
    }

    const updated = await shopService.assignAddressToShop(shopId, addressId);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("[ShopController:assignAddressToShop]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ❌ Xóa cửa hàng
 */
exports.deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await shopService.deleteShop(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy cửa hàng" });
    }

    res.status(200).json({ success: true, message: "Đã xóa cửa hàng thành công" });
  } catch (err) {
    console.error("[ShopController:deleteShop]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


