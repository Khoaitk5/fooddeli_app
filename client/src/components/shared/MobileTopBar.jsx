import React from 'react';

const MobileTopBar = ({ title }) => {
  return (
    <div style={{ position: 'sticky', top: 0, background: '#1976d2', color: '#fff', height: 64, display: 'flex', alignItems: 'center', padding: '0 16px', zIndex: 10 }}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{title}</div>
    </div>
  );
};

export default MobileTopBar;


