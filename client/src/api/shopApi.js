// ============================================
// 📁 src/api/shopApi.js
// API cho các thao tác liên quan đến Shop
// ============================================

import axios from "axios";

// 🌐 Cấu hình URL API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 🧩 Cấu hình axios cho phép session cookie
const axiosConfig = { withCredentials: true };

// ============================================
// 🏪 SHOP API
// ============================================

/**
 * 🔹 Lấy danh sách tất cả cửa hàng
 * GET /api/shops/list
 */
export const getAllShops = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/shops/list`, axiosConfig);
    return res.data;
  } catch (error) {
    console.error("❌ getAllShops:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy danh sách cửa hàng.",
      data: [],
    };
  }
};

/**
 * 🔹 Lấy danh sách cửa hàng theo loại món ăn
 * GET /api/shops/by-food-type?foodType=...
 */
export const getShopsByFoodType = async (foodType) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/shops/by-food-type`, {
      params: { foodType },
      ...axiosConfig,
    });
    return res.data;
  } catch (error) {
    console.error("❌ getShopsByFoodType:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy danh sách cửa hàng theo loại món ăn.",
      data: [],
    };
  }
};

/**
 * 🔹 Lấy thông tin cửa hàng của user hiện tại
 * GET /api/shops/me
 */
export const getMyShop = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/shops/me`, axiosConfig);
    return res.data;
  } catch (error) {
    console.error("❌ getMyShop:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin cửa hàng.",
      data: null,
    };
  }
};

/**
 * 🔹 Lấy chi tiết cửa hàng
 * POST /api/shops/detail
 */
export const getShopDetail = async (shopId) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/shops/detail`,
      { shopId },
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ getShopDetail:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin chi tiết cửa hàng.",
      data: null,
    };
  }
};

/**
 * 🔹 Lấy danh sách cửa hàng gần người dùng
 * POST /api/shops/nearby
 */
export const getNearbyShops = async (latitude, longitude, radius = 5000) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/shops/nearby`,
      { latitude, longitude, radius },
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ getNearbyShops:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy danh sách cửa hàng gần bạn.",
      data: [],
    };
  }
};

/**
 * 🔹 Tạo cửa hàng mới
 * POST /api/shops/create
 */
export const createShop = async (shopData) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/shops/create`,
      shopData,
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ createShop:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể tạo cửa hàng mới.",
    };
  }
};

/**
 * 🔹 Cập nhật thông tin cửa hàng
 * PUT /api/shops/update
 */
export const updateShopInfo = async (shopData) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/shops/update`,
      shopData,
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ updateShopInfo:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể cập nhật thông tin cửa hàng.",
    };
  }
};

/**
 * 🔹 Cập nhật trạng thái cửa hàng
 * PUT /api/shops/update-status
 */
export const updateShopStatus = async (status) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/shops/update-status`,
      { status },
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ updateShopStatus:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể cập nhật trạng thái cửa hàng.",
    };
  }
};

