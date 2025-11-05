import { X, Gift, Calendar, Copy, Check, Info } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function VouchersDialog({ isOpen, onClose, isMobile, isTablet }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [popup, setPopup] = useState(null); // popup message

  const padding = isMobile ? "1.5rem" : isTablet ? "1.75rem" : "2rem";

  // 🔹 Lấy dữ liệu từ database
  useEffect(() => {
    if (!isOpen) return;

    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/vouchers`, { withCredentials: true });

        if (Array.isArray(res.data?.vouchers)) {
  const formatted = res.data.vouchers.map((v) => ({
    id: v.voucher_id,
    code: v.code,
    title: v.type === "shipping" ? "Miễn phí giao hàng" : "Giảm giá đơn hàng",
    description: v.min_order_value
      ? `Áp dụng cho đơn từ ${Number(v.min_order_value).toLocaleString("vi-VN")}đ`
      : "Áp dụng cho mọi đơn hàng",
    discount: v.type === "shipping"
      ? `Giảm ${Number(v.discount_value).toLocaleString("vi-VN")}đ phí giao hàng`
      : `Giảm ${Number(v.discount_value).toLocaleString("vi-VN")}đ`,
    expiry: v.end_date,
    color: "#ee4d2d"
  }));
  setVouchers(formatted);
} else {
  setVouchers([]);
}

      } catch (err) {
        console.error("❌ Lỗi tải voucher:", err);
        showPopup("Không thể tải danh sách voucher ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [isOpen]);

  // 🔹 Hiển thị popup tạm thời
  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(null), 2000);
  };

  // 🔹 Copy mã voucher
  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showPopup(`📋 Đã sao chép mã ${code}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Popup thông báo */}
      {popup && (
        <div
          style={{
            position: "fixed",
            top: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#333",
            color: "#fff",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.75rem",
            fontSize: "0.9rem",
            fontWeight: "500",
            zIndex: 10000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            animation: "fadeInOut 2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Info size={16} color="#fff" />
          {popup}
        </div>
      )}

      {/* Dialog chính */}
      <div
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: isMobile ? "1.25rem" : "1.5rem",
          width: isMobile ? "calc(100% - 2rem)" : isTablet ? "540px" : "600px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 1.25rem 3.75rem rgba(0, 0, 0, 0.3)",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)",
            padding,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: isMobile ? "1.125rem" : "1.25rem",
              fontWeight: "600",
            }}
          >
            Voucher & Ưu đãi
          </h2>
          <button
            onClick={onClose}
            style={{
              width: isMobile ? "2rem" : "2.25rem",
              height: isMobile ? "2rem" : "2.25rem",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
          >
            <X size={isMobile ? 18 : 20} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding }}>
          {loading ? (
            <p>⏳ Đang tải voucher...</p>
          ) : vouchers.length === 0 ? (
            <p>📭 Hiện chưa có voucher nào khả dụng.</p>
          ) : (
            vouchers.map((voucher, index) => (
              <div
                key={voucher.id}
                style={{
                  background: "#fff",
                  border: `0.125rem solid ${voucher.color || "#ee4d2d"}20`,
                  borderRadius: "1rem",
                  padding: isMobile ? "1rem" : "1.25rem",
                  marginBottom: index < vouchers.length - 1 ? "1rem" : 0,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative circles */}
                <div
                  style={{
                    position: "absolute",
                    left: "-0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "1rem",
                    height: "1rem",
                    borderRadius: "50%",
                    background: "#f5f5f5",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "-0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "1rem",
                    height: "1rem",
                    borderRadius: "50%",
                    background: "#f5f5f5",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: isMobile ? "0.875rem" : "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? "3.5rem" : "4rem",
                      height: isMobile ? "3.5rem" : "4rem",
                      borderRadius: "0.75rem",
                      background: `${voucher.color || "#ee4d2d"}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Gift size={isMobile ? 24 : 28} color={voucher.color || "#ee4d2d"} strokeWidth={2} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: isMobile ? "1rem" : "1.0625rem",
                        fontWeight: "600",
                        color: "#333",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {voucher.title || "Ưu đãi hấp dẫn"}
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? "0.8125rem" : "0.875rem",
                        color: "#999",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {voucher.description || "Áp dụng cho đơn hàng của bạn"}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        fontSize: isMobile ? "0.8125rem" : "0.875rem",
                        color: "#666",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <Calendar size={14} strokeWidth={2} />
                      HSD:{" "}
                      {voucher.expiry
                        ? new Date(voucher.expiry).toLocaleDateString("vi-VN")
                        : "Không giới hạn"}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          background: `${voucher.color || "#ee4d2d"}10`,
                          borderRadius: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          fontSize: isMobile ? "0.8125rem" : "0.875rem",
                          fontWeight: "600",
                          color: voucher.color || "#ee4d2d",
                          fontFamily: "monospace",
                        }}
                      >
                        {voucher.code}
                      </div>
                      <button
                        onClick={() => handleCopy(voucher.code, voucher.id)}
                        style={{
                          padding: "0.5rem 0.875rem",
                          background:
                            copiedId === voucher.id
                              ? "#10b981"
                              : voucher.color || "#ee4d2d",
                          border: "none",
                          borderRadius: "0.5rem",
                          color: "#fff",
                          fontSize: isMobile ? "0.8125rem" : "0.875rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          transition: "all 0.2s",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {copiedId === voucher.id ? (
                          <>
                            <Check size={14} strokeWidth={2.5} /> Đã copy
                          </>
                        ) : (
                          <>
                            <Copy size={14} strokeWidth={2.5} /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    fontSize: isMobile ? "0.875rem" : "0.9375rem",
                    fontWeight: "600",
                    color: voucher.color || "#ee4d2d",
                  }}
                >
                  {voucher.discount || ""}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -10px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            90% { opacity: 1; }
            100% { opacity: 0; transform: translate(-50%, -10px); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(1rem); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
