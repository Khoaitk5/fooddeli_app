import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
// Đã xóa LogOut khỏi import
import { MapPin, Clock, Gift, Settings, ChevronRight, Edit3, Truck, Store } from 'lucide-react';
import { EditProfileDialog } from '@/components/role-specific/Customer/EditProfileDialog';
import { AddressesDialog } from '@/components/role-specific/Customer/AddressesDialog';
import { VouchersDialog } from '@/components/role-specific/Customer/VouchersDialog';
import { SettingsDialog } from '@/components/role-specific/Customer/SettingsDialog';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/shared/Navbar';
// THÊM IMPORT MỚI
import AnimatedLogoutButton from '../../components/shared/AnimatedLogoutButton'; // (Hãy điều chỉnh đường dẫn này)

export function UserProfile({ isMobile: propIsMobile, isTablet: propIsTablet }) {
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth();
  const theme = useTheme();
  
  // Use Material-UI's useMediaQuery for responsive detection
  const detectedIsMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const detectedIsTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Use provided props if available, otherwise use detected values
  const isMobile = propIsMobile !== undefined ? propIsMobile : detectedIsMobile;
  const isTablet = propIsTablet !== undefined ? propIsTablet : detectedIsTablet;

  const [userData, setUserData] = useState({
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'vana@email.com',
    avatar: 'https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png',
    stats: {
      orders: 127,
      vouchers: 5
    }
  });

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showVouchers, setShowVouchers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Check user roles and profiles
  const hasShopProfile = authUser?.shop_profile && typeof authUser.shop_profile === 'object';
  const hasShipperProfile = authUser?.shipper_profile && typeof authUser.shipper_profile === 'object';
  const isShopRole = authUser?.role === 'shop';
  const isShipperRole = authUser?.role === 'shipper';

  const handleSaveProfile = (formData) => {
    setUserData(prev => ({ ...prev, ...formData }));
    setShowEditProfile(false);
  };

  const handleLogout = () => {
    console.log("👋 [UserProfile] Logging out...");
    logout();
    navigate("/login");
  };

  // Dynamic menu items based on user role and profiles
  const menuItems = [
    {
      icon: MapPin,
      title: 'Địa chỉ của tôi',
      color: '#ee4d2d',
      onClick: () => setShowAddresses(true)
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
    // Shipper menu item - hiển thị nếu có profile hoặc role shipper
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
    // Shop menu item - hiển thị nếu có profile hoặc role shop
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
      {/* Header with gradient */}
      <div style={{
        padding: `${isMobile ? '2rem' : isTablet ? '2.5rem' : '3rem'} ${padding}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 0.25rem 1rem rgba(238, 77, 45, 0.2)'
      }}>
        {/* Avatar with Edit Button */}
        <div style={{ position: 'relative', marginBottom: isMobile ? '1rem' : '1.25rem' }}>
          <div style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '0.25rem solid #fff',
            boxShadow: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.2)'
          }}>
            {/* Giả sử bạn có ảnh avatar, nếu không, div này sẽ trống */}
             <img src={userData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <button
            onClick={() => setShowEditProfile(true)}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: isMobile ? '2.5rem' : '3rem',
              height: isMobile ? '2.5rem' : '3rem',
              borderRadius: '50%',
              background: '#ee4d2d',
              border: '0.25rem solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0.25rem 0.75rem rgba(238, 77, 45, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 0.375rem 1rem rgba(238, 77, 45, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0.25rem 0.75rem rgba(238, 77, 45, 0.4)';
            }}
          >
            <Edit3 size={isMobile ? 16 : 18} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* User Info */}
        <h2 style={{
          margin: 0,
          fontSize: isMobile ? '1.25rem' : isTablet ? '1.5rem' : '1.75rem',
          fontWeight: '600',
          color: '#000',
          marginBottom: '0.5rem'
        }}>
          {userData.name}
        </h2>
        <div style={{
          fontSize: isMobile ? '0.9375rem' : '1rem',
          color: '#000'
        }}>
          {userData.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: padding,
        paddingBottom: isMobile ? '5rem' : '6rem'
      }}>
        {/* Stats Card */}
        <div style={{
          background: '#fff',
          borderRadius: isMobile ? '1rem' : '1.25rem',
          padding: isMobile ? '1.25rem' : isTablet ? '1.5rem' : '1.75rem',
          marginBottom: isMobile ? '1rem' : '1.25rem',
          boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              fontSize: isMobile ? '2rem' : isTablet ? '2.25rem' : '2.5rem',
              fontWeight: '600',
              color: '#ee4d2d',
              marginBottom: '0.25rem'
            }}>
              {userData.stats.orders}
            </div>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '0.9375rem',
              color: '#666'
            }}>
              Đơn hàng
            </div>
          </div>

          <div style={{
            width: '0.0625rem',
            background: '#f0f0f0'
          }} />

          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              fontSize: isMobile ? '2rem' : isTablet ? '2.25rem' : '2.5rem',
              fontWeight: '600',
              color: '#ec4899',
              marginBottom: '0.25rem'
            }}>
              {userData.stats.vouchers}
            </div>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '0.9375rem',
              color: '#666'
            }}>
              Voucher
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{
          background: '#fff',
          borderRadius: isMobile ? '1rem' : '1.25rem',
          overflow: 'hidden',
          boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)',
          marginBottom: isMobile ? '1rem' : '1.25rem'
        }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '1rem' : '1.25rem',
                  padding: isMobile ? '1.125rem 1.25rem' : isTablet ? '1.25rem 1.5rem' : '1.5rem 1.75rem',
                  background: '#fff',
                  border: 'none',
                  borderBottom: index < menuItems.length - 1 ? '0.0625rem solid #f5f5f5' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <div style={{
                  width: isMobile ? '2.75rem' : isTablet ? '3rem' : '3.25rem',
                  height: isMobile ? '2.75rem' : isTablet ? '3rem' : '3.25rem',
                  borderRadius: isMobile ? '0.75rem' : '1rem',
                  background: `${item.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={isMobile ? 20 : isTablet ? 22 : 24} color={item.color} strokeWidth={2} />
                </div>
                <div style={{
                  flex: 1,
                  fontSize: isMobile ? '1rem' : isTablet ? '1.0625rem' : '1.125rem',
                  fontWeight: '500',
                  color: '#333'
                }}>
                  {item.title}
                </div>
                <ChevronRight size={isMobile ? 20 : 22} color="#ccc" strokeWidth={2} />
              </button>
            );
          })}
        </div>

        {/* --- THAY THẾ NÚT LOGOUT --- */}
        {/* Thêm một wrapper để căn giữa nút (vì nút mới có width cố định 130px) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: '1rem' // Thêm khoảng cách
        }}>
          <AnimatedLogoutButton onLogout={handleLogout} />
        </div>
        {/* --- KẾT THÚC THAY THẾ --- */}
        
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
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <VouchersDialog
        isOpen={showVouchers}
        onClose={() => setShowVouchers(false)}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <SettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      {/* Navbar */}
      <Navbar isProfilePage={true} />
    </div>
  );
}