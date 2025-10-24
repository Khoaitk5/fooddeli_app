const userService = require("../services/userService");
const addressService = require("../services/addressService");
const shopProfileService = require("../services/shop_profileService");

/**
 * 📌 Lấy danh sách tất cả người dùng (chỉ admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("⚠️ Lỗi getAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách người dùng.",
    });
  }
};

/**
 * 📌 Lấy thông tin user hiện tại (dựa trên session)
 */
const getCurrentUser = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
      });
    }

    const user = await userService.getUserById(sessionUser.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "❌ Không tìm thấy người dùng.",
      });
    }

    // 🧩 Lấy danh sách địa chỉ user
    let addresses = await addressService.getNormalizedUserAddresses(user.id);
    let shop_profile = null;

    // 🏪 Nếu user là shop → tách riêng địa chỉ shop
    if (user.role === "shop" && user.shop_profile) {
      shop_profile = user.shop_profile;

      if (shop_profile.shop_address_id) {
        const shopAddress = await addressService.getAddressById(
          shop_profile.shop_address_id
        );
        shop_profile = { ...shop_profile, address: shopAddress };

        // 🧹 Loại bỏ địa chỉ shop khỏi danh sách user.addresses
        addresses = addresses.filter(
          (a) => a.address_id !== shop_profile.shop_address_id
        );
      }
    }

    // 🧹 Chỉ giữ lại 1 địa chỉ mặc định (is_primary = true)
    // Nếu không có, fallback lấy địa chỉ đầu tiên
    let primaryAddresses = addresses.filter((a) => a.is_primary);
    if (primaryAddresses.length === 0 && addresses.length > 0) {
      primaryAddresses = [addresses[0]];
    } else if (primaryAddresses.length > 1) {
      primaryAddresses = [primaryAddresses[0]];
    }
    addresses = primaryAddresses;

    let ongoing_role = "user";
    
    const { password, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      user: { ...safeUser, addresses, shop_profile },
      ongoing_role,
    });
  } catch (error) {
    console.error("⚠️ Lỗi getCurrentUser:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin người dùng.",
    });
  }
};

/**
 * 📌 Cập nhật thông tin user hiện tại (User + Shop + Address)
 */
