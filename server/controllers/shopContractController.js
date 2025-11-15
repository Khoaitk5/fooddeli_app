const shopContractService = require("../services/shopContractService");
const userShopContractDao = require("../dao/userShopContractDao");
const userService = require("../services/userService");
const shopProfileService = require("../services/shop_profileService");

const shopContractController = {
  async create(req, res) {
    try {
      const data = req.body || {};

      // Đảm bảo hợp đồng shop mới luôn bắt đầu với trạng thái pending
      const payload = {
        ...data,
        status: "pending",
      };

      const created = await shopContractService.create(payload);
      return res.status(201).json({ success: true, data: created });
    } catch (err) {
      console.error("❌ [shopContractController.create]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const found = await shopContractService.getById(id);
      if (!found) return res.status(404).json({ success: false, message: "Không tìm thấy hợp đồng." });
      return res.status(200).json({ success: true, data: found });
    } catch (err) {
      console.error("❌ [shopContractController.getById]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  },

  async list(req, res) {
    try {
      const items = await shopContractService.list();
      return res.status(200).json({ success: true, data: items });
    } catch (err) {
      console.error("❌ [shopContractController.list]", err.message);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body || {};

      const updated = await shopContractService.update(id, payload);

      // Nếu hợp đồng được duyệt, cập nhật role của user thành 'shop' và tạo shop_profile nếu chưa có
      if (updated && updated.status === "approved") {
        try {
          const link = await userShopContractDao.findLatestByContractId(id);
          if (link && link.user_id) {
            const userId = link.user_id;
            await userService.updateUser(userId, { role: "shop" });

            // Tạo shop_profile nếu chưa tồn tại
            try {
              const existingShop = await shopProfileService.getShopByUserId(userId);
              if (!existingShop) {
                await shopProfileService.createShopProfile(userId, {
                  shop_name: updated.shop_name,
                  description: updated.shop_description || "",
                  open_hours: updated.opening_time || "",
                  closed_hours: updated.closing_time || "",
                });
              }
            } catch (profileErr) {
              console.error(
                "⚠️ [shopContractController.update] Không thể tạo shop_profile:",
                profileErr.message
              );
            }
          }
        } catch (innerErr) {
          console.error(
            "⚠️ [shopContractController.update] Không thể cập nhật role user:",
            innerErr.message
          );
        }
      }

      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error("❌ [shopContractController.update]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await shopContractService.remove(id);
      return res.status(200).json({ success: true, data: deleted });
    } catch (err) {
      console.error("❌ [shopContractController.remove]", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  },
};

module.exports = shopContractController;
