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

    const addresses = await addressService.getNormalizedUserAddresses(user.id);
    let shop_profile = null;

    if (user.role === "shop" && user.shop_profile) {
      shop_profile = user.shop_profile;
      if (shop_profile.shop_address_id) {
        try {
          const shopAddress = await addressService.getAddressById(
            shop_profile.shop_address_id
          );
          shop_profile = { ...shop_profile, address: shopAddress };
        } catch {
          shop_profile = { ...shop_profile, address: null };
        }
      }
    }

    const { password, ...safeUser } = user;
    return res.status(200).json({
      success: true,
      user: { ...safeUser, addresses, shop_profile },
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
  console.log("[DEBUG] >>> Hàm updateCurrentUser() được gọi!");
  console.log("[DEBUG] req.body:", req.body);
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

    console.log("[DEBUG] === BẮT ĐẦU UPDATE USER ===");
    console.log("[DEBUG] req.body:", JSON.stringify(req.body, null, 2));

    // 🧩 Chuẩn hóa dữ liệu user
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

    console.log("[DEBUG] updatePayload (users):", updatePayload);

    // 🔄 Cập nhật bảng users
    if (Object.keys(updatePayload).length > 0) {
      console.log("[DEBUG] → Gọi userService.updateUser()");
      await userService.updateUser(userId, updatePayload);
    }

    // 🏪 Nếu user là shop → cập nhật thông tin cửa hàng
    if (sessionUser.role === "shop" && shop_profile) {
      console.log("[DEBUG] → Bắt đầu cập nhật shop_profile cho user_id:", userId);

      const currentShop = await shopProfileService.getShopByUserId(userId);
      if (currentShop) {
        const shopId =
          currentShop.shop_profile_id || currentShop.id || currentShop.shop_id;

        console.log(`[DEBUG] Found shopProfile ID=${shopId}`);

        // Cập nhật thông tin cơ bản
        const updateShopData = {
          shop_name: shop_profile.shop_name || currentShop.shop_name,
          description: shop_profile.description || currentShop.description,
          open_hours: shop_profile.open_hours || currentShop.open_hours,
          closed_hours: shop_profile.closed_hours || currentShop.closed_hours,
        };
        console.log("[DEBUG] updateShopData:", updateShopData);

        const updatedShop = await shopProfileService.updateShopInfo(shopId, updateShopData);
        console.log("[DEBUG] Shop cập nhật xong:", updatedShop);

        // ✅ Nếu có address object được gửi từ frontend → tạo và gán vào shop
        if (shop_profile.address && typeof shop_profile.address === "object") {
          console.log("[DEBUG] → Đang xử lý shop_profile.address");
          const { address_line, note, address_type, is_primary } = shop_profile.address;
          const normalizedAddressLine = {
            detail: address_line?.detail || "",
            ward: address_line?.ward || "",
            district: address_line?.district || "",
            city: address_line?.city || "",
          };

          console.log("[DEBUG] normalizedAddressLine:", normalizedAddressLine);

          const newShopAddress = await addressService.createAddressForUser(
            userId,
            {
              address_line: normalizedAddressLine,
              note: note || "",
              address_type: address_type || "Cửa hàng",
            },
            is_primary ?? false
          );

          console.log("[DEBUG] Đã tạo địa chỉ mới:", newShopAddress);

          await shopProfileService.assignAddressToShop(
            shopId,
            newShopAddress.address_id
          );

          console.log(`[DEBUG] ✅ Đã gán địa chỉ ${newShopAddress.address_id} cho cửa hàng ${shopId}`);
        }

        // Nếu chỉ có address_id được gửi lên (địa chỉ đã có sẵn)
        else if (shop_profile.address_id) {
          console.log(`[DEBUG] → Gán địa chỉ có sẵn ID=${shop_profile.address_id} cho shop`);
          await shopProfileService.assignAddressToShop(
            shopId,
            shop_profile.address_id
          );
        } else {
          console.log("[DEBUG] → Không có address hoặc address_id trong shop_profile.");
        }
      } else {
        console.warn(`⚠️ Không tìm thấy shop_profile cho user_id=${userId}`);
      }
    } else {
      console.log("[DEBUG] → User không có role 'shop' hoặc không gửi shop_profile");
    }

    // 🏡 Nếu có địa chỉ user mới → xử lý update
    let updatedAddress = null;
    if (address && typeof address === "object") {
      console.log("[DEBUG] → Đang xử lý địa chỉ user:", address);

      const { address_line, note, addressType, address_type, is_primary } = address;
      let normalizedAddressLine;

      if (typeof address_line === "object" && address_line !== null) {
        const { detail, ward, district, city } = address_line;
        normalizedAddressLine = { detail, ward, district, city };
      } else {
        normalizedAddressLine = {
          detail: address_line || "",
          ward: "",
          district: "",
          city: "",
        };
      }

      const noteValue = note || "";
      const addrType = addressType || address_type || "Nhà";
      const isPrimary = is_primary ?? true;

      console.log("[DEBUG] normalizedAddressLine (user):", normalizedAddressLine);

      const existingAddresses = await addressService.getUserAddresses(userId);
      const defaultAddr = await addressService.getDefaultAddress(userId);

      console.log(`[DEBUG] User hiện có ${existingAddresses.length} địa chỉ.`);
      if (!existingAddresses.length) {
        console.log("[DEBUG] → Tạo địa chỉ đầu tiên cho user.");
        updatedAddress = await addressService.createAddressForUser(
          userId,
          { address_line: normalizedAddressLine, note: noteValue, address_type: addrType },
          isPrimary
        );
      } else if (defaultAddr) {
        console.log(`[DEBUG] → Cập nhật địa chỉ mặc định ID=${defaultAddr.address_id}`);
        updatedAddress = await addressService.updateAddress(defaultAddr.address_id, {
          address_line: normalizedAddressLine,
          note: noteValue,
          address_type: addrType,
          is_default: isPrimary,
        });
      } else {
        console.log("[DEBUG] → Tạo địa chỉ mới khác cho user.");
        updatedAddress = await addressService.createAddressForUser(
          userId,
          { address_line: normalizedAddressLine, note: noteValue, address_type: addrType },
          true
        );
      }
      console.log("[DEBUG] updatedAddress:", updatedAddress);
    }

    // 🔁 Reload lại user đầy đủ (bao gồm shop_profile và addresses)
    console.log("[DEBUG] → Reload lại user và địa chỉ sau khi cập nhật...");
    await new Promise((r) => setTimeout(r, 200)); // đợi DB commit
    const reloadedUser = await userService.getUserById(userId);
    const normalizedAddresses = await addressService.getNormalizedUserAddresses(userId);
    reloadedUser.addresses = normalizedAddresses;

    console.log("[DEBUG] ✅ Dữ liệu user sau update:", JSON.stringify(reloadedUser, null, 2));

    // 🔁 Cập nhật session
    req.session.user = reloadedUser;
    await req.session.save();

    console.log("[DEBUG] ✅ Session đã được cập nhật!");

    // ✅ Trả về kết quả
    return res.status(200).json({
      success: true,
      message: "✅ Hồ sơ đã được cập nhật thành công!",
      user: reloadedUser,
    });
  } catch (error) {
    console.error("❌ [ERROR] updateCurrentUser:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi hoàn tất hồ sơ người dùng.",
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
