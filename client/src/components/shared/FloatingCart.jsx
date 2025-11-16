import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * 🛒 Floating Cart Component - Giỏ hàng nổi (giống Shopee/Grab)
 * @param {Object} props
 * @param {Array} props.items - Danh sách món trong giỏ
 * @param {number} props.totalQuantity - Tổng số lượng món
 * @param {number} props.totalPrice - Tổng giá
 */
export default function FloatingCart({ items = [], totalQuantity = 0, totalPrice = 0,distance = null }) {
  const navigate = useNavigate();

  const handleViewCart = () => {
    // Group items by shop_id
    const groupedByShop = items.reduce((groups, item) => {
      const shopId = item.shop_id;
      if (!groups[shopId]) {
        groups[shopId] = {
          shop_name: item.shop_name,
          items: []
        };
      }
      groups[shopId].items.push(item);
      return groups;
    }, {});

    const shopIds = Object.keys(groupedByShop);
    
    if (shopIds.length === 1) {
      // Chỉ có 1 shop - đi thẳng ConfirmOrder
      const shopId = shopIds[0];
      const shopData = groupedByShop[shopId];
      const total = shopData.items.reduce((sum, i) => sum + Number(i.line_total || 0), 0);
      
      const checkoutData = {
        cartItems: shopData.items,
        total,
        shop_id: shopId,
        shop_name: shopData.shop_name
      };
      
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      navigate('/customer/confirm-order', { 
  state: { 
    ...checkoutData,
    distance   // 👈 TRUYỀN KHOẢNG CÁCH QUA ConfirmOrder
  }
});
    } else {
      // Nhiều shop - đi qua Cart page
      navigate('/customer/cart');
    }
  };

  return (
    <AnimatePresence>
      {items.length > 0 && totalQuantity > 0 && (
        <motion.div
          key="floating-cart"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            padding: "0 16px 16px",
          }}
        >
        {/* Main cart button - Full Width Design */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleViewCart}
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "linear-gradient(135deg, #FE5621 0%, #EE4D2D 100%)",
            borderRadius: "16px",
            border: "none",
            boxShadow: "0 6px 24px rgba(254, 86, 33, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Shine effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              animation: "shine 3s infinite",
            }}
          />

          {/* Left section: Icon + Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 1 }}>
            {/* Icon with Badge */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  borderRadius: "12px",
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBag size={22} color="#fff" strokeWidth={2.5} />
              </div>
              
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "#FF6B35",
                  color: "#fff",
                  borderRadius: "50%",
                  minWidth: "20px",
                  height: "20px",
                  padding: "0 5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "700",
                  border: "2px solid #FE5621",
                  boxShadow: "0 2px 8px rgba(255, 107, 53, 0.4)",
                }}
              >
                {totalQuantity}
              </motion.div>
            </div>

            {/* Price Info */}
            <div style={{ textAlign: "left" }}>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: "500", marginBottom: "2px" }}>
                Tổng cộng
              </div>
              <div style={{ color: "#fff", fontSize: "17px", fontWeight: "700", letterSpacing: "0.3px" }}>
                {totalPrice.toLocaleString("vi-VN")}đ
              </div>
            </div>
          </div>

          {/* Right section: CTA Button */}
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              padding: "8px 12px",
              borderRadius: "10px",
              zIndex: 1,
            }}
          >
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>
              Xem giỏ hàng
            </span>
            <ChevronRight size={18} color="#fff" strokeWidth={2.5} />
          </div>
        </motion.button>
      </motion.div>
      )}

      {/* Keyframe animation for shine effect */}
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }
      `}</style>
    </AnimatePresence>
  );
}

