import { Home, Package, MapPinned, User } from "lucide-react";

export default function BottomNav({ currentTab, onTabChange, hasActiveOrder, isOnline }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Trang chủ */}
        <button
          onClick={() => onTabChange("home")}
          className={`flex flex-col items-center flex-1 py-1.5 px-2 rounded-xl transition-all duration-200 ${
            currentTab === "home" ? "bg-orange-50 text-orange-500" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Home className={`h-5 w-5 mb-0.5 ${currentTab === "home" ? "scale-110" : ""}`} />
          <span className="text-[10px]">Trang chủ</span>
        </button>

        {/* Đơn hàng */}
        <button
          onClick={() => isOnline && onTabChange("orders")}
          className={`flex flex-col items-center flex-1 py-1.5 px-2 rounded-xl transition-all duration-200 relative ${
            currentTab === "orders"
              ? "bg-orange-50 text-orange-500"
              : isOnline
              ? "text-gray-500 hover:bg-gray-50"
              : "text-gray-300"
          }`}
          disabled={!isOnline}
        >
          <Package className={`h-5 w-5 mb-0.5 ${currentTab === "orders" ? "scale-110" : ""}`} />
          <span className="text-[10px]">Đơn hàng</span>
          {isOnline && currentTab !== "orders" && (
            <span className="absolute top-1 right-1/4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </span>
          )}
        </button>

        {/* Đang giao */}
        <button
          onClick={() => hasActiveOrder && onTabChange("active")}
          className={`flex flex-col items-center flex-1 py-1.5 px-2 rounded-xl transition-all duration-200 relative ${
            currentTab === "active"
              ? "bg-orange-50 text-orange-500"
              : hasActiveOrder
              ? "text-gray-500 hover:bg-gray-50"
              : "text-gray-300"
          }`}
          disabled={!hasActiveOrder}
        >
          <MapPinned className={`h-5 w-5 mb-0.5 ${currentTab === "active" ? "scale-110" : ""}`} />
          <span className="text-[10px]">Đang giao</span>
        </button>

        {/* Hồ sơ */}
        <button
          onClick={() => onTabChange("profile")}
          className={`flex flex-col items-center flex-1 py-1.5 px-2 rounded-xl transition-all duration-200 ${
            currentTab === "profile" ? "bg-orange-50 text-orange-500" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <User className={`h-5 w-5 mb-0.5 ${currentTab === "profile" ? "scale-110" : ""}`} />
          <span className="text-[10px]">Hồ sơ</span>
        </button>
      </div>
    </div>
  );
}
