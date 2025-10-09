// services/addressService.js
const addressDao = require("../dao/addressDao");

const addressService = {
  /**
   * 📍 Lấy toàn bộ địa chỉ của một user
   */
  async getUserAddresses(userId) {
    return await addressDao.getAddressesByUserId(userId);
  },

  /**
   * ⭐ Lấy địa chỉ mặc định của một user
   */
  async getDefaultAddress(userId) {
    return await addressDao.getDefaultAddress(userId);
  },

  /**
   * 🏡 Thêm địa chỉ mới cho người dùng
   * @param {object} addressData - { user_id, address_line, note?, address_type?, is_default? }
   */
  async addAddress(addressData) {
    if (!addressData.user_id || !addressData.address_line) {
      throw new Error("Thiếu user_id hoặc address_line");
    }

    // 🆕 Đảm bảo có note và address_type
    if (!addressData.note) addressData.note = "";
    if (!addressData.address_type) addressData.address_type = "Nhà";

    return await addressDao.addAddress(addressData);
  },

  /**
   * ✏️ Cập nhật địa chỉ hiện có
   * @param {number} addressId - ID địa chỉ cần cập nhật
   * @param {object} updateData - { address_line?, note?, address_type?, is_default? }
   */
  async updateAddress(addressId, updateData) {
    const address = await addressDao.findById(addressId);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }

    // 🧩 Nếu không có note hoặc loại địa chỉ, giữ nguyên
    if (updateData.note === undefined) updateData.note = address.note;
    if (updateData.address_type === undefined)
      updateData.address_type = address.address_type;

    return await addressDao.updateAddress(addressId, updateData);
  },

  /**
   * ❌ Xóa địa chỉ
   */
  async deleteAddress(addressId) {
    const address = await addressDao.findById(addressId);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }
    return await addressDao.deleteAddress(addressId);
  },

  /**
   * 🔄 Đặt một địa chỉ là mặc định
   */
  async setDefaultAddress(addressId) {
    const address = await addressDao.findById(addressId);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }

    // Gỡ bỏ mặc định cũ
    await addressDao.removeDefaultAddress(address.user_id);

    // Đặt địa chỉ này là mặc định
    return await addressDao.updateAddress(addressId, { is_default: true });
  },

  /**
   * 🆕 Cập nhật hoặc tạo mới địa chỉ mặc định cho người dùng
   * (hỗ trợ thêm note và address_type)
   */
  async setDefaultAddressByUser(userId, addressLine, note = "", address_type = "Nhà") {
    if (!userId || !addressLine) {
      throw new Error("Thiếu userId hoặc addressLine");
    }

    const existingAddresses = await addressDao.getAddressesByUserId(userId);

    if (existingAddresses.length === 0) {
      // 🆕 Nếu chưa có → tạo mới
      return await addressDao.addAddress({
        user_id: userId,
        address_line: addressLine,
        note,
        address_type,
        is_default: true,
      });
    } else {
      // 🔄 Nếu đã có → bỏ mặc định cũ rồi thêm mới
      await addressDao.removeDefaultAddress(userId);
      return await addressDao.addAddress({
        user_id: userId,
        address_line: addressLine,
        note,
        address_type,
        is_default: true,
      });
    }
  },
};

module.exports = addressService;
