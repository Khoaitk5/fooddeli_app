import { useState, useEffect } from "react";
import { MapPin, Power, X, MapPinned, Clock, DollarSign, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockNewOrder = {
  id: "DH001",
  pickupAddress: "123 Nguyễn Huệ, Q.1",
  pickupName: "Nhà hàng Phở 24",
  deliveryAddress: "456 Lê Lợi, Q.3",
  deliveryName: "Nguyễn Văn A",
  distance: "3.5 km",
  estimatedTime: "15-20 phút",
  payment: "45.000đ",
  weight: "2kg",
  priority: "urgent",
};

export default function HomePage({ isOnline, onToggleOnline, onViewOrders }) {
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        setShowOrderPopup(true);
        setCountdown(30);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowOrderPopup(false);
    }
  }, [isOnline]);

  useEffect(() => {
    if (showOrderPopup && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setShowOrderPopup(false);
    }
  }, [showOrderPopup, countdown]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-100 via-green-50 to-orange-50 relative">
      {/* Map background */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 opacity-15 grid grid-cols-12 grid-rows-12">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-gray-400" />
          ))}
        </div>

        {/* Your location */}
        {isOnline && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-40" />
              <div className="relative h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white fill-white" />
              </div>
              <motion.div
                className="absolute inset-0 border-2 border-blue-400 rounded-full"
                animate={{ scale: [1, 2, 3], opacity: [0.6, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Status card */}
      <div className="absolute top-4 left-4 right-4">
        <motion.div
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${isOnline ? "bg-green-100" : "bg-gray-100"}`}>
                <Power className={`h-6 w-6 ${isOnline ? "text-green-600" : "text-gray-400"}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Trạng thái</p>
                <p className={`font-medium ${isOnline ? "text-green-600" : "text-gray-600"}`}>
                  {isOnline ? "Đang hoạt động" : "Offline"}
                </p>
              </div>
            </div>
            <div className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          </div>
        </motion.div>
      </div>

      {/* Toggle Button */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
        <motion.button
          onClick={() => onToggleOnline(!isOnline)}
          className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 transition-all duration-300 ${
            isOnline
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
          }`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <Power className="h-5 w-5" />
          <span>{isOnline ? "Ngắt kết nối" : "Bật kết nối"}</span>
        </motion.button>
      </div>
    </div>
  );
}
