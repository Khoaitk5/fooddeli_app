import React from 'react';

const PrimaryButton = ({ children, style, ...props }) => {
  return (
    <button
      {...props}
      style={{
        background: 'linear-gradient(180deg, #F9704B 0%, #EF5126 100%)',
        color: 'var(--on-brand, #FFFFFF)',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        padding: '14px 18px',
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-md)',
        fontWeight: 700,
        letterSpacing: 0.2,
        boxShadow: '0px 8px 24px rgba(239, 81, 38, 0.35)',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;


