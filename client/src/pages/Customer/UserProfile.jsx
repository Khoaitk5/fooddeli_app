import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  MapPin,
  CreditCard,
  Clock,
  Settings,
  ChevronRight,
  LogOut,
  Edit3,
  Truck,
  Store,
} from "lucide-react";
import axios from "axios";
import { EditProfileDialog } from "@/components/role-specific/Customer/EditProfileDialog";
import { AddressesDialog } from "@/components/role-specific/Customer/AddressesDialog";
import { SettingsDialog } from "@/components/role-specific/Customer/SettingsDialog";
import { PaymentMethodsDialog } from "@/components/role-specific/Customer/PaymentMethodsDialog";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/shared/Navbar";
import AnimatedLogoutButton from "../../components/shared/AnimatedLogoutButton";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function UserProfile({
  isMobile: propIsMobile,
  isTablet: propIsTablet,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();

  const detectedIsMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const detectedIsTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = propIsMobile !== undefined ? propIsMobile : detectedIsMobile;
  const isTablet = propIsTablet !== undefined ? propIsTablet : detectedIsTablet;

  // ✅ User data from backend
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Dialog states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false); // ✅ Thêm dòng này

  // 🔹 Fetch user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/me`, {
          withCredentials: true,
        });
        if (res.data?.user) {
          const u = res.data.user;
          setUserData({
            id: u.id,
            name: u.full_name || u.username,
            phone: u.phone || "Chưa có số điện thoại",
            email: u.email,
            avatar:
              u.avatar_url ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            stats: {
              orders: u.order_count || 0,
            },
            role: u.role,
            shop_profile: u.shop_profile,
            shipper_profile: u.shipper_profile,
          });
        }
      } catch (err) {
        console.error("❌ Lỗi tải thông tin user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = (formData) => {
    setUserData((prev) => ({ ...prev, ...formData }));
    setShowEditProfile(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !userData) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#666",
        }}
      >
        Đang tải thông tin người dùng...
      </div>
    );
  }

  const hasShopProfile =
    userData.shop_profile && typeof userData.shop_profile === "object";
  const hasShipperProfile =
    userData.shipper_profile && typeof userData.shipper_profile === "object";
  const isShopRole = userData.role === "shop";
  const isShipperRole = userData.role === "shipper";

  // 🔹 Menu Items
  const menuItems = [
    {
      icon: MapPin,
      title: "Địa chỉ của tôi",
      color: "#ee4d2d",
      onClick: () => setShowAddresses(true),
    },
    ...(isShipperRole || hasShipperProfile
      ? [
          {
            icon: Truck,
            title: "Chuyển đến trang Shipper",
            color: "#f97316",
            onClick: () => navigate("/shipper/dashboard"),
          },
        ]
      : isShopRole
      ? []
      : [
          {
            icon: Truck,
            title: "Đăng kí trở thành Shipper",
            color: "#f97316",
            onClick: () => navigate("/customer/register-shipper"),
          },
        ]),
    ...(isShopRole || hasShopProfile
      ? [
          {
            icon: Store,
            title: "Chuyển đến trang Shop",
            color: "#10b981",
            onClick: () => navigate("/shop/dashboard"),
          },
        ]
      : isShipperRole
      ? []
      : [
          {
            icon: Store,
            title: "Đăng kí trở thành chủ Shop",
            color: "#10b981",
            onClick: () => navigate("/customer/register-shop"),
          },
        ]),
    {
      icon: Settings,
      title: "Cài đặt",
      color: "#64748b",
      onClick: () => setShowSettings(true),
    },
  ];

  const padding = isMobile ? "1rem" : isTablet ? "1.25rem" : "1.5rem";
  const avatarSize = isMobile ? "5rem" : isTablet ? "6rem" : "7rem";

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Header */}
      <div
        style={{
          padding: "2.5rem 1.5rem 5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(135deg, #FE5621 0%, #FF7A50 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            marginBottom: "1.25rem",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "8rem",
              height: "8rem",
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid #fff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              backgroundImage: `url(${userData.avatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <button
            onClick={() => setShowEditProfile(true)}
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              background: "#fff",
              border: "3px solid #FE5621",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(254, 86, 33, 0.4)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.background = "#FE5621";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "#fff";
            }}
          >
            <Edit3 size={18} color="#FE5621" strokeWidth={2.5} />
          </button>
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: "1.75rem",
            fontWeight: "700",
            color: "#fff",
            marginBottom: "0.5rem",
            textShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1,
            letterSpacing: "-0.5px",
            textAlign: "center",
          }}
        >
          {userData.name}
        </h2>
        <div
          style={{
            fontSize: "1.05rem",
            color: "rgba(255,255,255,0.95)",
            marginBottom: "0.35rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 1,
            fontWeight: "500",
          }}
        >
          📞 {userData.phone}
        </div>
        {userData.email && (
          <div
            style={{
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              zIndex: 1,
              fontWeight: "500",
            }}
          >
            ✉️ {userData.email}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div
        style={{
          padding: "0 1.5rem",
          marginTop: "-3.5rem",
          marginBottom: "1.5rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "1.75rem",
            padding: "1.75rem 1.25rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "4rem",
                height: "4rem",
                margin: "0 auto 0.75rem",
                borderRadius: "1.125rem",
                background: "linear-gradient(135deg, #FE5621 0%, #FF7A50 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                boxShadow: "0 4px 12px rgba(254, 86, 33, 0.25)",
              }}
            >
              📦
            </div>
            <div style={{ fontSize: "1.85rem", fontWeight: "700", color: "#FE5621", marginBottom: "0.25rem" }}>
              {userData.stats.orders}
            </div>
            <div style={{ fontSize: "0.95rem", color: "#666", fontWeight: "500" }}>
              Đơn hàng
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "4rem",
                height: "4rem",
                margin: "0 auto 0.75rem",
                borderRadius: "1.125rem",
                background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
              }}
            >
              ⭐
            </div>
            <div style={{ fontSize: "1.85rem", fontWeight: "700", color: "#10b981", marginBottom: "0.25rem" }}>
              {userData.stats.orders > 0 ? "4.8" : "0"}
            </div>
            <div style={{ fontSize: "0.95rem", color: "#666", fontWeight: "500" }}>
              Đánh giá
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: "0 1.5rem", marginBottom: "1.5rem" }}>
        <h3 style={{
          fontSize: "1.35rem",
          fontWeight: "700",
          color: "#1a1a1a",
          marginBottom: "1rem",
          marginLeft: "0.25rem",
          letterSpacing: "-0.5px",
        }}>
          Tài khoản của tôi
        </h3>
        <div
          style={{
            background: "#fff",
            borderRadius: "1.75rem",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1.25rem 1.5rem",
                  background: "#fff",
                  border: "none",
                  borderBottom:
                    index < menuItems.length - 1 ? "1px solid #f0f0f0" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fafafa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                <div
                  style={{
                    width: "3.25rem",
                    height: "3.25rem",
                    borderRadius: "1rem",
                    background: `${item.color}12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} color={item.color} strokeWidth={2.5} />
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: "1.05rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    letterSpacing: "-0.25px",
                  }}
                >
                  {item.title}
                </div>
                <ChevronRight size={22} color="#bbb" strokeWidth={2.5} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: "0 1.5rem 8rem" }}>
        <button
          style={{
            width: "100%",
            padding: "1.25rem",
            background: "linear-gradient(135deg, #FE5621 0%, #FF7A50 100%)",
            border: "none",
            borderRadius: "1.5rem",
            color: "#fff",
            fontSize: "1.15rem",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.625rem",
            transition: "all 0.3s",
            boxShadow: "0 6px 20px rgba(254, 86, 33, 0.35)",
            letterSpacing: "-0.25px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(254, 86, 33, 0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(254, 86, 33, 0.35)";
          }}
          onClick={handleLogout}
        >
          <LogOut size={22} strokeWidth={2.5} />
          Đăng xuất
        </button>
      </div>

      {/* Dialogs */}
      <EditProfileDialog
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        userData={userData}
        onSave={handleSaveProfile}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <AddressesDialog
        isOpen={showAddresses}
        onClose={() => setShowAddresses(false)}
      />
      <PaymentMethodsDialog
        isOpen={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <SettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <Navbar isProfilePage={true} />
    </div>
  );
}
