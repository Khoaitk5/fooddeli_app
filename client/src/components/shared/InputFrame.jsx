import React from 'react';

const InputFrame = ({ children }) => (
  <div style={{
    width: '267px',
    height: '44px',
    background: '#F2F2F2',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px'
  }}>
    {children}
  </div>
);

export default InputFrame;