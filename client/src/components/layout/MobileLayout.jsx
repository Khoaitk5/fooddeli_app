import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '../shared/HomeIcon';
import DiscoverIcon from '../shared/DiscoverIcon';
import NotificationIcon from '../shared/NotificationIcon';
import ProfileIcon from '../shared/ProfileIcon';

const MobileLayout = () => {
  const [value, setValue] = React.useState(0);
  // const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định role dựa trên path
  const isCustomer = location.pathname.startsWith('/customer');
  const isShipper = location.pathname.startsWith('/shipper');

  const customerMenu = [
    { label: 'Trang chủ', icon: <HomeIcon />, path: '/customer/home' },
    { label: 'Khám phá', icon: <DiscoverIcon />, path: '/customer/discover' },
    { label: 'Thông báo', icon: <NotificationIcon />, path: '/customer/notifications' },
    { label: 'Hồ sơ', icon: <ProfileIcon />, path: '/customer/profile' },
  ];

  const shipperMenu = [
    { label: 'Đơn hàng', icon: <span>📦</span>, path: '/shipper/orders' },
    { label: 'Bản đồ', icon: <span>🗺️</span>, path: '/shipper/map' },
    { label: 'Thông báo', icon: <NotificationIcon />, path: '/shipper/notification' },
    { label: 'Hồ sơ', icon: <ProfileIcon />, path: '/shipper/profile' },
  ];

  const navigationItems = isCustomer ? customerMenu : shipperMenu;

  const handleNavigation = (event, newValue) => {
    setValue(newValue);
    navigate(navigationItems[newValue].path);
  };

  const title = isCustomer ? 'FoodDeli - Customer' : 'FoodDeli - Shipper';

  return (
    <div style={{ paddingBottom: '70px' }}>
      <header style={{ background: '#1976d2', color: 'white', padding: '16px', position: 'static' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '500', flexGrow: 1 }}>{title}</span>
          {/* <button style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }} onClick={logout}>
            Logout
          </button> */}
        </div>
      </header>
      <div style={{ padding: '16px' }}>
        <Outlet />
      </div>
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '383px',
        height: '57.5px',
        background: '#FFF',
        boxShadow: '0 -4.69px 23.47px 0 rgba(63, 76, 95, 0.12)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        {navigationItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(null, index)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px',
              color: value === index ? '#1976d2' : '#666'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '12px', marginTop: '4px' }}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileLayout;