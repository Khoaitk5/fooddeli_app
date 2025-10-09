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
  // 🧠 Nhận dữ liệu từ frontend
  const {
    username,
    fullname, // 📌 FE gửi là fullname (camelCase)
    password,
    phone,
    email,
    address, // 🏠 Có thể là string hoặc object
    note,
    address_type,
    role = "user",
  } = userData;

  // 📌 Kiểm tra bắt buộc: phải có password
  if (!password) {
    throw new Error("Mật khẩu là bắt buộc");
  }

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
    full_name: fullname, // 📌 ánh xạ fullname từ FE -> full_name trong DB
    password: hashedPassword,
    phone: phone || null,
    email: email || null,
    role,
    status: "active",
  });

  // 🏡 2️⃣ Nếu có nhập địa chỉ → xử lý và tạo địa chỉ mặc định
  if (address) {
    // 🧩 Trường hợp FE gửi address là object
    let addressLine = address;
    let addressNote = note || "";
    let addressType = address_type || "Nhà";

    if (typeof address === "object" && address !== null) {
      const { detail, ward, city, note: noteFromFE, address_type: typeFromFE } = address;

      // Chuẩn hóa thành text hiển thị
      addressLine = `${detail || ""}${
        ward || city ? ", " : ""
      }${ward || ""}${ward && city ? ", " : ""}${city || ""}`;
      addressNote = noteFromFE || note || "";
      addressType = typeFromFE || address_type || "Nhà";
    }

    // ✅ Tạo địa chỉ mặc định cho user
    const addr = await addressDao.addAddress({
      user_id: newUser.id,
      address_line: addressLine,
      note: addressNote,
      address_type: addressType,
      is_default: true,
    });

    // 📌 Gán vào newUser để controller có thể trả về cho FE
    newUser.address = {
      address_line: addr.address_line,
      note: addr.note,
      address_type: addr.address_type,
    };
  }

  // 📌 Gán lại fullname cho newUser để controller trả ra đúng key FE mong đợi
  newUser.fullname = fullname;

  return newUser;
};
