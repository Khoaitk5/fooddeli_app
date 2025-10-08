import React from 'react';

const NavbarItem = ({ icon: Icon, label, isActive = false }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      ...(isActive && {
        backgroundColor: '#FE724C',
        color: 'white'
      })
    }}>
      <Icon width="20" height="20" />
      <div style={{
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        color: isActive ? 'white' : '#D3D1D8',
        fontSize: 9,
        fontFamily: 'TikTok Sans',
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