// controllers/shipperController.js
const ShipperService = require("../services/shipperService");

// ➕ Tạo shipper mới
exports.createShipper = async (req, res) => {
  try {
    const result = await ShipperService.createShipper(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Lấy danh sách shipper
exports.getAllShippers = async (req, res) => {
  try {
    const result = await ShipperService.getAllShippers();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Lấy shipper theo ID
exports.getShipperById = async (req, res) => {
  try {
    const result = await ShipperService.getShipperById(req.params.id);
    if (!result) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Cập nhật shipper
exports.updateShipper = async (req, res) => {
  try {
    const result = await ShipperService.updateShipper(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Xóa shipper
exports.deleteShipper = async (req, res) => {
  try {
    const result = await ShipperService.deleteShipper(req.params.id);
    if (!result) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json({ message: "Shipper deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
