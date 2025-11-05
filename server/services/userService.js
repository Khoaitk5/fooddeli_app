const userDao = require("../dao/userDao");
const shopProfileService = require("./shop_profileService");
const shipperProfileService = require("./shipper_profileService");
const addressService = require("./addressService");

/**
 * @class UserService
 * @description Xử lý nghiệp vụ liên quan đến người dùng (user)
 */
class UserService {
  /**
   * @async
   * @function createUser
   * @description Tạo người dùng mới
   */
  async createUser(userData) {
    try {
      const newUser = await userDao.create(userData);
      return newUser;
    } catch (err) {
      console.error("❌ Error creating user:", err.message);
      throw new Error("Không thể tạo người dùng mới.");
    }
  }

  /**
   * @async
   * @function getUserById
   * @description Lấy thông tin người dùng theo ID (bao gồm shop_profile và shipper_profile)
   */
  async getUserById(id) {
    try {
      const user = await userDao.findById(id);
      if (!user) return null;

      // 🏪 Lấy thông tin shop_profile
      const shopProfile = await shopProfileService.getShopByUserId(id);
      if (shopProfile) user.shop_profile = shopProfile;

      // 🚚 Lấy thông tin shipper_profile
      const shipperProfile = await shipperProfileService.getShipperByUserId(id);
      if (shipperProfile) user.shipper_profile = shipperProfile;

      // 🏡 Lấy danh sách địa chỉ
      const addresses = await addressService.getNormalizedUserAddresses(id);
      user.addresses = addresses || [];

      return user;
    } catch (err) {
      console.error("❌ Error fetching user by ID:", err.message);
      throw new Error("Không thể lấy thông tin người dùng.");
    }
  }

  /**
   * @async
   * @function getUserByUsername
   */
  async getUserByUsername(username) {
    try {
      return await userDao.findByUsername(username);
    } catch (err) {
      console.error("❌ Error fetching user by username:", err.message);
      throw new Error("Không thể tìm người dùng theo tên đăng nhập.");
    }
  }

  /**
   * @async
   * @function getUserByPhone
   */
  async getUserByPhone(phone) {
    try {
      return await userDao.findByPhone(phone);
    } catch (err) {
      console.error("❌ Error fetching user by phone:", err.message);
      throw new Error("Không thể tìm người dùng theo số điện thoại.");
    }
  }

  /**
   * @async
   * @function updateUser
   * @description Cập nhật người dùng theo cột key tuỳ chọn
   */
  async updateUser(id, updateData) {
    try {
      return await userDao.update("id", id, updateData);
    } catch (err) {
      console.error("❌ Error updating user:", err.message);
      throw new Error("Không thể cập nhật thông tin người dùng.");
    }
  }

  /**
   * @async
   * @function updateUserById
   * @description Cập nhật người dùng theo ID (dùng trong Profile)
   */
  async updateUserById(id, updateData) {
    try {
      // 🧱 Cập nhật thông tin cơ bản
      const updatedUser = await userDao.updateById(id, updateData);

      // 🏡 Nếu có address gửi kèm → cập nhật địa chỉ
      if (updateData.addresses && Array.isArray(updateData.addresses)) {
        await addressService.updateUserAddresses(id, updateData.addresses);
      }

      // 🏪 Nếu có cập nhật shop_profile → cập nhật shop
      if (updateData.shop_profile) {
        const shop = await shopProfileService.getShopByUserId(id);
        if (shop) {
          await shopProfileService.updateShopInfo(
            shop.shop_id || shop.id,
            updateData.shop_profile
          );
        }
      }

      return updatedUser;
    } catch (err) {
      console.error("❌ Error updateUserById:", err.message);
      throw new Error("Không thể cập nhật hồ sơ người dùng.");
    }
  }

  /**
   * @async
   * @function getAllUsers
   * @description Lấy tất cả người dùng (hoặc lọc theo role)
   */
  async getAllUsers(role = null) {
    try {
      const users = await userDao.findAll();
      if (role) {
        return users.filter((u) => u.role === role);
      }
      return users;
    } catch (err) {
      console.error("❌ Error fetching all users:", err.message);
      throw new Error("Không thể lấy danh sách người dùng.");
    }
  }

  /**
   * @async
   * @function lockUserAccount
   */
  async lockUserAccount(id) {
    try {
      return await userDao.lockUserAccount(id);
    } catch (err) {
      console.error("❌ Error locking user:", err.message);
      throw new Error("Không thể khóa tài khoản người dùng.");
    }
  }

  /**
   * @async
   * @function updateRating
   */
  async updateRating(id, rating) {
    try {
      if (rating < 0 || rating > 5) throw new Error("Rating không hợp lệ.");
      return await userDao.updateRating(id, rating);
    } catch (err) {
      console.error("❌ Error updating rating:", err.message);
      throw new Error("Không thể cập nhật điểm đánh giá người dùng.");
    }
  }

  /**
   * @async
   * @function getRoleById
   */
  async getRoleById(id) {
    try {
      return await userDao.getRoleById(id);
    } catch (err) {
      console.error("❌ Error fetching role:", err.message);
      throw new Error("Không thể lấy vai trò người dùng.");
    }
  }

  /**
   * @async
   * @function deleteUser
   */
  async deleteUser(id) {
    try {
      return await userDao.delete("id", id);
    } catch (err) {
      console.error("❌ Error deleting user:", err.message);
      throw new Error("Không thể xóa người dùng.");
    }
  }

  /**
   * @async
   * @function getUserByEmail
   */
  async getUserByEmail(email) {
    try {
      return await userDao.getUserByEmail(email);
    } catch (err) {
      console.error("❌ Error fetching user by email:", err.message);
      throw new Error("Không thể tìm người dùng theo email.");
    }
  }

  /**
   * @async
   * @function searchUsers
   */
  async searchUsers(keyword) {
    try {
      if (!keyword || keyword.trim() === "") {
        throw new Error("Từ khóa tìm kiếm không được để trống.");
      }
      return await userDao.searchUsers(keyword);
    } catch (err) {
      console.error("❌ [UserService] Lỗi searchUsers:", err.message);
      throw new Error("Không thể tìm kiếm người dùng.");
    }
  }
}

module.exports = new UserService();
