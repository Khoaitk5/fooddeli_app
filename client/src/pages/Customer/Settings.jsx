import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bell, HelpCircle, Shield, ChevronLeft, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CustomerSettings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isMobile, setIsMobile] = useState(true);
  const [isTablet, setIsTablet] = useState(false);

  const layoutPadding = isMobile ? "1.75rem" : isTablet ? "2.25rem" : "3rem";
  const headerPadding = isMobile
    ? "1.25rem 1.5rem"
    : isTablet
    ? "1.75rem 2.25rem"
    : "2rem 3rem";
  const sectionSpacing = isMobile ? "1.75rem" : "2.25rem";
  const contentMaxWidth = isMobile ? "100%" : isTablet ? "720px" : "840px";
  const sectionLabelStyle = {
    fontSize: isMobile ? "1.5rem" : "1.6rem",
    fontWeight: 700,
    color: "#1A1A1A",
    letterSpacing: "-0.5px",
    marginBottom: "1rem",
  };
  const cardWrapperStyle = {
    background: "white",
    borderRadius: "1.2rem",
    border: "none",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflow: "hidden",
  };

  const [userId, setUserId] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    orderUpdates: true,
  });

  const [showChangePwd, setShowChangePwd] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Detect viewport for simple mobile-first behavior
    const onResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 640);
      setIsTablet(w > 640 && w <= 1024);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/me`, {
          withCredentials: true,
        });
        const id = res.data?.user?.id;
        if (id) {
          setUserId(id);
          const raw = localStorage.getItem(`settings:user:${id}`);
          if (raw) {
            setSettings((prev) => ({ ...prev, ...JSON.parse(raw) }));
          }
        }
      } catch {
        // ignore
      }
    };
    fetchUser();
  }, []);

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        if (userId) {
          localStorage.setItem(`settings:user:${userId}`, JSON.stringify(next));
        }
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá tài khoản?")) return;
    try {
      setDeleting(true);
      const res = await axios.delete(`${API_BASE_URL}/users/me`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        logout();
        navigate("/login");
      } else {
        alert(res.data?.message || "Không thể xoá tài khoản");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi xoá tài khoản");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#FAFAFA",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#1f2937",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "white",
          padding: headerPadding,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: isMobile ? "2.5rem" : "2.75rem",
            height: isMobile ? "2.5rem" : "2.75rem",
            borderRadius: "50%",
            background: "#F5F5F5",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#E0E0E0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#F5F5F5")}
        >
          <ChevronLeft
            size={isMobile ? 24 : 26}
            color="#666"
            strokeWidth={2.5}
          />
        </button>
        <h2
          style={{
            margin: 0,
            color: "#1A1A1A",
            fontSize: isMobile ? "1.6rem" : isTablet ? "1.75rem" : "1.9rem",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          Cài đặt
        </h2>
        <div style={{ width: isMobile ? "2.4rem" : "2.75rem" }} />
      </div>

      {/* Content */}
      <div
        style={{
          padding: layoutPadding,
          margin: "0 auto",
          marginTop: "0.75rem",
          maxWidth: contentMaxWidth,
          display: "grid",
          gap: sectionSpacing,
        }}
      >
        {/* Notifications Section */}
        <div style={{ display: "grid", gap: isMobile ? "1.1rem" : "1.35rem" }}>
          <div style={sectionLabelStyle}>Thông báo</div>

          <div style={cardWrapperStyle}>
            <SettingItem
              icon={Bell}
              label="Nhận thông báo"
              checked={settings.notifications}
              onChange={() => toggleSetting("notifications")}
              isMobile={isMobile}
            />
            <SettingItem
              icon={Bell}
              label="Cập nhật đơn hàng"
              checked={settings.orderUpdates}
              onChange={() => toggleSetting("orderUpdates")}
              isMobile={isMobile}
              hasBorder
            />
          </div>
        </div>

        {/* Security Section */}
        <div style={{ display: "grid", gap: isMobile ? "1.1rem" : "1.35rem" }}>
          <div style={sectionLabelStyle}>Cài đặt tài khoản</div>

          <div style={cardWrapperStyle}>
            <div
              onClick={() => setShowChangePwd(true)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.85rem",
                padding: isMobile ? "1.2rem 1.5rem" : "1.3rem 1.75rem",
                background: "transparent",
                cursor: "pointer",
                transition: "background 0.2s ease",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FAFAFA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "1.35rem" : "1.3rem",
                  color: "#1A1A1A",
                }}
              >
                Đổi mật khẩu
              </span>
              <span
                style={{
                  color: "#999",
                  fontSize: isMobile ? "1.4rem" : "1.5rem",
                }}
              >
                ›
              </span>
            </div>
            <div
              onClick={handleDeleteAccount}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.85rem",
                padding: isMobile ? "1.2rem 1.5rem" : "1.3rem 1.75rem",
                background: "transparent",
                cursor: deleting ? "not-allowed" : "pointer",
                opacity: deleting ? 0.6 : 1,
                transition: "background 0.2s ease",
                fontWeight: 600,
                borderTop: "1px solid #F0F0F0",
              }}
              onMouseEnter={(e) => {
                if (!deleting) e.currentTarget.style.background = "#FEF2F2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "1.35rem" : "1.3rem",
                  color: "#EF4444",
                }}
              >
                {deleting ? "Đang xoá..." : "Xoá tài khoản"}
              </span>
              <span
                style={{
                  color: "#F87171",
                  fontSize: isMobile ? "1.4rem" : "1.5rem",
                }}
              >
                ›
              </span>
            </div>
          </div>
        </div>

        {/* Other Section */}
        <div style={{ display: "grid", gap: isMobile ? "1.1rem" : "1.35rem" }}>
          <div style={sectionLabelStyle}>Khác</div>

          <div style={cardWrapperStyle}>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: isMobile ? "1.2rem 1.5rem" : "1.3rem 1.75rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FAFAFA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div
                style={{
                  width: isMobile ? "3rem" : "3.2rem",
                  height: isMobile ? "3rem" : "3.2rem",
                  borderRadius: "1rem",
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HelpCircle
                  size={isMobile ? 22 : 24}
                  color="#F59E0B"
                  strokeWidth={2}
                />
              </div>
              <span
                style={{
                  fontSize: isMobile ? "1.35rem" : "1.3rem",
                  color: "#1A1A1A",
                  fontWeight: 600,
                }}
              >
                Trợ giúp & Hỗ trợ
              </span>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: isMobile ? "1.2rem 1.5rem" : "1.3rem 1.75rem",
                background: "transparent",
                border: "none",
                borderTop: "1px solid #F0F0F0",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FAFAFA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div
                style={{
                  width: isMobile ? "3rem" : "3.2rem",
                  height: isMobile ? "3rem" : "3.2rem",
                  borderRadius: "1rem",
                  background: "#EDE9FE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield
                  size={isMobile ? 22 : 24}
                  color="#8B5CF6"
                  strokeWidth={2}
                />
              </div>
              <span
                style={{
                  fontSize: isMobile ? "1.35rem" : "1.3rem",
                  color: "#1A1A1A",
                  fontWeight: 600,
                }}
              >
                Chính sách & Điều khoản
              </span>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showChangePwd}
        onClose={() => setShowChangePwd(false)}
        userId={userId}
        isMobile={isMobile}
      />
    </div>
  );
}

// Inline SettingItem (moved from old SettingsDialog)
function SettingItem({ icon, label, checked, onChange, isMobile, hasBorder }) {
  const IconComponent = icon;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "1.2rem 1.5rem" : "1.3rem 1.75rem",
        borderTop: hasBorder ? "1px solid #F0F0F0" : "none",
        background: "transparent",
        transition: "background 0.25s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: isMobile ? "3rem" : "3.2rem",
            height: isMobile ? "3rem" : "3.2rem",
            borderRadius: "1rem",
            background: checked ? "#FFF5F0" : "#F5F5F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          <IconComponent
            size={isMobile ? 22 : 24}
            color={checked ? "#FE5621" : "#999"}
            strokeWidth={2}
          />
        </div>
        <span
          style={{
            fontSize: isMobile ? "1.35rem" : "1.3rem",
            color: "#1A1A1A",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
      </div>

      <label
        style={{
          position: "relative",
          display: "inline-block",
          width: isMobile ? "3.15rem" : "3.4rem",
          height: isMobile ? "1.65rem" : "1.8rem",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ display: "none" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: checked ? "#FE5621" : "#E0E0E0",
            borderRadius: "2rem",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "0.125rem",
              left: checked ? (isMobile ? "1.55rem" : "1.75rem") : "0.125rem",
              width: isMobile ? "1.35rem" : "1.45rem",
              height: isMobile ? "1.35rem" : "1.45rem",
              background: "#fff",
              borderRadius: "50%",
              transition: "all 0.3s",
              boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
      </label>
    </div>
  );
}
function ChangePasswordModal({ isOpen, onClose, userId, isMobile }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const rules = [
    { id: "len", label: "Tối thiểu 6 ký tự", test: (v) => v.length >= 6 },
    { id: "num", label: "Có ít nhất 1 chữ số", test: (v) => /\d/.test(v) },
    {
      id: "char",
      label: "Có ít nhất 1 chữ cái",
      test: (v) => /[A-Za-z]/.test(v),
    },
  ];

  const allValid =
    oldPassword &&
    newPassword &&
    confirmPassword &&
    rules.every((r) => r.test(newPassword)) &&
    newPassword === confirmPassword;

  const handleSubmit = async () => {
    setMessage("");
    if (!allValid) {
      setMessage("Vui lòng kiểm tra lại các điều kiện mật khẩu.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await axios.post(
        `${API_BASE_URL}/auth/change-password`,
        { userId, oldPassword, newPassword },
        { withCredentials: true }
      );
      if (res.data?.success) {
        setMessage("Đổi mật khẩu thành công");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(onClose, 900);
      } else {
        setMessage(res.data?.message || "Không thể đổi mật khẩu");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi đổi mật khẩu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: isMobile ? "1rem 1rem 0 0" : "1rem",
          width: isMobile ? "100%" : "520px",
          maxHeight: "90vh",
          height: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          overflow: "hidden",
          animation: "sheetUp 0.28s ease-out",
        }}
      >
        <div
          style={{
            padding: isMobile ? "1.5rem" : "1.75rem",
            display: "grid",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: isMobile ? "1.6rem" : "1.75rem",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Đổi mật khẩu
            </h3>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "#F5F5F5",
                cursor: "pointer",
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#E0E0E0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#F5F5F5")
              }
            >
              <X size={20} color="#666" strokeWidth={2.5} />
            </button>
          </div>
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={{
              padding: "1.1rem 1.2rem",
              borderRadius: "1rem",
              border: "1px solid #E0E0E0",
              fontSize: "1.2rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#FE5621")}
            onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              padding: "1.1rem 1.2rem",
              borderRadius: "1rem",
              border: "1px solid #E0E0E0",
              fontSize: "1.2rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#FE5621")}
            onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              padding: "1.1rem 1.2rem",
              borderRadius: "1rem",
              border: "1px solid #E0E0E0",
              fontSize: "1.2rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#FE5621")}
            onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
          />

          <div
            style={{
              display: "grid",
              gap: "0.5rem",
              marginTop: "0.5rem",
              background: "#FAFAFA",
              padding: "1rem",
              borderRadius: "0.75rem",
            }}
          >
            {rules.map((r) => {
              const ok = r.test(newPassword);
              return (
                <div
                  key={r.id}
                  style={{
                    fontSize: "1.1rem",
                    color: ok ? "#10B981" : "#999",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      borderRadius: "50%",
                      background: ok ? "#10B981" : "#E0E0E0",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    {ok ? "✓" : ""}
                  </span>
                  {r.label}
                </div>
              );
            })}
            {newPassword && confirmPassword && (
              <div
                style={{
                  fontSize: "1.1rem",
                  color:
                    newPassword === confirmPassword ? "#10B981" : "#EF4444",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.25rem",
                }}
              >
                <span
                  style={{
                    width: "1.2rem",
                    height: "1.2rem",
                    borderRadius: "50%",
                    background:
                      newPassword === confirmPassword ? "#10B981" : "#EF4444",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  {newPassword === confirmPassword ? "✓" : "✕"}
                </span>
                {newPassword === confirmPassword
                  ? "Xác nhận khớp"
                  : "Xác nhận không khớp"}
              </div>
            )}
          </div>

          {message && (
            <div
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: message.includes("thành công") ? "#10B981" : "#EF4444",
                background: message.includes("thành công")
                  ? "#F0FDF4"
                  : "#FEF2F2",
                padding: "1rem",
                borderRadius: "0.75rem",
                textAlign: "center",
              }}
            >
              {message}
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "1.2rem",
                borderRadius: "1rem",
                border: "none",
                background: "#F5F5F5",
                color: "#666",
                fontSize: "1.2rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#E0E0E0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#F5F5F5")
              }
            >
              Huỷ
            </button>
            <button
              onClick={handleSubmit}
              disabled={!allValid || submitting}
              style={{
                flex: 1,
                padding: "1.2rem",
                borderRadius: "1rem",
                border: "none",
                background: !allValid || submitting ? "#FFCCBC" : "#FE5621",
                color: "#fff",
                fontSize: "1.2rem",
                fontWeight: 700,
                cursor: !allValid || submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: !allValid || submitting ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (allValid && !submitting)
                  e.currentTarget.style.background = "#E64A19";
              }}
              onMouseLeave={(e) => {
                if (allValid && !submitting)
                  e.currentTarget.style.background = "#FE5621";
              }}
            >
              {submitting ? "Đang đổi..." : "Đổi mật khẩu"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sheetUp {
          from { opacity: 0; transform: translateY(2.5rem); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
