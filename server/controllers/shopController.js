// controllers/shopController.js
const shopService = require("../services/shop_profileService");

/**
 * 🏪 Tạo hồ sơ cửa hàng mới (role = 'shop')
 */
exports.createShopProfile = async (req, res) => {
  try {
    const { userId, ...shopData } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId" });
    }

    const result = await shopService.createShopProfile(userId, shopData);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error("[ShopController:createShopProfile]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 🔍 Lấy thông tin shop của user hiện tại (từ session/cookie)
 */
exports.getMyShop = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    console.log("[shopController:getMyShop] userId từ session:", userId);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập" });
    }

    const shop = await shopService.getShopByUserId(userId);
    console.log("[shopController:getMyShop] shop data:", shop);
    
    if (!shop) {
      return res.status(404).json({ success: false, message: "Bạn chưa tạo hồ sơ cửa hàng" });
    }

    res.status(200).json({ success: true, data: shop });
  } catch (err) {
    console.error("[ShopController:getMyShop]", err.message);
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
    const { latitude, longitude, radiusKm } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: "Thiếu tọa độ người dùng" });
    }

    const shops = await shopService.getNearbyShops(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radiusKm) || 5
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


