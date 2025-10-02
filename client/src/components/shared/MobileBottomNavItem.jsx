import React from 'react';

const MobileBottomNavItem = ({ label, icon, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 34,
        cursor: 'pointer',
      }}
      aria-label={label}
      role="button"
    >
      <div style={{ width: 22, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: 'TikTok Sans, sans-serif',
          fontWeight: 700,
          fontSize: 9.5,
          color: active ? '#fe724c' : '#d3d1d8',
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default MobileBottomNavItem;


