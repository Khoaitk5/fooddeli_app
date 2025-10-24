import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Clock, Gift, Settings, ChevronRight, LogOut, Edit3 } from 'lucide-react';
import { EditProfileDialog } from '@/components/role-specific/Customer/EditProfileDialog';
import { AddressesDialog } from '@/components/role-specific/Customer/AddressesDialog';
import { PaymentMethodsDialog } from '@/components/role-specific/Customer/PaymentMethodsDialog';
import { VouchersDialog } from '@/components/role-specific/Customer/VouchersDialog';
import { SettingsDialog } from '@/components/role-specific/Customer/SettingsDialog';
import Navbar from '../../components/shared/Navbar';

export function UserProfile({ isMobile, isTablet }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'Nguyễn Thị Lan Anh',
    phone: '0901234567',
    email: 'lananh@email.com',
    avatar: 'https://images.unsplash.com/photo-1589553009868-c7b2bb474531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTYxMDk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    stats: {
      orders: 127,
      vouchers: 5
    }
  });

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showVouchers, setShowVouchers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSaveProfile = (formData) => {
    setUserData(prev => ({ ...prev, ...formData }));
    setShowEditProfile(false);
  };

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
        background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
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
          color: '#fff',
          marginBottom: '0.5rem'
        }}>
          {userData.name}
        </h2>
        <div style={{
          fontSize: isMobile ? '0.9375rem' : '1rem',
          color: 'rgba(255, 255, 255, 0.9)'
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

        {/* Logout Button */}
        <button style={{
          width: '100%',
          padding: isMobile ? '1.125rem' : isTablet ? '1.25rem' : '1.375rem',
          background: '#fff',
          border: '0.125rem solid #ee4d2d',
          borderRadius: isMobile ? '1rem' : '1.25rem',
          color: '#ee4d2d',
          fontSize: isMobile ? '1rem' : '1.0625rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.625rem',
          boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)',
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
        >
          <LogOut size={isMobile ? 20 : 22} strokeWidth={2.5} />
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
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <PaymentMethodsDialog
        isOpen={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
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
