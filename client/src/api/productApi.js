import axios from "axios";

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * ✅ Lấy danh sách sản phẩm đủ thông tin (có ảnh, giá > 0, đang bán)
 * @param {{ limit?: number, offset?: number }} params
 */
export const getCompleteProducts = async (params = {}) => {
  const { limit = 20, offset = 0 } = params;

  const response = await axiosInstance.get("/products/complete", {
    params: { limit, offset },
  });

  return response.data;
};
 