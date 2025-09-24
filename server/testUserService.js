// testUserService.js
const UserService = require("./services/userService");

async function test() {
  try {
    console.log("📌 Lấy toàn bộ user:");
    const users = await UserService.getAllUsers();
    console.log(users);

    console.log("\n📌 Tạo user mới:");
    const newUser = await UserService.createUser({
      username: "testuser",
      password: "123456",
      email: "test@example.com",
      phone: "0123456789",
      role: "user"
    });
    console.log(newUser);

    console.log("\n📌 Lấy user theo ID:");
    const foundUser = await UserService.getUserById(newUser.id);
    console.log(foundUser);

    console.log("\n📌 Update user:");
    const updatedUser = await UserService.updateUser(newUser.id, {
      phone: "0999999999"
    });
    console.log(updatedUser);

    console.log("\n📌 Xóa user:");
    const deletedUser = await UserService.deleteUser(newUser.id);
    console.log(deletedUser);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
  }
}

test();
