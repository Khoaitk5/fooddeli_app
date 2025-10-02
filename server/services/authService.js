const bcrypt = require("bcrypt");
const userDao = require("../dao/userDao");
const addressDao = require("../dao/addressDao"); // ✅ thêm dao địa chỉ

exports.login = async (phone, password) => {
  // 🔎 Tìm user theo số điện thoại
  const user = await userDao.findByPhone(phone);
  if (!user) return null;

  // 🔐 So sánh password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user; // ✅ Thành công
};

exports.register = async (userData) => {
  const { username, full_name, password, phone, email, address, role = "user" } = userData;

  // 📌 Kiểm tra: phải có ít nhất 1 trong 2 trường: phone hoặc email
  if (!phone && !email) {
    throw new Error("Phải cung cấp ít nhất số điện thoại hoặc email");
  }

  // 📌 Kiểm tra trùng username
  if (username) {
    const existingUsername = await userDao.findByUsername(username);
    if (existingUsername) throw new Error("Tên đăng nhập đã tồn tại");
  }

  // 📌 Kiểm tra trùng số điện thoại
  if (phone) {
    const existingPhone = await userDao.findByPhone(phone);
    if (existingPhone) throw new Error("Số điện thoại đã được sử dụng");
  }

  // 📌 Kiểm tra trùng email
  if (email) {
    const existingEmail = await userDao.findByEmail(email);
    if (existingEmail) throw new Error("Email đã được sử dụng");
  }

  // 🔐 Hash mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);

  // 📦 1️⃣ Tạo user mới trong DB
  const newUser = await userDao.create({
    username,
    full_name,
    password: hashedPassword,
    phone: phone || null,
    email: email || null,
    role,
    status: "active",
  });

  // 🏡 2️⃣ Nếu có nhập địa chỉ -> tạo luôn địa chỉ mặc định
  if (address) {
    await addressDao.addAddress({
      user_id: newUser.id,            // 📌 khóa ngoại liên kết user
      address_line: address,
      is_default: true,               // 📍 địa chỉ đầu tiên mặc định
    });
  }

  return newUser;
};
