const userShopContractService = require("../services/userShopContractService");

const userShopContractController = {
  async create(req, res) {
    try {
      const created = await userShopContractService.link(req.body);
      return res.status(201).json({ success: true, data: created });
    } catch (err) {
      console.error("❌ [userShopContractController.create]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const found = await userShopContractService.getById(id);
      if (!found) return res.status(404).json({ success: false, message: "Không tìm thấy liên kết." });
      return res.status(200).json({ success: true, data: found });
    } catch (err) {
      console.error("❌ [userShopContractController.getById]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  },

  async list(req, res) {
    try {
      const items = await userShopContractService.list();
      return res.status(200).json({ success: true, data: items });
    } catch (err) {
      console.error("❌ [userShopContractController.list]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  },

  async listByUser(req, res) {
    try {
      const { userId } = req.params;
      const items = await userShopContractService.listByUser(userId);
      return res.status(200).json({ success: true, data: items });
    } catch (err) {
      console.error("❌ [userShopContractController.listByUser]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await userShopContractService.update(id, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error("❌ [userShopContractController.update]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await userShopContractService.remove(id);
      return res.status(200).json({ success: true, data: deleted });
    } catch (err) {
      console.error("❌ [userShopContractController.remove]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },
};

module.exports = userShopContractController;
