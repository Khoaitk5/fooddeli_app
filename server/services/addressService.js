// services/addressService.js
const addressDao = require("../dao/addressDao");

const addressService = {
  /**
   * 📍 Lấy toàn bộ địa chỉ của một user
   * @param {number} userId - ID người dùng
   * @returns {Promise<object[]>}
   */
  async getUserAddresses(userId) {
    return await addressDao.getAddressesByUserId(userId);
  },

  /**
   * ⭐ Lấy địa chỉ mặc định của một user
   * @param {number} userId - ID người dùng
   * @returns {Promise<object|null>}
   */
  async getDefaultAddress(userId) {
    return await addressDao.getDefaultAddress(userId);
  },

  /**
   * 🏡 Thêm địa chỉ mới cho người dùng
   * @param {object} addressData - { user_id, address_line, is_default }
   * @returns {Promise<object>}
   */
  async addAddress(addressData) {
    if (!addressData.user_id || !addressData.address_line) {
      throw new Error("Thiếu user_id hoặc address_line");
    }
    return await addressDao.addAddress(addressData);
  },

  /**
   * ✏️ Cập nhật địa chỉ hiện có
   * @param {number} addressId - ID địa chỉ cần cập nhật
   * @param {object} updateData - { address_line?, is_default? }
   * @returns {Promise<object>}
   */
  async updateAddress(addressId, updateData) {
    const address = await addressDao.findById(addressId);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }
    return await addressDao.updateAddress(addressId, updateData);
  },

  /**
   * ❌ Xóa địa chỉ
   * @param {number} addressId - ID địa chỉ cần xóa
   * @returns {Promise<boolean>}
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
   * @param {number} addressId - ID địa chỉ
   * @returns {Promise<object>}
   */
  async setDefaultAddress(addressId) {
    const address = await addressDao.findById(addressId);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }

    // Gỡ bỏ địa chỉ mặc định cũ
    await addressDao.removeDefaultAddress(address.user_id);

    // Cập nhật địa chỉ thành mặc định
    return await addressDao.updateAddress(addressId, { is_default: true });
  },
};

module.exports = addressService;
