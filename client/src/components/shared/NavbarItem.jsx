import React from 'react';

const NavbarItem = ({ icon: Icon, label, isActive = false, onClick, badgeCount = 0 }) => {
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
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon width="2rem" height="2rem" fill={isActive ? '#FE5621' : '#D3D1D8'} />
        {badgeCount > 0 && (
          <div style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: '16px',
            height: '16px',
            borderRadius: '999px',
            backgroundColor: '#FE5621',
            color: '#FFFFFF',
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            boxShadow: '0 0 0 1px #FFFFFF'
          }}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </div>
        )}
      </div>
      <div style={{
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        color: isActive ? '#FE5621' : '#D3D1D8',
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