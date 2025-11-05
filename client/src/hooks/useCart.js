import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook để quản lý giỏ hàng từ backend
 * @returns {Object} { cartItems, cartCount, loading, error, refreshCart }
 */
export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
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
          product_name: item.product_name,
          product_description: item.product_description,
          product_image: item.product_image,
          quantity: item.quantity,
          unit_price: Number(item.unit_price),
          line_total: Number(item.line_total),
        }));

        setCartItems(normalizedItems);
        
        // Tính tổng số lượng items
        const totalCount = normalizedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartCount(totalCount);
      } else {
        setCartItems([]);
        setCartCount(0);
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
    loading,
    error,
    refreshCart,
  };
};

