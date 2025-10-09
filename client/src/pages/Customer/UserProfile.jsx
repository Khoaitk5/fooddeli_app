import { useState } from 'react';
import { MapPin, CreditCard, Clock, Gift, Settings, ChevronRight, LogOut, Edit2 } from 'lucide-react';
import { EditProfileDialog } from '@/components/role-specific/Customer/EditProfileDialog';
import Navbar from '../../components/shared/Navbar';

export function UserProfile({ isMobile = false, isTablet = false }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Nguyễn Thị Lan Anh',
    phone: '0901234567',
    email: 'lananh@email.com',
    avatar: 'https://images.unsplash.com/photo-1589553009868-c7b2bb474531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTYxMDk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    stats: {
      orders: 127,
      points: 2450,
      vouchers: 5
    }
  });

  const handleSaveProfile = (updatedData) => {
    setUserData(prev => ({
      ...prev,
      ...updatedData
    }));
    setIsEditDialogOpen(false);
  };

  const formatPhone = (phone) => {
    // Format phone number: 0901234567 -> 0901 234 567
    if (phone.length === 10) {
      return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
    }
    return phone;
  };

  const menuItems = [
    {
      icon: MapPin,
      title: 'Địa chỉ của tôi',
      color: '#ee4d2d'
    },
    {
      icon: CreditCard,
      title: 'Phương thức thanh toán',
      color: '#0ea5e9'
    },
    {
      icon: Clock,
      title: 'Lịch sử đơn hàng',
      color: '#8b5cf6'
    },
    {
      icon: Gift,
      title: 'Voucher & Ưu đãi',
      color: '#ec4899'
    },
    {
      icon: Settings,
      title: 'Cài đặt',
      color: '#64748b'
    }
  ];

  const padding = isMobile ? '1.5rem' : isTablet ? '1.25rem' : '1.5rem';
  const avatarSize = isMobile ? '7rem' : isTablet ? '6rem' : '7rem';

  return (
    <div style={{ width: '100%', height: '100%', background: '#f5f5f5' }}>
      {/* Header with gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
        padding: `${isMobile ? '3rem' : isTablet ? '2.5rem' : '3rem'} ${padding}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 0.25rem 1rem rgba(238, 77, 45, 0.2)'
      }}>
        {/* Avatar */}
        <div style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '0.25rem solid #fff',
          boxShadow: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.2)',
          marginBottom: isMobile ? '1.5rem' : '1.25rem'
        }}>
          <img
            src={userData.avatar}
            alt={userData.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* User Info */}
        <h2 style={{
          margin: 0,
          fontSize: isMobile ? '1.375rem' : isTablet ? '1.5rem' : '1.75rem',
          fontWeight: '600',
          color: '#fff',
          marginBottom: '0.5rem'
        }}>
          {userData.name}
        </h2>
        <div style={{
          fontSize: isMobile ? '1rem' : '1rem',
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: isMobile ? '1.5rem' : '1.25rem'
        }}>
          {formatPhone(userData.phone)}
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditDialogOpen(true)}
          style={{
            padding: `${isMobile ? '0.625rem' : '0.75rem'} ${isMobile ? '1.25rem' : '1.5rem'}`,
            background: 'rgba(255, 255, 255, 0.2)',
            border: '0.0625rem solid rgba(255, 255, 255, 0.3)',
            borderRadius: isMobile ? '1.5rem' : '2rem',
            color: '#fff',
            fontSize: isMobile ? '0.875rem' : '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
        >
          <Edit2 size={isMobile ? 18 : 18} strokeWidth={2.5} />
          Chỉnh sửa thông tin
        </button>
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
          padding: isMobile ? '1.5rem' : isTablet ? '1.5rem' : '1.75rem',
          marginBottom: isMobile ? '1rem' : '1.25rem',
          boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: isMobile ? '1.75rem' : isTablet ? '2rem' : '2.25rem',
              fontWeight: '600',
              color: '#ee4d2d',
              marginBottom: '0.25rem'
            }}>
              {userData.stats.orders}
            </div>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '0.875rem',
              color: '#666'
            }}>
              Đơn hàng
            </div>
          </div>

          <div style={{
            width: '0.0625rem',
            background: '#f0f0f0'
          }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: isMobile ? '1.75rem' : isTablet ? '2rem' : '2.25rem',
              fontWeight: '600',
              color: '#f59e0b',
              marginBottom: '0.25rem'
            }}>
              {userData.stats.points}
            </div>
            <div style={{
              fontSize: isMobile ? '0.8125rem' : '0.875rem',
              color: '#666'
            }}>
              Điểm thưởng
            </div>
          </div>

          <div style={{
            width: '0.0625rem',
            background: '#f0f0f0'
          }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: isMobile ? '1.75rem' : isTablet ? '2rem' : '2.25rem',
              fontWeight: '600',
              color: '#ec4899',
              marginBottom: '0.25rem'
            }}>
              {userData.stats.vouchers}
            </div>
            <div style={{
              fontSize: isMobile ? '0.8125rem' : '0.875rem',
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
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '1rem' : '1.25rem',
                  padding: isMobile ? '1.25rem 1.5rem' : isTablet ? '1.25rem 1.5rem' : '1.5rem 1.75rem',
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
                  <Icon size={isMobile ? 22 : isTablet ? 22 : 24} color={item.color} strokeWidth={2} />
                </div>
                <div style={{
                  flex: 1,
                  fontSize: isMobile ? '1.0625rem' : isTablet ? '1.0625rem' : '1.125rem',
                  fontWeight: '500',
                  color: '#333'
                }}>
                  {item.title}
                </div>
                <ChevronRight size={isMobile ? 22 : 22} color="#ccc" strokeWidth={2} />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button style={{
          width: '100%',
          padding: isMobile ? '1.25rem' : isTablet ? '1.25rem' : '1.375rem',
          background: '#fff',
          border: '0.125rem solid #ee4d2d',
          borderRadius: isMobile ? '1rem' : '1.25rem',
          color: '#ee4d2d',
          fontSize: isMobile ? '1.0625rem' : '1.0625rem',
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
          <LogOut size={isMobile ? 22 : 22} strokeWidth={2.5} />
          Đăng xuất
        </button>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        userData={userData}
        onSave={handleSaveProfile}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      {/* Navbar */}
      <Navbar isProfilePage={true} />
    </div>
  );
}
