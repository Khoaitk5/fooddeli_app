import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import BottomNav from "../shipper/BottomNav";

export default function ShipperLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(false);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);

  const currentTab = location.pathname.includes("orders")
    ? "orders"
    : location.pathname.includes("active")
    ? "active"
    : location.pathname.includes("profile")
    ? "profile"
    : "home";

  const handleTabChange = (tab) => {
    navigate(`/shipper/${tab}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Nội dung chính */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet
          context={{
            isOnline,
            setIsOnline,
            hasActiveOrder,
            setHasActiveOrder,
          }}
        />
      </main>

      {/* Thanh điều hướng cố định */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t z-50">
        <BottomNav
          currentTab={currentTab}
          onTabChange={handleTabChange}
          hasActiveOrder={hasActiveOrder}
          isOnline={isOnline}
        />
      </footer>
    </div>
  );
}
