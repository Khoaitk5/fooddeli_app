// controllers/shipperController.js
const ShipperProfileService = require("../services/shipper_profileService");

// ➕ Tạo shipper mới
exports.createShipper = async (req, res) => {
  try {
    const result = await ShipperProfileService.createShipperProfile(req.body.user_id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Lấy danh sách shipper
exports.getAllShippers = async (req, res) => {
  try {
    const result = await ShipperProfileService.getAllShippers();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Lấy shipper theo ID
exports.getShipperById = async (req, res) => {
  try {
    const result = await ShipperProfileService.getShipperById(req.params.id);
    if (!result) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Cập nhật shipper
exports.updateShipper = async (req, res) => {
  try {
    const result = await ShipperProfileService.updateShipper(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Xóa shipper
exports.deleteShipper = async (req, res) => {
  try {
    const result = await ShipperProfileService.deleteShipper(req.params.id);
    if (!result) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json({ message: "Shipper deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Lấy thống kê hiệu suất của shipper
exports.getShipperStats = async (req, res) => {
  try {
    const { shipperId } = req.params;
    if (!shipperId) {
      return res.status(400).json({ error: "shipperId is required" });
    }
    const stats = await ShipperProfileService.getShipperStatistics(shipperId);
    res.status(200).json(stats);
  } catch (err) {
    console.error("❌ Error fetching shipper stats:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 💰 Lấy doanh thu theo khoảng thời gian
exports.getShipperEarnings = async (req, res) => {
  try {
    const { shipperId } = req.params;
    const { period = "month" } = req.query;

    if (!shipperId) {
      return res.status(400).json({ error: "shipperId is required" });
    }

    const allowed = ["today", "week", "month", "all"];
    if (!allowed.includes(period)) {
      return res.status(400).json({ error: "Invalid period. Allowed: today, week, month, all" });
    }

    const earnings = await ShipperProfileService.getEarningsByPeriod(shipperId, period);
    res.status(200).json(earnings);
  } catch (err) {
    console.error("❌ Error fetching shipper earnings:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 👤 Lấy thông tin shipper profile của user hiện tại
exports.getMyShipperProfile = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
      });
    }

    const shipperProfile = await ShipperProfileService.getShipperByUserId(sessionUser.id);
    
    if (!shipperProfile) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hồ sơ shipper.",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      data: shipperProfile,
    });
  } catch (err) {
    console.error("❌ Error fetching my shipper profile:", err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};


exports.listNearbyCookingFull = async (req, res) => {
  try {
    const { lat, lon, radius_km, shipper_id, limit, offset } = req.body || {};
    const latN = Number(lat), lonN = Number(lon);
    if (!Number.isFinite(latN) || !Number.isFinite(lonN)) {
      return res.status(400).json({ success: false, message: "lat & lon required (number)" });
    }
    const r = await ShipperProfileService.listNearbyCookingFull({
      lat: latN,
      lon: lonN,
      radiusKm: Number(radius_km) || 3,
      shipperId: shipper_id ?? null,
      limit: Number(limit) || 200,
      offset: Number(offset) || 0,
    });
    return res.json({ success: true, data: r.items, meta: r.meta });
  } catch (err) {
    console.error("[ShipperCtrl:listNearbyCookingFull]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};