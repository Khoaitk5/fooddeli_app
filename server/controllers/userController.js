const userService = require("../services/userService");
const addressService = require("../services/addressService");

// 📌 Lấy toàn bộ người dùng (chỉ nên dùng cho admin)
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

// 📌 Lấy thông tin user hiện tại từ session
const getCurrentUser = async (req, res) => {
  console.log("[DEBUG] >>> Bắt đầu getCurrentUser()");
  try {
    const sessionUser = req.session?.user;
    console.log("[DEBUG] sessionUser =", sessionUser);

    // 🧭 Kiểm tra đăng nhập
    if (!sessionUser) {
      console.warn("[DEBUG] Không có sessionUser → trả 401");
      return res.status(401).json({
        success: false,
        message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
      });
    }

    // 🔍 Lấy thông tin người dùng (đã bao gồm shop_profile nếu có)
    const user = await userService.getUserById(sessionUser.id);
    console.log("[DEBUG] userService.getUserById() =", user);

    if (!user) {
      console.warn("[DEBUG] Không tìm thấy user → trả 404");
      return res.status(404).json({
        success: false,
        message: "❌ Không tìm thấy người dùng.",
      });
    }

    // 🏡 Lấy toàn bộ địa chỉ của user
    const addresses = await addressService.getNormalizedUserAddresses(user.id);
    console.log("[DEBUG] addresses =", addresses);

    // 🏪 Nếu là shop → lấy shop_profile đã có sẵn trong user
    let shop_profile = null;
    if (user.role === "shop" && user.shop_profile) {
      console.log("[DEBUG] User có role = shop, bắt đầu xử lý shop_profile");
      shop_profile = user.shop_profile;

      // 🏠 Gắn thêm thông tin địa chỉ cho shop nếu có
      if (shop_profile.shop_address_id) {
        console.log("[DEBUG] shop_profile.shop_address_id =", shop_profile.shop_address_id);
        try {
          const shopAddress = await addressService.getAddressById(
            shop_profile.shop_address_id
          );
          console.log("[DEBUG] shopAddress =", shopAddress);
          shop_profile = { ...shop_profile, address: shopAddress };
        } catch (err) {
          console.warn("[DEBUG] Không thể lấy địa chỉ shop:", err.message);
          shop_profile = { ...shop_profile, address: null };
        }
      } else {
        console.warn("[DEBUG] shop_profile không có shop_address_id");
      }
    } else {
      console.log("[DEBUG] User không phải shop hoặc chưa có shop_profile");
    }

    // 🚫 Xoá password khỏi kết quả
    const { password, ...safeUser } = user;

    // ✅ Trả kết quả về FE
    console.log("[DEBUG] >>> Hoàn tất getCurrentUser(), trả về dữ liệu thành công.");
    return res.status(200).json({
      success: true,
      user: {
        ...safeUser,
        addresses,
        shop_profile,
      },
    });
  } catch (error) {
    console.error("⚠️ Lỗi getCurrentUser:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin người dùng.",
    });
  }
};

// 📌 Cập nhật thông tin user hiện tại
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
    const { username, fullname, email, phone, address } = req.body;

    // 🧩 Chuẩn hóa dữ liệu người dùng
    const updatePayload = {};

    if (username) updatePayload.username = username.trim();
    if (fullname) updatePayload.full_name = fullname.trim();
    if (email) updatePayload.email = email.trim();

    // ☎️ Chuẩn hóa số điện thoại về dạng +84
    if (phone) {
      let normalizedPhone = phone.trim();
      if (normalizedPhone.startsWith("0")) {
        normalizedPhone = "+84" + normalizedPhone.slice(1);
      } else if (!normalizedPhone.startsWith("+84")) {
        normalizedPhone = "+84" + normalizedPhone;
      }
      updatePayload.phone = normalizedPhone;
    }

    // 🔄 Cập nhật thông tin user cơ bản
    let updatedUser = await userService.getUserById(userId);
    if (Object.keys(updatePayload).length > 0) {
      updatedUser = await userService.updateUser(userId, updatePayload);
    }

    // 🏡 Xử lý địa chỉ nếu FE gửi lên
    let updatedAddress = null;
    if (address && typeof address === "object") {
      const { address_line, note, addressType, address_type, is_primary } = address;

      // ✅ Chuẩn hoá address_line dạng object
      let normalizedAddressLine;
      if (typeof address_line === "object" && address_line !== null) {
        const { detail, ward, district, city } = address_line;
        normalizedAddressLine = {
          detail: detail || "",
          ward: ward || "",
          district: district || "",
          city: city || "",
        };
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

      // 📬 Kiểm tra địa chỉ hiện có
      const existingAddresses = await addressService.getUserAddresses(userId);
      const defaultAddr = await addressService.getDefaultAddress(userId);

      if (!existingAddresses.length) {
        // 🆕 User chưa có địa chỉ → tạo mới
        updatedAddress = await addressService.createAddressForUser(
          userId,
          {
            address_line: normalizedAddressLine,
            note: noteValue,
            address_type: addrType,
          },
          isPrimary
        );
      } else if (defaultAddr) {
        // 🔄 Đã có default → cập nhật lại
        updatedAddress = await addressService.updateAddress(defaultAddr.address_id, {
          address_line: normalizedAddressLine,
          note: noteValue,
          address_type: addrType,
          is_default: isPrimary,
        });
      } else {
        // 🆕 Có địa chỉ nhưng chưa có default → thêm mới và đặt mặc định
        updatedAddress = await addressService.createAddressForUser(
          userId,
          {
            address_line: normalizedAddressLine,
            note: noteValue,
            address_type: addrType,
          },
          true
        );
      }
    }

    // 🔁 Cập nhật lại session
    req.session.user = updatedUser;
    await req.session.save();

    // ✅ Trả kết quả về FE
    return res.status(200).json({
      success: true,
      message: "✅ Hồ sơ đã được cập nhật thành công!",
      user: {
        ...updatedUser,
        address: updatedAddress
          ? {
              address_line:
                typeof updatedAddress.address_line === "string"
                  ? JSON.parse(updatedAddress.address_line)
                  : updatedAddress.address_line,
              note: updatedAddress.note,
              address_type: updatedAddress.address_type,
              is_default: updatedAddress.is_primary,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("⚠️ Lỗi updateCurrentUser:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi hoàn tất hồ sơ người dùng.",
    });
  }
};

// 📌 Xoá tài khoản user hiện tại
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

    return res
      .status(200)
      .json({ success: true, message: "✅ Tài khoản đã được xoá thành công." });
  } catch (error) {
    console.error("⚠️ Lỗi deleteCurrentUser:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xoá người dùng." });
  }
};

// 📌 Khoá tài khoản user hiện tại
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
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server khi khoá tài khoản." });
  }
};

// 📌 Tìm người dùng theo username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "❌ Không tìm thấy người dùng với username này!",
      });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByUsername:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm người dùng theo username.",
    });
  }
};

// 📌 Tìm người dùng theo email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "❌ Không tìm thấy người dùng với email này!",
      });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByEmail:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm người dùng theo email.",
    });
  }
};

// 📌 Tìm người dùng theo số điện thoại
const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await userService.getUserByPhone(phone);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "❌ Không tìm thấy người dùng với số điện thoại này!",
      });
    }
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
