const FirestoreDao = require("./firestore_dao");
const UserAddress = require("../models/user_address");
const Address = require("../models/address");

/**
 * @class UserAddressDao
 * @extends FirestoreDao
 * @description DAO cho collection `user_addresses`
 */
class UserAddressDao extends FirestoreDao {
  constructor() {
    super("user_addresses", UserAddress);
  }

  /**
   * Lấy tất cả địa chỉ của 1 user (kết hợp với addresses collection)
   */
  async getAddressesByUserId(userId) {
    try {
      const conditions = [{ field: "user_id", operator: "==", value: userId }];
      const userAddresses = await this.findWithConditions(
        conditions,
        "is_primary",
        "desc"
      );

      // Sắp xếp: primary first, sau đó theo created_at
      userAddresses.sort((a, b) => {
        if (a.is_primary !== b.is_primary) {
          return a.is_primary ? -1 : 1;
        }
        const aTime = a.created_at?.toDate?.() || new Date(0);
        const bTime = b.created_at?.toDate?.() || new Date(0);
        return bTime - aTime;
      });

      return userAddresses.map(ua => new Address(ua));
    } catch (err) {
      console.error("❌ Error in getAddressesByUserId:", err.message);
      throw err;
    }
  }

  /**
   * Lấy địa chỉ mặc định (is_primary = TRUE)
   */
  async getDefaultAddressByUserId(userId) {
    try {
      const conditions = [
        { field: "user_id", operator: "==", value: userId },
        { field: "is_primary", operator: "==", value: true }
      ];
      const addresses = await this.findWithConditions(conditions);
      return addresses.length > 0 ? new Address(addresses[0]) : null;
    } catch (err) {
      console.error("❌ Error in getDefaultAddressByUserId:", err.message);
      throw err;
    }
  }

  /**
   * Cập nhật quan hệ user ↔ address (vd: đổi is_primary)
   */
  async updateByAddressId(addressId, updateData) {
    try {
      const userAddresses = await this.findAll();
      const targetUA = userAddresses.find(ua => ua.address_id === addressId);

      if (!targetUA) return null;

      return this.update(targetUA.id, updateData);
    } catch (err) {
      console.error("❌ Error in updateByAddressId:", err.message);
      throw err;
    }
  }

  /**
   * Tạo quan hệ giữa user và address
   */
  async createRelation(userId, addressId, isPrimary = false) {
    try {
      return this.create({
        user_id: userId,
        address_id: addressId,
        is_primary: isPrimary,
      });
    } catch (err) {
      console.error("❌ Error in createRelation:", err.message);
      throw err;
    }
  }
}

module.exports = new UserAddressDao();
