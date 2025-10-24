import React from 'react';

const NavbarItem = ({ icon: Icon, label, isActive = false, onClick }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '8px',
      transition: 'all 0.2s ease'
    }} onClick={onClick}>
      <Icon width="2rem" height="2rem" fill={isActive ? '#54A312' : '#D3D1D8'} />
      <div style={{
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        color: isActive ? '#54A312' : '#D3D1D8',
        fontSize: "0.9rem",
        fontFamily: 'Be Vietnam Pro',
        fontWeight: '700',
        wordWrap: 'break-word',
        textAlign: 'center'
      }}>
        {label}
      </div>
    </div>
  );
};

export default NavbarItem;