const shipperContractService = require("../services/shipperContractService");
const userShipperContractDao = require("../dao/userShipperContractDao");
const userService = require("../services/userService");
const shipperProfileService = require("../services/shipper_profileService");

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

  // Lấy hợp đồng shipper mới nhất theo user_id (dùng cho Admin/Shippers xem chi tiết)
  async getLatestByUser(req, res) {
    try {
      const { userId } = req.params;
      const link = await userShipperContractDao.findLatestByUserId(userId);
      if (!link || !link.contract_id) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy hợp đồng cho user này." });
      }

      const contract = await shipperContractService.getById(link.contract_id);
      if (!contract) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy hợp đồng." });
      }

      return res.status(200).json({ success: true, data: contract });
    } catch (err) {
      console.error("❌ [shipperContractController.getLatestByUser]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
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
      const payload = req.body || {};

      const updated = await shipperContractService.update(id, payload);

      // Nếu hợp đồng được duyệt, cập nhật role của user thành 'shipper' và tạo shipper_profile nếu chưa có
      if (updated && updated.status === "approved") {
        try {
          const link = await userShipperContractDao.findLatestByContractId(id);
          if (link && link.user_id) {
            const userId = link.user_id;
            await userService.updateUser(userId, { role: "shipper" });

            // Tạo shipper_profile nếu chưa tồn tại
            try {
              const existingProfile = await shipperProfileService.getShipperByUserId(userId);
              if (!existingProfile) {
                await shipperProfileService.createShipperProfile({
                  user_id: userId,
                  // DB constraint: vehicle_type IN ('bike','motorbike','car')
                  vehicle_type: "motorbike",
                  vehicle_number: updated.vehicle_plate_number || null,
                  identity_card: updated.id_card_number || null,
                  status: "approved",
                });
              }
            } catch (profileErr) {
              console.error(
                "⚠️ [shipperContractController.update] Không thể tạo shipper_profile:",
                profileErr.message
              );
            }
          }
        } catch (innerErr) {
          console.error(
            "⚠️ [shipperContractController.update] Không thể cập nhật role user:",
            innerErr.message
          );
        }
      }

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
