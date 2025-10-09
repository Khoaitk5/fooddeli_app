import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log("🌀 [AuthContext] Provider mounted or re-rendered");

  useEffect(() => {
    console.log("🚀 [AuthContext] useEffect: Bắt đầu fetch user từ session...");

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        console.log("📥DEBUG: [AuthContext] API Response:", res);

        if (res.success) {
          console.log("✅DEBUG: [AuthContext] User được lấy thành công:", res.user);
          setUser(res.user);
        } else {
          console.warn("⚠️DEBUG: [AuthContext] Không có user trong session");
        }
      } catch (error) {
        console.error("❌DEBUG: [AuthContext] Lỗi khi fetch user:", error);
      } finally {
        setLoading(false);
        console.log("⏹️DEBUG: [AuthContext] Kết thúc fetch user");
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    console.log("👋 [AuthContext] User logout được gọi");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
