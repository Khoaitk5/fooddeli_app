const userShipperContractService = require("../services/userShipperContractService");

const userShipperContractController = {
  async create(req, res) {
    try {
      const created = await userShipperContractService.link(req.body);
      return res.status(201).json({ success: true, data: created });
    } catch (err) {
      console.error("❌ [userShipperContractController.create]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const found = await userShipperContractService.getById(id);
      if (!found) return res.status(404).json({ success: false, message: "Không tìm thấy liên kết." });
      return res.status(200).json({ success: true, data: found });
    } catch (err) {
      console.error("❌ [userShipperContractController.getById]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  },

  async list(req, res) {
    try {
      const items = await userShipperContractService.list();
      return res.status(200).json({ success: true, data: items });
    } catch (err) {
      console.error("❌ [userShipperContractController.list]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  },

  async listByUser(req, res) {
    try {
      const { userId } = req.params;
      const items = await userShipperContractService.listByUser(userId);
      return res.status(200).json({ success: true, data: items });
    } catch (err) {
      console.error("❌ [userShipperContractController.listByUser]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await userShipperContractService.update(id, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error("❌ [userShipperContractController.update]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await userShipperContractService.remove(id);
      return res.status(200).json({ success: true, data: deleted });
    } catch (err) {
      console.error("❌ [userShipperContractController.remove]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },
};

module.exports = userShipperContractController;
