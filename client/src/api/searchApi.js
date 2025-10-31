import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * 🔍 Chỉ tìm sản phẩm (đồ ăn)
 */
export const searchProducts = async (keyword) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/products/search`, {
      params: { keyword },
      withCredentials: true,
    });
    console.log("✅ API Search Products:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi gọi API searchProducts:", err);
    return [];
  }
};

/**
 * 🌐 Tìm kiếm tổng hợp: sản phẩm + video + tài khoản
 */
export const searchAll = async (keyword) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/search`, {
      params: { keyword },
      withCredentials: true,
    });
    console.log("✅ API SearchAll Response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi gọi API searchAll:", err);
    return { success: false, products: [], videos: [], accounts: [] };
  }
};
