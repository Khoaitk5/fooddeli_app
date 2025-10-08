import React from 'react';
import Navbar from './components/shared/Navbar';

const NavbarTest = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, background: '#f5f5f5', padding: '20px' }}>
        <h2>Test Navbar Component</h2>
        <p>Thanh navbar hiển thị ở cuối màn hình với các icon và nhãn:</p>
        <ul>
          <li>🏠 Trang chủ</li>
          <li>🔍 Khám phá</li>
          <li>📦 Đơn hàng</li>
          <li>🔔 Thông báo</li>
          <li>👤 Hồ sơ</li>
        </ul>
      </div>
      <Navbar />
    </div>
  );
};

export default NavbarTest;