// src/api/userApi.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosConfig = { withCredentials: true };

// =============================
// 🔹 USER API
// =============================

export const getCurrentUser = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/me`, axiosConfig);
    return res.data;
  } catch {
    return null;
  }
};

export const logoutUser = async () => {
  const res = await axios.post(`${API_BASE_URL}/auth/logout`, {}, axiosConfig);
  return res.data;
};

export const updateUser = async (userId, data) => {
  const res = await axios.patch(`${API_BASE_URL}/users/${userId}`, data, axiosConfig);
  return res.data;
};

// =============================
// 🔹 SHOP-RELATED API
// =============================

export const updateShopStatus = async (userId, status) => {
  return updateUser(userId, { shop_profile: { status } });
};

export const getMyShop = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/shop/me`, axiosConfig);
    return res.data?.data || null;
  } catch {
    return null;
  }
};

export const getAllShops = async (params = {}) => {
  const res = await axios.get(`${API_BASE_URL}/users`, {
    params: { role: "shop", ...params },
    ...axiosConfig,
  });
  return res.data;
};
