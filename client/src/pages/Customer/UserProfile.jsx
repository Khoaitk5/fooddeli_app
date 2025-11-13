import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery, Box, Stack, Skeleton, Slide, Fade } from "@mui/material";
import {
  MapPin,
  CreditCard,
  Settings,
  ChevronRight,
  Edit3,
  Truck,
  Store,
  Phone,
  Mail,
} from "lucide-react";
import axios from "axios";
import { EditProfileDialog } from "@/components/role-specific/Customer/EditProfileDialog";
import { AddressesDialog } from "@/components/role-specific/Customer/AddressesDialog";
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
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
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
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        <Box sx={{
          p: "2.5rem 1.5rem 5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(135deg, #FE5621 0%, #FF7A50 100%)",
          position: "relative"
        }}>
          <Stack alignItems="center" spacing={1.25} sx={{ zIndex: 1 }}>
            <Skeleton variant="circular" width={128} height={128} sx={{ border: "4px solid #fff", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }} />
            <Skeleton variant="text" width={200} height={28} sx={{ bgcolor: "rgba(255,255,255,0.6)" }} />
            <Skeleton variant="text" width={260} height={22} sx={{ bgcolor: "rgba(255,255,255,0.5)" }} />
          </Stack>
        </Box>

        <Box sx={{ p: "0 1.5rem", mt: -7, mb: 2 }}>
          <Box sx={{
            background: "#fff",
            borderRadius: "1.75rem",
            p: "1.75rem 1.25rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}>
            <Skeleton variant="rounded" height={96} />
            <Skeleton variant="rounded" height={96} />
          </Box>
        </Box>

        <Box sx={{ p: "0 1.5rem", mb: 2 }}>
          <Box sx={{ background: "#fff", borderRadius: "1.75rem", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            {[...Array(3)].map((_, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, p: "1.25rem 1.5rem", borderBottom: i < 2 ? "1px solid #f0f0f0" : "none" }}>
                <Skeleton variant="rounded" width={52} height={52} sx={{ borderRadius: 3 }} />
                <Skeleton variant="text" width="60%" height={22} />
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ p: "0 1.5rem 8rem" }}>
          <Skeleton variant="rounded" height={54} />
        </Box>
      </Box>
    );
  }

  const hasShopProfile =
    userData.shop_profile && typeof userData.shop_profile === "object";
  const hasShipperProfile =
    userData.shipper_profile && typeof userData.shipper_profile === "object";
  const isShopRole = userData.role === "shop";
  const isShipperRole = userData.role === "shipper";
  const roleLabel = isShopRole ? "Chủ Shop" : isShipperRole ? "Shipper" : "Khách hàng";
  const rating = userData.stats.orders > 0 ? "4.8" : "0";
  const membership = userData.stats.orders >= 50
    ? { label: "Hạng Vàng", color: "#f59e0b" }
    : userData.stats.orders >= 10
    ? { label: "Hạng Bạc", color: "#64748b" }
    : { label: "Thành viên mới", color: "#94a3b8" };
  const roleColor = isShopRole ? "#10b981" : isShipperRole ? "#f97316" : "#60a5fa";

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
      onClick: () => navigate("/customer/settings"),
    },
  ];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f5f5f5" }}>
      <Slide in={mounted} direction="down" timeout={600}>
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
        {/* Decorative glows */}
        <div
          style={{
            position: "absolute",
            top: -30,
            left: -30,
            width: 160,
            height: 160,
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)",
            filter: "blur(10px)",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            right: -20,
            width: 220,
            height: 220,
            background: "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.25), rgba(255,255,255,0) 60%)",
            filter: "blur(16px)",
            opacity: 0.6,
          }}
        />

        <div
          style={{
            position: "relative",
            marginBottom: "1.25rem",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "8.75rem",
              height: "8.75rem",
              borderRadius: "50%",
              padding: "5px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.55) 100%)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.85)",
                backgroundImage: `url(${userData.avatar})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
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
              const svg = e.currentTarget.querySelector('svg');
              if (svg) svg.setAttribute('stroke', '#fff');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "#fff";
              const svg = e.currentTarget.querySelector('svg');
              if (svg) svg.setAttribute('stroke', '#FE5621');
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
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.75rem",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.35)",
            color: "#fff",
            fontWeight: "800",
            fontSize: "0.8rem",
            marginBottom: "0.5rem",
            backdropFilter: "blur(6px)",
            zIndex: 1,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: roleColor, boxShadow: "0 0 0 3px rgba(255,255,255,0.25)" }} />
          {roleLabel}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              fontWeight: "700",
              fontSize: "0.95rem",
              backdropFilter: "blur(6px)",
            }}
          >
            <Phone size={16} strokeWidth={2.5} />
            {userData.phone}
          </div>
          {userData.email && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.35)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "0.95rem",
                backdropFilter: "blur(6px)",
              }}
            >
              <Mail size={16} strokeWidth={2.5} />
              {userData.email}
            </div>
          )}
        </div>
        </div>
      </Slide>

      <Fade in={mounted} timeout={800}>
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
              padding: "1.25rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                gap: "1rem",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    margin: "0 auto 0.5rem",
                    borderRadius: "1rem",
                    background: "linear-gradient(135deg, #FE5621 0%, #FF7A50 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    boxShadow: "0 4px 12px rgba(254, 86, 33, 0.25)",
                  }}
                >
                  📦
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#FE5621", marginBottom: "0.1rem" }}>
                  {userData.stats.orders}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600" }}>
                  Đơn hàng
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    margin: "0 auto 0.5rem",
                    borderRadius: "1rem",
                    background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                  }}
                >
                  ⭐
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#10b981", marginBottom: "0.1rem" }}>
                  {rating}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600" }}>
                  Đánh giá
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    margin: "0 auto 0.5rem",
                    borderRadius: "1rem",
                    background: "linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                  }}
                >
                  🎖️
                </div>
                <div style={{ fontSize: "1.15rem", fontWeight: "800", color: membership.color, marginBottom: "0.1rem" }}>
                  {membership.label}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600" }}>
                  Thành viên
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fade>

      <Fade in={mounted} timeout={900}>
        <div style={{ padding: "0 1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{
            fontSize: "1.35rem",
            fontWeight: "700",
            color: "#1a1a1a",
            marginBottom: "1rem",
            marginLeft: "0.25rem",
            letterSpacing: "-0.5px",
          }}>
            Hành động nhanh
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(3, 1fr)",
              gap: "1rem",
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
                    gap: "0.75rem",
                    padding: "1rem",
                    background: "#fff",
                    border: "1px solid #f1f5f9",
                    borderRadius: "1.25rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.1)";
                    e.currentTarget.style.background = "#fafafa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "0.9rem",
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
                      fontWeight: "700",
                      color: "#0f172a",
                      letterSpacing: "-0.25px",
                    }}
                  >
                    {item.title}
                  </div>
                  <ChevronRight size={20} color="#cbd5e1" strokeWidth={2.5} />
                </button>
              );
            })}
          </div>
        </div>
      </Fade>

      <Fade in={mounted} timeout={1000}>
        <div style={{ padding: "0 1.5rem 8rem" }}>
          <AnimatedLogoutButton onLogout={handleLogout} />
        </div>
      </Fade>

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
      <Navbar isProfilePage={true} />
    </div>
  );
}
