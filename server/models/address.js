// models/address.js
class Address {
  constructor({
    address_id,
    user_id,
    address_line,
    note,            // 🆕 Ghi chú (VD: “Gọi trước khi giao”)
    address_type,    // 🆕 Loại địa chỉ (VD: “Nhà”, “Công ty”, “Khác”)
    is_default,
    created_at,
    updated_at,
  }) {
    this.address_id = address_id;     // 🆔 ID địa chỉ (PK)
    this.user_id = user_id;           // 👤 ID người dùng sở hữu địa chỉ
    this.address_line = address_line; // 🏠 Chi tiết địa chỉ
    this.note = note;                 // 📝 Ghi chú giao hàng
    this.address_type = address_type; // 🏷️ Phân loại địa chỉ (Nhà / Công ty / Khác)
    this.is_default = is_default;     // ⭐ Có phải địa chỉ mặc định không
    this.created_at = created_at;     // 🕐 Thời điểm tạo
    this.updated_at = updated_at;     // 🔄 Thời điểm cập nhật
  }
}

module.exports = Address;
