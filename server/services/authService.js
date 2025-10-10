const bcrypt = require("bcrypt");
const userDao = require("../dao/userDao");
const addressService = require("../services/addressService"); // ✅ service tạo địa chỉ
const userAddressService = require("../services/user_addressService"); // ✅ service liên kết user - address

/**
 * @module AuthService
 * @description Xử lý logic đăng nhập và đăng ký tài khoản người dùng
 */
const AuthService = {
  /**
   * @async
   * @function login
   * @description Đăng nhập bằng số điện thoại và mật khẩu
   * @param {string} phone - Số điện thoại người dùng
   * @param {string} password - Mật khẩu nhập vào
   * @returns {Promise<object|null>} - User nếu thành công, null nếu thất bại
   */
  async login(phone, password) {
    // 🔎 1️⃣ Tìm user theo số điện thoại
    const user = await userDao.findByPhone(phone);
    if (!user) return null;

    // 🔐 2️⃣ So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // ✅ 3️⃣ Thành công
    return user;
  },

  /**
   * @async
   * @function register
   * @description Đăng ký người dùng mới và tạo địa chỉ mặc định nếu có
   * @param {object} userData - Thông tin đăng ký (username, password, phone, email, fullname, address, role)
   * @returns {Promise<object>} - Người dùng vừa được tạo
   */
  async register(userData) {
    const {
      username,
      fullname, // FE gửi là fullname (camelCase)
      password,
      phone,
      email,
      address,
      role = "user",
    } = userData;

    // 📌 1️⃣ Kiểm tra dữ liệu đầu vào
    if (!password) throw new Error("Mật khẩu là bắt buộc");
    if (!phone && !email)
      throw new Error("Phải cung cấp ít nhất số điện thoại hoặc email");

    // 📌 2️⃣ Kiểm tra trùng username
    if (username) {
      const existingUsername = await userDao.findByUsername(username);
      if (existingUsername) throw new Error("Tên đăng nhập đã tồn tại");
    }

    // 📌 3️⃣ Kiểm tra trùng số điện thoại
    if (phone) {
      const existingPhone = await userDao.findByPhone(phone);
      if (existingPhone) throw new Error("Số điện thoại đã được sử dụng");
    }

    // 📌 4️⃣ Kiểm tra trùng email (nếu muốn hỗ trợ tìm email, nên thêm hàm findByEmail trong userDao)
    if (email) {
      const existingEmail = await userDao.findAll();
      const emailExists = existingEmail.find((u) => u.email === email);
      if (emailExists) throw new Error("Email đã được sử dụng");
    }

    // 🔐 5️⃣ Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📦 6️⃣ Tạo user mới
    const newUser = await userDao.create({
      username,
      full_name: fullname,
      password: hashedPassword,
      phone: phone || null,
      email: email || null,
      role,
      status: "active",
    });

    // 🏡 7️⃣ Nếu có địa chỉ — tạo địa chỉ và gán cho user
    if (address) {
      const addr = await addressService.createAddressForUser(newUser.id, {
        street: address, // dùng cột `street` trong bảng addresses
        note: "",
        city: "",
        province: "",
      }, true); // đặt làm địa chỉ chính

      // 📌 Gán lại cho newUser để trả ra FE
      newUser.address = addr.street;
    }

    // 📌 Gán lại fullname (FE mong đợi key này)
    newUser.fullname = fullname;

    return newUser;
  },
};

module.exports = AuthService;
