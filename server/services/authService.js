// services/authService.js
const bcrypt = require("bcrypt");
const userDao = require("../dao/userDao");

exports.login = async (phone, password) => {
  // 🔎 Tìm user theo số điện thoại
  const user = await userDao.findByPhone(phone);
  if (!user) return null; // ❌ Không tồn tại user với số điện thoại này

  // 🔐 So sánh password nhập vào với password hash trong DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null; // ❌ Sai mật khẩu

  // ✅ Thành công → trả về thông tin user
  return user;
};

exports.register = async (userData) => {
  const {
    username,
    full_name,
    password,
    phone,
    email,
    address,
    role = "user",
  } = userData;

  // 📌 Kiểm tra: phải có ít nhất 1 trong 2 trường: phone hoặc email
  if (!phone && !email) {
    throw new Error("Phải cung cấp ít nhất số điện thoại hoặc email");
  }

  // 📌 Kiểm tra trùng username
  if (username) {
    const existingUsername = await userDao.findByUsername(username);
    if (existingUsername) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }
  }

  // 📌 Kiểm tra trùng số điện thoại nếu có nhập
  if (phone) {
    const existingPhone = await userDao.findByPhone(phone);
    if (existingPhone) {
      throw new Error("Số điện thoại đã được sử dụng");
    }
  }

  // 📌 Kiểm tra trùng email nếu có nhập
  if (email) {
    const existingEmail = await userDao.findByEmail(email);
    if (existingEmail) {
      throw new Error("Email đã được sử dụng");
    }
  }

  // 🔐 Hash mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);

  // 📦 Tạo user mới trong DB
  const newUser = await userDao.create({
    username,
    full_name,
    password: hashedPassword,
    phone: phone || null,
    email: email || null,
    address: address || null,
    role,
  });

  return newUser;
};
