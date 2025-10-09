// src/api/userApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // hoặc .env

// Lấy user hiện tại từ session
export const getCurrentUser = async () => {
  const res = await axios.get(`${API_BASE_URL}/users/me`, {
    withCredentials: true, // quan trọng để gửi cookie session
  });
  return res.data;
};

// Đăng xuất user
export const logoutUser = async () => {
  const res = await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
  return res.data;
};
