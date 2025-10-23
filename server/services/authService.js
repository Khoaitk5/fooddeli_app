const bcrypt = require("bcrypt");
const userDao = require("../dao/userDao");
const addressService = require("../services/addressService");

/**
 * @module AuthService
 * @description Xử lý logic đăng nhập và đăng ký tài khoản người dùng
 */
const AuthService = {
  /**
   * @async
   * @function login
   * @description Đăng nhập bằng số điện thoại/email và mật khẩu
   */
  async login(identifier, password) {
    // ✅ Try to find user by phone or email
    let user = await userDao.findByPhone(identifier);
    
    // If not found by phone, try email
    if (!user) {
      const allUsers = await userDao.findAll();
      user = allUsers.find((u) => u.email === identifier);
    }
    
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  },

  /**
   * @async
   * @function register
   * @description Đăng ký người dùng mới và tạo địa chỉ mặc định nếu có
   */
  async register(userData) {
    const {
      username,
      fullname,
      password,
      phone,
      email,
      role = "user",
      address_line, // ✅ lấy trực tiếp từ Controller (đã chuẩn hóa)
      note,
      address_type,
      is_primary,
    } = userData;

    if (!password) throw new Error("Mật khẩu là bắt buộc");
    if (!phone && !email)
      throw new Error("Phải cung cấp ít nhất số điện thoại hoặc email");

    // 🔍 Kiểm tra username, phone, email trùng lặp
    if (username) {
      const existingUsername = await userDao.findByUsername(username);
      if (existingUsername) throw new Error("Tên đăng nhập đã tồn tại");
    }

    if (phone) {
      const existingPhone = await userDao.findByPhone(phone);
      if (existingPhone) throw new Error("Số điện thoại đã được sử dụng");
    }

    if (email) {
      const allUsers = await userDao.findAll();
      const emailExists = allUsers.find((u) => u.email === email);
      if (emailExists) throw new Error("Email đã được sử dụng");
    }

    // 🔐 Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧱 Tạo user mới
    const newUser = await userDao.create({
      username,
      full_name: fullname,
      password: hashedPassword,
      phone: phone || null,
      email: email || null,
      role,
      status: "active",
    });

    // 🏡 Nếu có địa chỉ (address_line) được gửi từ FE
    if (address_line && typeof address_line === "object") {
      console.log("📦 [AuthService] Nhận address_line từ FE:", address_line);

      const addr = await addressService.createAddressForUser(
        newUser.id,
        {
          address_line, // ✅ truyền đúng key
          note: note ?? "",
          address_type: address_type ?? "Nhà",
        },
        is_primary ?? true
      );

      console.log("✅ [AuthService] Address tạo thành công:", addr);
      newUser.address = addr.address_line;
    } else {
      console.log("ℹ️ [AuthService] Không có address_line trong payload.");
    }

    newUser.fullname = fullname;
    return newUser;
  },
};

module.exports = AuthService;
