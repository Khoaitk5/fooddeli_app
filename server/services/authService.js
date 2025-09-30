// services/authService.js
const bcrypt = require("bcrypt");
const userDao = require("../dao/userDao");

exports.login = async (username, password) => {
  const user = await userDao.findByUsername(username);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
};

exports.register = async (userData) => {
  const existingUserByUsername = await userDao.findByUsername(
    userData.username
  );
  const existingUserByEmail = await userDao.findByEmail(userData.email);

  if (existingUserByUsername || existingUserByEmail) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;

  const newUser = await userDao.create(userData);
  return newUser;
};
