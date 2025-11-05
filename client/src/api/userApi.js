// ============================================
// 📁 src/api/userApi.js
// ✅ Khớp 100% với backend đã gợi ý sửa
// ============================================

import axios from "axios";

// 🌐 Cấu hình URL API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 🧩 Cấu hình axios cho phép session cookie
const axiosConfig = { withCredentials: true };

// ============================================
// 👤 USER API
// ============================================

/**
 * 🔹 Lấy thông tin user hiện tại (theo session)
 * GET /api/users/me
 */
export const getCurrentUser = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/me`, axiosConfig);
    return res.data;
  } catch (error) {
    console.error("❌ getCurrentUser:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin người dùng hiện tại.",
    };
  }
};

/**
 * 🔹 Cập nhật thông tin user theo ID
 * PATCH /api/users/:id
 */
export const updateUser = async (userId, data) => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/users/${userId}`,
      data,
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ updateUser:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể cập nhật thông tin người dùng.",
    };
  }
};

/**
 * 🔹 Đổi mật khẩu
 * POST /api/auth/change-password
 * body: { userId, oldPassword, newPassword }
 */
export const changePassword = async (userId, passwords) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/change-password`,
      { userId, ...passwords },
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ changePassword:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể đổi mật khẩu người dùng.",
    };
  }
};

/**
 * 🔹 Đăng xuất user hiện tại
 * POST /api/auth/logout
 */
export const logoutUser = async () => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ logoutUser:", error);
    return {
      success: false,
      message: "Không thể đăng xuất người dùng.",
    };
  }
};

/**
 * 🔹 Xóa tài khoản người dùng
 * DELETE /api/users/:id
 */
export const deleteUser = async (userId) => {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/users/${userId}`,
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ deleteUser:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể xóa tài khoản người dùng.",
    };
  }
};

// ============================================
// 🏪 SHOP-RELATED API
// ============================================

/**
 * 🔹 Lấy thông tin shop của user hiện tại
 * GET /api/shops/me
 */
export const getMyShop = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/shops/me`, axiosConfig);
    return res.data?.data || null;
  } catch (error) {
    console.error("❌ getMyShop:", error);
    return null;
  }
};

/**
 * 🔹 Cập nhật trạng thái shop
 * PATCH /api/users/:id
 */
export const updateShopStatus = async (userId, status) => {
  try {
    return await updateUser(userId, { shop_profile: { status } });
  } catch (error) {
    console.error("❌ updateShopStatus:", error);
    throw error;
  }
};

/**
 * 🔹 Lấy danh sách tất cả shop
 * GET /api/users?role=shop
 */
export const getAllShops = async (params = {}) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users`, {
      params: { role: "shop", ...params },
      ...axiosConfig,
    });
    return res.data;
  } catch (error) {
    console.error("❌ getAllShops:", error);
    return [];
  }
};

// ============================================
// 🚚 SHIPPER-RELATED API
// ============================================

/**
 * 🔹 Lấy thông tin shipper của user hiện tại
 * GET /api/shipper/me
 */
export const getMyShipper = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/shipper/me`, axiosConfig);
    return res.data?.data || null;
  } catch (error) {
    console.error("❌ getMyShipper:", error);
    return null;
  }
};

/**
 * 🔹 Cập nhật thông tin shipper
 * PUT /api/shipper/:id
 */
export const updateShipperProfile = async (shipperId, data) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/shipper/${shipperId}`,
      data,
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ updateShipperProfile:", error);
    throw error;
  }
};

/**
 * 🔹 Lấy thống kê shipper
 * GET /api/shipper/stats/:id
 */
export const getShipperStatistics = async (shipperId) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/shipper/stats/${shipperId}`,
      axiosConfig
    );
    return res.data;
  } catch (error) {
    console.error("❌ getShipperStatistics:", error);
    throw error;
  }
};

/**
 * 🔹 Lấy thu nhập shipper
 * GET /api/shipper/earnings/:id?period=month|week|day
 */
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
    console.error("❌ getShipperEarnings:", error);
    throw error;
  }
};
