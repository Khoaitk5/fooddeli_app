const ShopService = require("../services/shopService");

exports.createShop = async (req, res) => {
  try {
    const result = await ShopService.createShop(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllShops = async (req, res) => {
  try {
    const result = await ShopService.getAllShops();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const result = await ShopService.getShopById(req.params.id);
    if (!result) return res.status(404).json({ message: "Shop not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const result = await ShopService.updateShop(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: "Shop not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteShop = async (req, res) => {
  try {
    const result = await ShopService.deleteShop(req.params.id);
    if (!result) return res.status(404).json({ message: "Shop not found" });
    res.status(200).json({ message: "Shop deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
