// File: src/contexts/OrderContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
// Import constants từ các file trang
import { coupons } from "../pages/Customer/AddCoupon";
import { useCart } from "../hooks/useCart";

// 1. Tạo Context
const OrderContext = createContext();

// 2. Tạo Provider (Component bọc ngoài)
export const OrderProvider = ({ children }) => {
  // === LẤY CART TỪ BACKEND ===
  const { cartItems: backendCartItems, cartCount, loading: cartLoading } = useCart();
  
  // === STATE CỦA ĐƠN HÀNG ===
  const [note, setNote] = useState("");
  const [currentItems, setCurrentItems] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [paymentMethodName, setPaymentMethodName] = useState("Tiền mặt");
  const [selectedCoupons, setSelectedCoupons] = useState({ shipping: null, food: null });

  // === ĐỒNG BỘ CART TỪ BACKEND ===
  useEffect(() => {
    if (backendCartItems && backendCartItems.length > 0) {
      // Transform backend cart items thành format cho ConfirmOrder
      const transformedItems = backendCartItems.map((item) => ({
        id: item.id,
        name: item.product_name,
        price: item.unit_price,
        img: item.product_image || "https://via.placeholder.com/150",
      }));
      
      setCurrentItems(transformedItems);
      setQuantities(backendCartItems.map((item) => item.quantity));
    }
  }, [backendCartItems]);

  // ==========================================================
  // STATE MỚI CHO MODAL XÁC NHẬN
  // ==========================================================
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {}, // Hàm sẽ được gọi khi bấm "Có"
  });

  // ==========================================================
  // SỬA LỖI Ở HÀM NÀY
  // ==========================================================
  const showConfirmation = (message, onConfirm) => {
    setConfirmation({
      isOpen: true,
      message,
      onConfirm: onConfirm, // <-- Gán thẳng hàm, không bọc trong () =>
    });
  };
  // ==========================================================

  const hideConfirmation = () => {
    setConfirmation({
      isOpen: false,
      message: '',
      onConfirm: () => {},
    });
  };
  // ==========================================================

  // === LOGIC CỦA ĐƠN HÀNG ===
  const handleQuantityChange = (index, delta) => {
    setQuantities((prev) =>
      prev.map((q, i) => {
        if (i === index) {
          return Math.max(1, q + delta);
        }
        return q;
      })
    );
  };

  const handleRemoveItem = (indexToRemove) => {
    setCurrentItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
    setQuantities((prevQuantities) =>
      prevQuantities.filter((_, index) => index !== indexToRemove)
    );
  };

  // === TÍNH TOÁN ===
  const totalQuantity = quantities.reduce((sum, q) => sum + q, 0);
  const totalItemPrice = currentItems.reduce(
    (sum, item, index) => sum + item.price * quantities[index],
    0
  );
  
  const distance = "1.36km"; 
  const distanceNum = parseFloat(distance.replace("km", ""));
  const shippingFee = 5000 + Math.round(distanceNum * 2000);

  let foodDiscount = 0;
  const foodCouponIndex = selectedCoupons.food;
  if (foodCouponIndex !== null && coupons[foodCouponIndex]) {
    const coupon = coupons[foodCouponIndex];
    if (coupon.status === 'food' && totalItemPrice >= coupon.minOrder) {
      if (coupon.type === 'percentage') {
        foodDiscount = totalItemPrice * (coupon.value / 100);
      } else if (coupon.type === 'fixed') {
        foodDiscount = coupon.value;
      }
    }
  }

  let shippingDiscount = 0;
  const shippingCouponIndex = selectedCoupons.shipping;
  if (shippingCouponIndex !== null && coupons[shippingCouponIndex]) {
    const coupon = coupons[shippingCouponIndex];
    if (coupon.status === 'shipping' && totalItemPrice >= coupon.minOrder) {
      if (coupon.type === 'free') {
        shippingDiscount = shippingFee;
      } else if (coupon.type === 'fixed') {
        shippingDiscount = coupon.value;
      }
      if (shippingDiscount > shippingFee) {
        shippingDiscount = shippingFee;
      }
    }
  }

  const totalPrice = totalItemPrice + shippingFee - foodDiscount - shippingDiscount;
  const couponCount = (selectedCoupons.shipping !== null ? 1 : 0) + (selectedCoupons.food !== null ? 1 : 0);

  // === GIÁ TRỊ CUNG CẤP CHO CONTEXT ===
  const value = {
    items: currentItems,
    note,
    setNote,
    quantities,
    handleQuantityChange,
    handleRemoveItem,
    paymentMethodName,
    setPaymentMethodName,
    selectedCoupons,
    setSelectedCoupons,
    totalQuantity,
    totalItemPrice,
    shippingFee,
    foodDiscount,
    shippingDiscount,
    totalPrice,
    couponCount,
    cartLoading, // Thêm loading state
    // Cung cấp state và hàm của modal
    confirmation,
    showConfirmation,
    hideConfirmation,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

// 6. Tạo 1 custom hook để dễ dàng sử dụng
export const useOrder = () => {
  return useContext(OrderContext);
};