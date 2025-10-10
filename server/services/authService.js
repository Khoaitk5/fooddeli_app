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
  console.log("📩 [DEBUG] userData nhận vào từ controller:", userData);
  const {
    username,
    fullname,
    password,
    phone,
    email,
    address,
    note,
    address_type,
    role = "user",
  } = userData;

  if (!password) throw new Error("Mật khẩu là bắt buộc");
  if (!phone && !email) throw new Error("Phải cung cấp ít nhất số điện thoại hoặc email");

  // 🧩 Kiểm tra trùng username, phone, email
  if (username && (await userDao.findByUsername(username))) throw new Error("Tên đăng nhập đã tồn tại");
  if (phone && (await userDao.findByPhone(phone))) throw new Error("Số điện thoại đã được sử dụng");
  if (email && (await userDao.findByEmail(email))) throw new Error("Email đã được sử dụng");

  const hashedPassword = await bcrypt.hash(password, 10);

  // 1️⃣ Tạo user mới
  const newUser = await userDao.create({
    username,
    full_name: fullname,
    password: hashedPassword,
    phone: phone || null,
    email: email || null,
    role,
    status: "active",
  });

  // 2️⃣ Xử lý địa chỉ nếu có
  if (address) {
  let addressLine = "";
  let addressNote = "";
  let addressType = "Nhà";

  if (typeof address === "object" && address !== null) {
    const {
      detail,
      ward,
      city,
      note: noteFromFE,
      addressType: addressTypeFromFE,
      address_type: addressTypeSnake,
    } = address;

    addressLine = `${detail || ""}${ward || city ? ", " : ""}${ward || ""}${
      ward && city ? ", " : ""
    }${city || ""}`;

    addressNote = noteFromFE || note || "";
    addressType = addressTypeFromFE || addressTypeSnake || "Nhà";
  } else if (typeof address === "string") {
    // 🧩 Thêm đoạn này 👇
    addressLine = address;
    addressNote = note || ""; // ✅ lấy từ userData
    addressType = address_type || "Nhà"; // ✅ lấy từ userData
  }

  console.log("✅ [DEBUG] Sau khi xử lý:", { addressLine, addressNote, addressType });

  const addr = await addressDao.addAddress({
    user_id: newUser.id,
    address_line: addressLine,
    note: addressNote,
    address_type: addressType,
    is_default: true,
  });
}


  newUser.fullname = fullname;
  return newUser;
};

