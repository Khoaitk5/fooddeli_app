import React from 'react';

const FooterBar = ({ text1 = "Bạn không có tài khoản?", text2 = "Đăng ký", onClick }) => {
  const barStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    minHeight: '60px',
    background: '#F7F7F7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    boxSizing: 'border-box',
  };

  const textStyle = {
    fontSize: "1.5rem",
  };

  return (
    <div style={barStyle}>
      <span style={{ ...textStyle, color: '#60655c'}}>
        {text1}
      </span>
      <span
        style={{
          ...textStyle,
          color: '#363a33',
          fontWeight: '600',
          marginLeft: '0.3rem',
          cursor: onClick ? 'pointer' : 'default'
        }}
        onClick={onClick}
      >
        {text2}
      </span>
    </div>
  );
};

export default FooterBar;