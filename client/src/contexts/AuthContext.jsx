import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 [AuthContext] useEffect: Bắt đầu fetch user từ session...");

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        console.log("📥DEBUG: [AuthContext] API Response:", res);

        if (res?.success && res.user) {
          // Store complete user data including shop_profile and shipper_profile
          console.log("✅DEBUG: [AuthContext] User được lấy thành công:", {
            id: res.user.id,
            role: res.user.role,
            hasShopProfile: !!res.user.shop_profile,
            hasShipperProfile: !!res.user.shipper_profile
          });
          setUser(res.user);
        } else if (res?.status === 401) {
          console.warn("⚠️DEBUG: [AuthContext] Session hết hạn hoặc chưa đăng nhập");
          setUser(null);
        } else if (res?.success === false) {
          console.warn("⚠️DEBUG: [AuthContext] Không thể lấy user:", res.message);
          setUser(null);
        } else {
          console.warn("⚠️DEBUG: [AuthContext] getCurrentUser trả về dữ liệu không hợp lệ", res);
          setUser(null);
        }
      } catch (error) {
        console.error("❌DEBUG: [AuthContext] Lỗi khi fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log("⏹️DEBUG: [AuthContext] Kết thúc fetch user");
      }
    };

    fetchUser();
  }, []); // Empty dependency array - chỉ chạy một lần khi mount

  const logout = () => {
    console.log("👋 [AuthContext] User logout được gọi");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
