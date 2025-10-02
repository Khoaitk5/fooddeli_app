import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileBottomNavItem from './MobileBottomNavItem';
import HomeIcon from './HomeIcon';
import DiscoverIcon from './DiscoverIcon';
import NotificationIcon from './NotificationIcon';
import ProfileIcon from './ProfileIcon';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: 'Trang chủ', icon: <HomeIcon />, path: '/customer/feed' },
    { label: 'Khám phá', icon: <DiscoverIcon />, path: '/customer/discover' },
    { label: 'Hộp thư', icon: <NotificationIcon />, path: '/customer/notifications' },
    { label: 'Hồ sơ', icon: <ProfileIcon />, path: '/customer/profile' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: 383,
        height: 57.5,
        background: '#FFF',
        boxShadow: '0 -4.69px 23.47px 0 rgba(63, 76, 95, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      {items.map((item) => (
        <MobileBottomNavItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          active={location.pathname.startsWith(item.path)}
          onClick={() => navigate(item.path)}
        />
      ))}
    </div>
  );
};

export default MobileBottomNav;


