import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTheme,
  useMediaQuery,
  Box,
  Stack,
  Skeleton,
  Slide,
  Fade,
} from "@mui/material";
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
              reviews: u.review_count || 0,
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
      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#FAFAFA" }}>
        <Box
          sx={{
            p: "2.5rem 1.5rem 4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(135deg, #FE5621 0%, #FF8A65 100%)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Stack alignItems="center" spacing={1.5}>
            <Skeleton
              variant="circular"
              width={140}
              height={140}
              sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            />
            <Skeleton variant="text" width={180} height={32} />
            <Skeleton variant="text" width={220} height={24} />
          </Stack>
        </Box>

        <Box sx={{ p: "0 1.5rem", mt: -7, mb: 2 }}>
          <Box
            sx={{
              background: "#fff",
              borderRadius: "1.75rem",
              p: "1.75rem 1.25rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem",
            }}
          >
            <Skeleton variant="rounded" height={96} />
            <Skeleton variant="rounded" height={96} />
          </Box>
        </Box>

        <Box sx={{ p: "0 1.5rem", mb: 2 }}>
          <Box
            sx={{
              background: "#fff",
              borderRadius: "1.75rem",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: "1.25rem 1.5rem",
                  borderBottom: i < 2 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <Skeleton
                  variant="rounded"
                  width={52}
                  height={52}
                  sx={{ borderRadius: 3 }}
                />
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
  const roleLabel = isShopRole
    ? "Chủ Shop"
    : isShipperRole
    ? "Shipper"
    : "Khách hàng";
  const rating = userData.rating ? userData.rating.toFixed(1) : "0";
  const membership =
    userData.stats.orders >= 50
      ? { label: "Hạng Vàng", color: "#f59e0b" }
      : userData.stats.orders >= 10
      ? { label: "Hạng Bạc", color: "#64748b" }
      : { label: "Thành viên mới", color: "#94a3b8" };
  const roleColor = isShopRole
    ? "#10b981"
    : isShipperRole
    ? "#f97316"
    : "#60a5fa";

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
    <div style={{ width: "100%", minHeight: "100vh", background: "#FAFAFA" }}>
      <Slide in={mounted} direction="down" timeout={600}>
        <div
          style={{
            padding: "2.5rem 1.5rem 4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(135deg, #FE5621 0%, #FF8A65 100%)",
            position: "relative",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              position: "relative",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "10rem",
                height: "10rem",
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid #FE5621",
                boxShadow: "0 8px 30px rgba(254, 86, 33, 0.25)",
                backgroundImage: `url(${userData.avatar})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <button
              onClick={() => setShowEditProfile(true)}
              style={{
                position: "absolute",
                bottom: "0.5rem",
                right: "0.5rem",
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "50%",
                background: "#FE5621",
                border: "3px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(254, 86, 33, 0.35)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(254, 86, 33, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(254, 86, 33, 0.35)";
              }}
            >
              <Edit3 size={20} color="white" strokeWidth={2.5} />
            </button>
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: "700",
              color: "white",
              marginBottom: "0.8rem",
              letterSpacing: "-0.5px",
              textAlign: "center",
              textShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {userData.name}
          </h2>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.25)",
              border: "2px solid white",
              color: "white",
              fontWeight: "700",
              fontSize: "1.1rem",
              marginBottom: "1rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "white",
                boxShadow: "0 0 0 2px rgba(255,255,255,0.3)",
              }}
            />
            {roleLabel}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.8rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1rem",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: "600",
                fontSize: "1.1rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <Phone size={18} strokeWidth={2} />
              {userData.phone}
            </div>
            {userData.email && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1rem",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Mail size={18} strokeWidth={2} />
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
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "1.6rem",
              padding: "1.5rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(3, 1fr)",
                gap: "1rem",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "4rem",
                    height: "4rem",
                    margin: "0 auto 0.8rem",
                    borderRadius: "1.2rem",
                    background:
                      "linear-gradient(135deg, #FFF5F0 0%, #FFE5DB 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    boxShadow: "0 4px 12px rgba(254, 86, 33, 0.15)",
                  }}
                >
                  📦
                </div>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "#1A1A1A",
                    marginBottom: "0.3rem",
                  }}
                >
                  {userData.stats.orders}
                </div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    color: "#666",
                    fontWeight: "600",
                  }}
                >
                  Đơn hàng
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "4rem",
                    height: "4rem",
                    margin: "0 auto 0.8rem",
                    borderRadius: "1.2rem",
                    background:
                      "linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
                  }}
                >
                  ⭐
                </div>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "#1A1A1A",
                    marginBottom: "0.3rem",
                  }}
                >
                  {rating}
                </div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    color: "#666",
                    fontWeight: "600",
                  }}
                >
                  {userData.stats.reviews} đánh giá
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "4rem",
                    height: "4rem",
                    margin: "0 auto 0.8rem",
                    borderRadius: "1.2rem",
                    background:
                      "linear-gradient(135deg, #F5F3FF 0%, #E9D5FF 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
                  }}
                >
                  🎖️
                </div>
                <div
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: membership.color,
                    marginBottom: "0.3rem",
                  }}
                >
                  {membership.label}
                </div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    color: "#666",
                    fontWeight: "600",
                  }}
                >
                  Thành viên
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fade>

      <Fade in={mounted} timeout={900}>
        <div style={{ padding: "0 1.5rem", marginBottom: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1.6rem",
              fontWeight: "700",
              color: "#1A1A1A",
              marginBottom: "1.2rem",
              letterSpacing: "-0.5px",
            }}
          >
            Hành động nhanh
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : isTablet
                ? "repeat(3, 1fr)"
                : "repeat(3, 1fr)",
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
                    gap: "1rem",
                    padding: "1.2rem",
                    background: "white",
                    border: "none",
                    borderRadius: "1.2rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(0,0,0,0.06)";
                  }}
                >
                  <div
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "1rem",
                      background: `${item.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: `0 2px 8px ${item.color}15`,
                    }}
                  >
                    <Icon size={24} color={item.color} strokeWidth={2.5} />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "#1A1A1A",
                    }}
                  >
                    {item.title}
                  </div>
                  <ChevronRight size={22} color="#999" strokeWidth={2} />
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
