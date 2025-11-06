import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook để quản lý giỏ hàng từ backend
 * @returns {Object} { cartItems, cartCount, loading, error, refreshCart }
 */
export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [shopId, setShopId] = useState(null); // Lưu shopId từ cart
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch cart từ backend
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api/cart", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success && data.data?.items) {
        // Chuẩn hoá data
        const normalizedItems = data.data.items.map((item) => ({
  id: item.id || item.cart_item_id,
  shop_id: item.shop_id,              // ✅ thêm
  shop_name: item.shop_name,          // ✅ thêm
  product_name: item.product_name,
  product_description: item.product_description,
  product_image: item.product_image,
  quantity: item.quantity,
  unit_price: Number(item.unit_price),
  line_total: Number(item.line_total),
}));

        setCartItems(normalizedItems);
        
        // Lấy shopId từ item đầu tiên (tất cả items trong cart cùng 1 shop)
        if (normalizedItems.length > 0 && normalizedItems[0].shop_id) {
          setShopId(normalizedItems[0].shop_id);
        }
        
        // Tính tổng số lượng items
        const totalCount = normalizedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartCount(totalCount);
      } else {
        setCartItems([]);
        setCartCount(0);
        setShopId(null);
      }
    } catch (err) {
      console.error("❌ Lỗi khi fetch giỏ hàng:", err);
      setError(err.message);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart khi component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Hàm refresh cart (để gọi sau khi add/update/delete)
  const refreshCart = useCallback(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartItems,
    cartCount,
    shopId, // Export shopId
    loading,
    error,
    refreshCart,
  };
};

