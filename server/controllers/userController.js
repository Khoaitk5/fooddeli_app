// server/controllers/userController.js
const userService = require("../services/userService");

// 📌 Lấy thông tin user theo ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id || 4; // mặc định là 4 nếu không truyền
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "❌ Không tìm thấy người dùng!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("⚠️ Lỗi getUserById:", error);
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu người dùng." });
  }
};

// 📌 Cập nhật thông tin user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id || 4;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ message: "❌ Không thể cập nhật - Người dùng không tồn tại!" });
    }

    res.status(200).json({
      message: "✅ Cập nhật thông tin thành công!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("⚠️ Lỗi updateUser:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin người dùng." });
  }
};

module.exports = { getUserById, updateUser };
