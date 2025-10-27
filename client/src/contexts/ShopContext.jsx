import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [shopId, setShopId] = useState(null);

  useEffect(() => {
    const fetchShopId = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include",
        });
        const me = await res.json();

        console.log("DEBUG /api/users/me =", me);

        // ✅ Lấy đúng shop_profile_id trong JSON của bạn
        const id =
          me?.user?.shop_profile?.shop_profile_id ??
          me?.shop_profile?.shop_profile_id ??
          null;

        if (id) {
          console.log("✅ Found shopId from context:", id);
          setShopId(Number(id));
        } else {
          console.warn("⚠️ Không tìm thấy shop_profile_id trong /api/users/me");
        }
      } catch (err) {
        console.error("❌ [ShopProvider] Lỗi khi lấy shopId:", err);
      }
    };

    fetchShopId();
  }, []);

  return (
    <ShopContext.Provider value={shopId}>{children}</ShopContext.Provider>
  );
};
