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
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || "Không thể lấy thông tin người dùng",
      };
    }

    return {
      success: false,
      status: null,
      message: error.message || "Lỗi không xác định khi lấy thông tin người dùng",
    };
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
    const res = await axios.get(`${API_BASE_URL}/shops/me`, axiosConfig);
    return res.data?.data || null;
  } catch {
    return null;
  }
};

export const getMyShipper = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/shipper/me`, axiosConfig);
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

// =============================
// 🔹 SHIPPER-RELATED API
// =============================

export const getShipperStatistics = async (shipperId) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/shipper/stats/${shipperId}`,
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching shipper stats:", error);
    throw error;
  }
};

export const getShipperEarnings = async (shipperId, period = "month") => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/shipper/earnings/${shipperId}`,
      {
        params: { period },
        ...axiosConfig,
      }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching shipper earnings:", error);
    throw error;
  }
};

export const updateShipperProfile = async (shipperId, data) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/shipper/${shipperId}`,
      data,
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error updating shipper profile:", error);
    throw error;
  }
};

export const changePassword = async (userId, passwords) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/change-password`,
      { userId, ...passwords },
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error changing password:", error);
    throw error;
  }
};