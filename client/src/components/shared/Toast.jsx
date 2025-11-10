import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

/**
 * 🍞 Toast Notification Component
 * @param {Object} props
 * @param {string} props.message - Nội dung thông báo
 * @param {string} props.type - Loại: 'success' | 'error' | 'warning'
 * @param {boolean} props.show - Hiển thị hay không
 * @param {Function} props.onClose - Callback khi đóng
 * @param {number} props.duration - Thời gian tự động đóng (ms), mặc định 2000
 */
export default function Toast({ 
  message, 
  type = "success", 
  show = false, 
  onClose,
  duration = 2000 
}) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const iconMap = {
    success: <CheckCircle size={20} color="#fff" strokeWidth={2.5} />,
    error: <XCircle size={20} color="#fff" strokeWidth={2.5} />,
    warning: <AlertCircle size={20} color="#fff" strokeWidth={2.5} />,
  };

  const bgColorMap = {
    success: "linear-gradient(135deg, #5EAD1D 0%, #54A312 100%)",
    error: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: bgColorMap[type] || bgColorMap.success,
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: "280px",
            maxWidth: "90vw",
          }}
        >
          {/* Icon */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {iconMap[type] || iconMap.success}
          </motion.div>

          {/* Message */}
          <span
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
              flex: 1,
            }}
          >
            {message}
          </span>

          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: "0 0 12px 12px",
              transformOrigin: "left",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

