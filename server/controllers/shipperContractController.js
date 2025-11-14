const shipperContractService = require("../services/shipperContractService");

const shipperContractController = {
  async create(req, res) {
    try {
      const data = req.body;
      const created = await shipperContractService.create(data);
      return res.status(201).json({ success: true, data: created });
    } catch (err) {
      console.error("❌ [shipperContractController.create]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const found = await shipperContractService.getById(id);
      if (!found) return res.status(404).json({ success: false, message: "Không tìm thấy hợp đồng." });
      return res.status(200).json({ success: true, data: found });
    } catch (err) {
      console.error("❌ [shipperContractController.getById]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  },

  async list(req, res) {
    try {
      const items = await shipperContractService.list();
      return res.status(200).json({ success: true, data: items });
    } catch (err) {
      console.error("❌ [shipperContractController.list]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await shipperContractService.update(id, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error("❌ [shipperContractController.update]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await shipperContractService.remove(id);
      return res.status(200).json({ success: true, data: deleted });
    } catch (err) {
      console.error("❌ [shipperContractController.remove]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },
};

module.exports = shipperContractController;
