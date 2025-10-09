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
    console.log("📥 Cookie gửi lên:", req.headers.cookie);
    console.log("📥 Toàn bộ session server lưu:", req.sessionStore.sessions);
    console.log("📥 Session hiện tại tìm thấy:", req.session);

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

    // FE gửi: fullname (camelCase)
    const { username, fullname, email, phone, address } = req.body;

    // 🧩 Chuẩn hóa dữ liệu để phù hợp với DB
    const updatePayload = {};
    if (username) updatePayload.username = username;
    if (fullname) updatePayload.full_name = fullname; // ánh xạ sang snake_case
    if (email) updatePayload.email = email;
    if (phone) updatePayload.phone = phone;

    // 🛡️ Nếu không có trường nào để cập nhật, thì không cần query DB
    let updatedUser = await userService.getUserById(userId);
    if (Object.keys(updatePayload).length > 0) {
      updatedUser = await userService.updateUser(userId, updatePayload);
    }

    // 2️⃣ Nếu có địa chỉ mới → kiểm tra xem user đã có địa chỉ chưa
    let addedAddress = null;
    if (address) {
      const addressLine =
        typeof address === "object"
          ? `${address.detail || ""}${
              address.ward || address.city ? ", " : ""
            }${address.ward || ""}${
              address.ward && address.city ? ", " : ""
            }${address.city || ""}`
          : address;

      const existingAddresses = await addressService.getUserAddresses(userId);

      if (existingAddresses.length === 0) {
        // 🆕 user chưa có địa chỉ → thêm mới mặc định
        addedAddress = await addressService.addAddress({
          user_id: userId,
          address_line: addressLine,
          is_default: true,
        });
      } else {
        // 🔄 Nếu đã có → update địa chỉ mặc định hiện tại
        const defaultAddr = await addressService.getDefaultAddress(userId);
        if (defaultAddr) {
          addedAddress = await addressService.updateAddress(defaultAddr.address_id, {
            address_line: addressLine,
          });
        } else {
          addedAddress = await addressService.addAddress({
            user_id: userId,
            address_line: addressLine,
            is_default: true,
          });
        }
      }
    }

    // 3️⃣ Cập nhật lại session
    req.session.user = updatedUser;
    req.session.save();

    // 4️⃣ Trả kết quả cho FE
    return res.status(200).json({
      success: true,
      message: "✅ Hồ sơ đã hoàn tất!",
      user: {
        ...updatedUser,
        address: addedAddress ? addedAddress.address_line : null,
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
