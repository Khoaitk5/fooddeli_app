import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  MapPin, CreditCard, Clock, Gift, Settings, ChevronRight, LogOut,
  Edit3, Truck, Store
} from 'lucide-react';
import axios from 'axios';
import { EditProfileDialog } from '@/components/role-specific/Customer/EditProfileDialog';
import { AddressesDialog } from '@/components/role-specific/Customer/AddressesDialog';
import { VouchersDialog } from '@/components/role-specific/Customer/VouchersDialog';
import { SettingsDialog } from '@/components/role-specific/Customer/SettingsDialog';
import { PaymentMethodsDialog } from '@/components/role-specific/Customer/PaymentMethodsDialog';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/shared/Navbar';
import AnimatedLogoutButton from '../../components/shared/AnimatedLogoutButton';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function UserProfile({ isMobile: propIsMobile, isTablet: propIsTablet }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();

  const detectedIsMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const detectedIsTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = propIsMobile !== undefined ? propIsMobile : detectedIsMobile;
  const isTablet = propIsTablet !== undefined ? propIsTablet : detectedIsTablet;

  // ✅ User data from backend
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Dialog states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showVouchers, setShowVouchers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false); // ✅ Thêm dòng này

  // 🔹 Fetch user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true });
        if (res.data?.user) {
          const u = res.data.user;
          setUserData({
            id: u.id,
            name: u.full_name || u.username,
            phone: u.phone || "Chưa có số điện thoại",
            email: u.email,
            avatar: u.avatar_url || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            stats: {
              orders: u.order_count || 0,
              vouchers: u.voucher_count || 0
            },
            role: u.role,
            shop_profile: u.shop_profile,
            shipper_profile: u.shipper_profile
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
    setUserData(prev => ({ ...prev, ...formData }));
    setShowEditProfile(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !userData) {
    return (
      <div style={{
        width: '100%', height: '100vh', display: 'flex',
        justifyContent: 'center', alignItems: 'center', color: '#666'
      }}>
        Đang tải thông tin người dùng...
      </div>
    );
  }

  const hasShopProfile = userData.shop_profile && typeof userData.shop_profile === 'object';
  const hasShipperProfile = userData.shipper_profile && typeof userData.shipper_profile === 'object';
  const isShopRole = userData.role === 'shop';
  const isShipperRole = userData.role === 'shipper';

  // 🔹 Menu Items
  const menuItems = [
    {
      icon: MapPin,
      title: 'Địa chỉ của tôi',
      color: '#ee4d2d',
      onClick: () => setShowAddresses(true)
    },
    {
      icon: CreditCard,
      title: 'Phương thức thanh toán',
      color: '#0ea5e9',
      onClick: () => setShowPaymentMethods(true)
    },
    {
      icon: Clock,
      title: 'Lịch sử đơn hàng',
      color: '#8b5cf6',
      onClick: () => navigate('/customer/orders')
    },
    {
      icon: Gift,
      title: 'Voucher & Ưu đãi',
      color: '#ec4899',
      onClick: () => setShowVouchers(true)
    },
    ...(isShipperRole || hasShipperProfile ? [{
      icon: Truck,
      title: 'Chuyển đến trang Shipper',
      color: '#f97316',
      onClick: () => navigate('/shipper/dashboard')
    }] : isShopRole ? [] : [{
      icon: Truck,
      title: 'Đăng kí trở thành Shipper',
      color: '#f97316',
      onClick: () => navigate('/customer/register-shipper')
    }]),
    ...(isShopRole || hasShopProfile ? [{
      icon: Store,
      title: 'Chuyển đến trang Shop',
      color: '#10b981',
      onClick: () => navigate('/shop/dashboard')
    }] : isShipperRole ? [] : [{
      icon: Store,
      title: 'Đăng kí trở thành chủ Shop',
      color: '#10b981',
      onClick: () => navigate('/customer/register-shop')
    }]),
    {
      icon: Settings,
      title: 'Cài đặt',
      color: '#64748b',
      onClick: () => setShowSettings(true)
    }
  ];

  const padding = isMobile ? '1rem' : isTablet ? '1.25rem' : '1.5rem';
  const avatarSize = isMobile ? '5rem' : isTablet ? '6rem' : '7rem';

  return (
    <div style={{ width: '100%', height: '100%', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        padding: `${isMobile ? '2rem' : isTablet ? '2.5rem' : '3rem'} ${padding}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxShadow: '0 0.25rem 1rem rgba(238, 77, 45, 0.2)',
        background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)'
      }}>
        <div style={{ position: 'relative', marginBottom: isMobile ? '1rem' : '1.25rem' }}>
          <div style={{
            width: avatarSize, height: avatarSize, borderRadius: '50%',
            overflow: 'hidden', border: '0.25rem solid #fff',
            boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.2)',
            backgroundImage: `url(${userData.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
          <button
            onClick={() => setShowEditProfile(true)}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: isMobile ? '2.5rem' : '3rem',
              height: isMobile ? '2.5rem' : '3rem',
              borderRadius: '50%', background: '#ee4d2d',
              border: '0.25rem solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 0.25rem 0.75rem rgba(238,77,45,0.4)',
              transition: 'all 0.2s'
            }}
          >
            <Edit3 size={isMobile ? 16 : 18} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        <h2 style={{
          margin: 0,
          fontSize: isMobile ? '1.25rem' : isTablet ? '1.5rem' : '1.75rem',
          fontWeight: '600', color: '#fff', marginBottom: '0.5rem'
        }}>
          {userData.name}
        </h2>
        <div style={{
          fontSize: isMobile ? '0.9375rem' : '1rem',
          color: 'rgba(255,255,255,0.9)'
        }}>
          {userData.phone}
        </div>
      </div>

      {/* Stats + Menu */}
      <div style={{ padding: padding, paddingBottom: isMobile ? '5rem' : '6rem' }}>
        {/* Stats */}
        <div style={{
          background: '#fff',
          borderRadius: isMobile ? '1rem' : '1.25rem',
          padding: isMobile ? '1.25rem' : isTablet ? '1.5rem' : '1.75rem',
          marginBottom: isMobile ? '1rem' : '1.25rem',
          boxShadow: '0 0.125rem 1rem rgba(0,0,0,0.06)',
          display: 'flex', justifyContent: 'space-around'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              fontSize: isMobile ? '2rem' : '2.25rem',
              fontWeight: '600', color: '#ee4d2d', marginBottom: '0.25rem'
            }}>{userData.stats.orders}</div>
            <div style={{ fontSize: '0.9375rem', color: '#666' }}>Đơn hàng</div>
          </div>
          <div style={{ width: '0.0625rem', background: '#f0f0f0' }} />
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              fontSize: isMobile ? '2rem' : '2.25rem',
              fontWeight: '600', color: '#ec4899', marginBottom: '0.25rem'
            }}>{userData.stats.vouchers}</div>
            <div style={{ fontSize: '0.9375rem', color: '#666' }}>Voucher</div>
          </div>
        </div>

        {/* Menu */}
        <div style={{
          background: '#fff',
          borderRadius: isMobile ? '1rem' : '1.25rem',
          overflow: 'hidden',
          boxShadow: '0 0.125rem 1rem rgba(0,0,0,0.06)',
          marginBottom: isMobile ? '1rem' : '1.25rem'
        }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button key={index} onClick={item.onClick} style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '1rem', padding: '1.25rem 1.5rem', background: '#fff',
                border: 'none', borderBottom: index < menuItems.length - 1 ? '1px solid #f5f5f5' : 'none',
                cursor: 'pointer', textAlign: 'left'
              }}>
                <div style={{
                  width: '3rem', height: '3rem', borderRadius: '1rem',
                  background: `${item.color}10`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon size={22} color={item.color} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, fontSize: '1.1rem', fontWeight: '500', color: '#333' }}>
                  {item.title}
                </div>
                <ChevronRight size={22} color="#ccc" strokeWidth={2} />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          style={{
            width: '100%',
            padding: '1.25rem',
            background: '#fff',
            border: '2px solid #ee4d2d',
            borderRadius: '1.25rem',
            color: '#ee4d2d',
            fontSize: '1.05rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ee4d2d';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#ee4d2d';
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
      <AddressesDialog isOpen={showAddresses} onClose={() => setShowAddresses(false)} />
      <PaymentMethodsDialog
        isOpen={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <VouchersDialog isOpen={showVouchers} onClose={() => setShowVouchers(false)} />
      <SettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <Navbar isProfilePage={true} />
    </div>
  );
}
  