const updateCurrentUser = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
      });
    }

    const userId = sessionUser.id;
    const { username, fullname, email, phone, address, shop_profile } = req.body;

    // 🧱 Chuẩn hoá dữ liệu user cơ bản
    const updatePayload = {};
    if (username) updatePayload.username = username.trim();
    if (fullname) updatePayload.full_name = fullname.trim();
    if (email) updatePayload.email = email.trim();

    if (phone) {
      let normalizedPhone = phone.trim();
      if (normalizedPhone.startsWith("0")) {
        normalizedPhone = "+84" + normalizedPhone.slice(1);
      } else if (!normalizedPhone.startsWith("+84")) {
        normalizedPhone = "+84" + normalizedPhone;
      }
      updatePayload.phone = normalizedPhone;
    }

    // 🔄 Cập nhật bảng users
    if (Object.keys(updatePayload).length > 0) {
      await userService.updateUser(userId, updatePayload);
    }

    // 🏪 Nếu user là shop → xử lý cập nhật shop_profile
    if (sessionUser.role === "shop" && shop_profile) {
      const currentShop = await shopProfileService.getShopByUserId(userId);
      if (currentShop) {
        const shopId =
          currentShop.shop_profile_id || currentShop.id || currentShop.shop_id;

        const updateShopData = {
          shop_name: shop_profile.shop_name || currentShop.shop_name,
          description: shop_profile.description || currentShop.description,
          open_hours: shop_profile.open_hours || currentShop.open_hours,
          closed_hours: shop_profile.closed_hours || currentShop.closed_hours,
        };

        await shopProfileService.updateShopInfo(shopId, updateShopData);

        // ✅ Cập nhật hoặc tạo địa chỉ shop
        if (shop_profile.address && typeof shop_profile.address === "object") {
          const { address_id, address_line, note, address_type, is_primary } =
            shop_profile.address;

          const normalizedAddress = {
            address_line: {
              detail: address_line?.detail || "",
              ward: address_line?.ward || "",
              district: address_line?.district || "",
              city: address_line?.city || "",
            },
            note: note || "",
            address_type: address_type || "Cửa hàng",
          };

          let shopAddress;
          if (address_id) {
            // 🧩 Nếu có ID → UPDATE
            shopAddress = await addressService.updateAddress(
              address_id,
              normalizedAddress
            );
            console.log(`[DEBUG] ✅ Cập nhật địa chỉ shop ID=${address_id}`);
          } else {
            // 🆕 Nếu chưa có → CREATE
            shopAddress = await addressService.createAddressForUser(
              userId,
              normalizedAddress,
              is_primary ?? false
            );
            console.log(
              `[DEBUG] ✅ Tạo mới địa chỉ shop ID=${shopAddress.address_id}`
            );
          }

          // Gán vào shop_profile
          await shopProfileService.assignAddressToShop(
            shopId,
            shopAddress.address_id
          );
        }
      }
    }

    // 🏡 Nếu có địa chỉ user → xử lý cập nhật hoặc tạo mới
    if (address && typeof address === "object") {
      const { address_id, address_line, note, address_type, is_primary } =
        address;

      const normalizedAddress = {
        address_line: {
          detail: address_line?.detail || "",
          ward: address_line?.ward || "",
          district: address_line?.district || "",
          city: address_line?.city || "",
        },
        note: note || "",
        address_type: address_type || "Nhà",
        is_primary: is_primary ?? true,
      };

      if (address_id) {
        // 🧩 UPDATE địa chỉ user
        await addressService.updateAddress(address_id, normalizedAddress);
        console.log(`[DEBUG] ✅ Cập nhật địa chỉ user ID=${address_id}`);
      } else {
        // 🆕 CREATE mới nếu chưa có
        const newAddr = await addressService.createAddressForUser(
          userId,
          normalizedAddress,
          normalizedAddress.is_primary
        );
        console.log(`[DEBUG] ✅ Tạo mới địa chỉ user ID=${newAddr.address_id}`);
      }
    }

    // 🔁 Reload lại user sau cập nhật
    const reloadedUser = await userService.getUserById(userId);
    const normalizedAddresses = await addressService.getNormalizedUserAddresses(userId);
    reloadedUser.addresses = normalizedAddresses;

    req.session.user = reloadedUser;
    await req.session.save();

    return res.status(200).json({
      success: true,
      message: "✅ Hồ sơ đã được cập nhật thành công!",
      user: reloadedUser,
    });
  } catch (error) {
    console.error("❌ [ERROR] updateCurrentUser:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật hồ sơ người dùng.",
      error: error.message,
    });
  }
};

/**
 * 📌 Xoá tài khoản user hiện tại
 */
const deleteCurrentUser = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
      });
    }

    const deletedUser = await userService.deleteUser(sessionUser.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "❌ Không tìm thấy người dùng để xoá.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Tài khoản đã được xoá thành công.",
    });
  } catch (error) {
    console.error("⚠️ Lỗi deleteCurrentUser:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xoá người dùng.",
    });
  }
};

/**
 * 📌 Khoá tài khoản user hiện tại
 */
const lockCurrentUser = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
      });
    }

    const lockedUser = await userService.lockUserAccount(sessionUser.id);
    if (!lockedUser) {
      return res.status(404).json({
        success: false,
        message: "❌ Không tìm thấy người dùng để khoá.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "🔐 Tài khoản đã bị khoá thành công.",
      user: lockedUser,
    });
  } catch (error) {
    console.error("⚠️ Lỗi lockCurrentUser:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi khoá tài khoản.",
    });
  }
};

/**
 * 📌 Tìm người dùng theo username/email/phone
 */
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "❌ Không tìm thấy người dùng với username này!",
      });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByUsername:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm người dùng theo username.",
    });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "❌ Không tìm thấy người dùng với email này!",
      });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByEmail:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm người dùng theo email.",
    });
  }
};

const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await userService.getUserByPhone(phone);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "❌ Không tìm thấy người dùng với số điện thoại này!",
      });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByPhone:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm người dùng theo số điện thoại.",
    });
  }
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  lockCurrentUser,
  getUserByUsername,
  getUserByEmail,
  getUserByPhone,
};
