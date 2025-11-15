const bcrypt = require("bcrypt");
const userDao = require("../dao/userDao");
const addressService = require("../services/addressService");
const fetch = require("node-fetch");

/**
 * Helper function to geocode address using Map4D API
 */
async function geocodeAddress(fullAddress) {
  try {
    const MAP4D_KEY = process.env.MAP4D_API_KEY || '62b853a87d7eec55f5f37dfd215a6e85';
    const url = `https://api.map4d.vn/sdk/v2/geocode?key=${MAP4D_KEY}&address=${encodeURIComponent(fullAddress)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data?.result && data.result.length > 0) {
      const location = data.result[0].location;
      if (location && location.lat && location.lng) {
        return {
          lat: location.lat,
          lon: location.lng
        };
      }
    }
    return null;
  } catch (error) {
    console.warn('⚠️ Geocode error:', error.message);
    return null;
  }
}

/**
 * @module AuthService
 * @description Xử lý logic đăng nhập, đăng ký và xác thực người dùng
 */
const AuthService = {
  /**
   * @async
   * @function login
   * @description Đăng nhập bằng số điện thoại và mật khẩu
   */
  async login(phone, password) {
    const user = await userDao.findByPhone(phone);
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

      // 🗺️ Gọi Map4D Geocode API để lấy tọa độ
      let lat_lon = null;
      try {
        const { detail, ward, city, province } = address_line;
        const fullAddress = `${detail || ''}, ${ward || ''}, ${city || province || ''}`.trim();
        
        if (fullAddress) {
          console.log('🌍 [AuthService] Geocoding address:', fullAddress);
          lat_lon = await geocodeAddress(fullAddress);
          if (lat_lon) {
            console.log('✅ [AuthService] Got coordinates:', lat_lon);
          }
        }
      } catch (geocodeErr) {
        console.warn('⚠️ [AuthService] Geocode error, continuing without coordinates:', geocodeErr.message);
      }

      const addr = await addressService.createAddressForUser(
        newUser.id,
        {
          address_line, // ✅ truyền đúng key
          lat_lon,
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

  /**
   * @async
   * @function changePassword
   * @description Đổi mật khẩu người dùng (dùng trong Profile)
   * @param {number} userId - ID người dùng
   * @param {string} oldPassword - Mật khẩu hiện tại
   * @param {string} newPassword - Mật khẩu mới
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await userDao.findById(userId);
    if (!user) throw new Error("Không tìm thấy người dùng.");

    // So sánh mật khẩu cũ bằng bcrypt
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("❌ Mật khẩu cũ không chính xác.");

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userDao.updateById(userId, { password: hashedNewPassword });

    return true;
  },
};

module.exports = AuthService;
