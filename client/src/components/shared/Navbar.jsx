import React from 'react';
import HomeIcon from './HomeIcon';
import DiscoverIcon from './DiscoverIcon';
import OrderIcon from './OrderIcon';
import NotificationIcon from './NotificationIcon';
import ProfileIcon from './ProfileIcon';
import NavbarItem from './NavbarItem';
import { pxW, pxH } from '../../utils/scale.js';

const Navbar = () => {
  return (
    <div style={{
      width: pxW(360),
      height: '50px',
      background: 'white',
      boxShadow: '0px -4.690000057220459px 23.469999313354492px rgba(63, 76, 95, 0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '8px 20px'
    }}>
      <NavbarItem icon={HomeIcon} label="Trang chủ" />
      <NavbarItem icon={DiscoverIcon} label="Khám phá" />
      <NavbarItem icon={OrderIcon} label="Đơn hàng" />
      <NavbarItem icon={NotificationIcon} label="Thông báo" />
      <NavbarItem icon={ProfileIcon} label="Hồ sơ" />
    </div>
  );
};

export default Navbar;