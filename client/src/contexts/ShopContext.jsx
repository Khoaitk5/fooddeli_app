 import React, { createContext, useEffect, useState, useContext } from "react";
 import { AuthContext } from "./AuthContext";
 import { getMyShop } from "../api/userApi";

export const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [shopId, setShopId] = useState(null);

  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (loading) return;
    const resolveShopId = async () => {
      try {
        // Ưu tiên lấy từ /users/me
        const idFromUser =
          user?.shop_profile?.shop_profile_id ??
          user?.shop_profile?.id ??
          user?.shop_profile?.shop_id ??
          null;

        if (idFromUser) {
          console.log("✅ Found shopId from context:", idFromUser);
          setShopId(Number(idFromUser));
          return;
        }

        // Fallback: gọi API lấy shop của user hiện tại
        if (user?.role === "shop") {
          const shop = await getMyShop();
          const idFromApi = shop?.shop_profile_id ?? shop?.id ?? shop?.shop_id ?? null;
          if (idFromApi) {
            console.log("✅ Found shopId via API:", idFromApi);
            setShopId(Number(idFromApi));
            return;
          }
        }

        console.warn("⚠️ Không tìm thấy shop_profile_id trong /api/users/me hoặc /api/users/shops/me");
        setShopId(null);
      } catch (err) {
        console.error("❌ [ShopProvider] Lỗi khi lấy shopId:", err);
        setShopId(null);
      }
    };
    resolveShopId();
  }, [loading, user]);

  if (loading) {
    return null;
  }

  return <ShopContext.Provider value={shopId}>{children}</ShopContext.Provider>;
};
