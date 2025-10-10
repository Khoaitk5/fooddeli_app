const userService = require("../services/userService");
const addressService = require("../services/addressService");

// 📌 Lấy toàn bộ người dùng (chỉ nên dùng cho admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("⚠️ Lỗi getAllUsers:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Lỗi server khi lấy danh sách người dùng.",
      });
  }
};

// 📌 Lấy thông tin user hiện tại từ session
const getCurrentUser = async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    // console.log("📥 Cookie gửi lên:", req.headers.cookie);
    // console.log("📥 Toàn bộ session server lưu:", req.sessionStore.sessions);
    // console.log("📥 Session hiện tại tìm thấy:", req.session);

    if (!sessionUser) {
      return res
        .status(401)
        .json({
          success: false,
          message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
        });
    }

    const user = await userService.getUserById(sessionUser.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Không tìm thấy người dùng." });
    }

    const { password, ...safeUser } = user; // xoá password nếu có
    return res.status(200).json({ success: true, user: safeUser });
  } catch (error) {
    console.error("⚠️ Lỗi getCurrentUser:", error);
    return res
      .status(500)
      .json({
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

    // 🧩 Chuẩn hóa dữ liệu người dùng để phù hợp DB
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

    // 🔄 Nếu có thông tin cần cập nhật → cập nhật user trong DB
    let updatedUser = await userService.getUserById(userId);
    if (Object.keys(updatePayload).length > 0) {
      updatedUser = await userService.updateUser(userId, updatePayload);
    }

    // 🏡 Xử lý địa chỉ nếu có FE gửi lên
    let addedAddress = null;
    if (address) {
      // 🧩 FE gửi object có dạng { detail, ward, city, note, address_type, isDefault }
      const addressLine =
        typeof address === "object"
          ? `${address.detail || ""}${
              address.ward || address.city ? ", " : ""
            }${address.ward || ""}${
              address.ward && address.city ? ", " : ""
            }${address.city || ""}`
          : address;

      const note = address.note || "";
      const addressType = address.addressType || address.address_type || "Nhà";
      const isDefault = address.isDefault ?? true;

      // 📬 Kiểm tra địa chỉ hiện có
      const existingAddresses = await addressService.getUserAddresses(userId);
      const defaultAddr = await addressService.getDefaultAddress(userId);

      if (!existingAddresses.length) {
        // 🆕 User chưa có địa chỉ → tạo mới
        addedAddress = await addressService.addAddress({
          user_id: userId,
          address_line: addressLine,
          note,
          address_type: addressType,
          is_default: isDefault,
        });
      } else if (defaultAddr) {
        // 🔄 Đã có default → cập nhật lại
        addedAddress = await addressService.updateAddress(defaultAddr.address_id, {
          address_line: addressLine,
          note,
          address_type: addressType,
          is_default: isDefault,
        });
      } else {
        // 🆕 Có địa chỉ nhưng chưa có default → thêm mới và đặt mặc định
        addedAddress = await addressService.addAddress({
          user_id: userId,
          address_line: addressLine,
          note,
          address_type: addressType,
          is_default: true,
        });
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
        address: addedAddress
          ? {
              address_line: addedAddress.address_line,
              note: addedAddress.note,
              address_type: addedAddress.address_type,
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
      return res
        .status(401)
        .json({
          success: false,
          message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
        });
    }

    const deletedUser = await userService.deleteUser(sessionUser.id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({
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
      return res
        .status(401)
        .json({
          success: false,
          message: "❌ Chưa đăng nhập hoặc session đã hết hạn.",
        });
    }

    const lockedUser = await userService.lockUserAccount(sessionUser.id);
    if (!lockedUser) {
      return res
        .status(404)
        .json({
          success: false,
          message: "❌ Không tìm thấy người dùng để khoá.",
        });
    }

    return res
      .status(200)
      .json({
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
      return res
        .status(404)
        .json({
          success: false,
          message: "❌ Không tìm thấy người dùng với username này!",
        });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByUsername:", error);
    return res
      .status(500)
      .json({
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
      return res
        .status(404)
        .json({
          success: false,
          message: "❌ Không tìm thấy người dùng với email này!",
        });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByEmail:", error);
    return res
      .status(500)
      .json({
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
      return res
        .status(404)
        .json({
          success: false,
          message: "❌ Không tìm thấy người dùng với số điện thoại này!",
        });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("⚠️ Lỗi getUserByPhone:", error);
    return res
      .status(500)
      .json({
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
