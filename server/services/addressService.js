const addressDao = require("../dao/addressDao");
const userAddressDao = require("../dao/user_addressDao");

/**
 * @class AddressService
 * @description Xử lý nghiệp vụ liên quan đến địa chỉ của người dùng và cửa hàng
 */
class AddressService {
  /**
   * @async
   * @function createAddressForUser
   * @description Tạo một địa chỉ mới (dạng JSON) và gán cho người dùng
   */
  async createAddressForUser(userId, addressData, isPrimary = false) {
    try {
      // ✅ Nhận đúng object address_line từ AuthService
      const raw = addressData.address_line || {};

      const addressJSON = {
        detail: raw.detail ?? "",
        ward: raw.ward ?? "",
        district: raw.district ?? "",
        city: raw.city ?? "",
      };

      // 🔧 FIX: Chuẩn hóa và stringify trước khi gọi DAO
      const safeAddressJSON = JSON.stringify(addressJSON);
      console.log("📦 [AddressService] address_line chuẩn bị insert:", safeAddressJSON);

      const address = await addressDao.create({
        address_line: safeAddressJSON, // 👈 Gửi dạng JSON string xuống DB
        lat_lon: addressData.lat_lon ?? null,
        note: addressData.note ?? "",
        address_type: addressData.address_type ?? "Nhà",
      });

      // Gán quan hệ user <-> address
      await userAddressDao.create({
        user_id: userId,
        address_id: address.address_id,
        is_primary: isPrimary,
      });

      console.log("✅ [AddressService] Address tạo thành công:", address);
      return address;
    } catch (err) {
      console.error("❌ [AddressService] Lỗi khi tạo address:", err.message);
      throw new Error("Không thể tạo địa chỉ mới cho người dùng.");
    }
  }

  // Các hàm khác giữ nguyên
}

module.exports = new AddressService();
