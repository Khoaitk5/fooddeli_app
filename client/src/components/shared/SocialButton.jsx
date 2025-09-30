import React from 'react';

const SocialButton = ({ icon, label, style, ...props }) => {
  return (
    <button
      {...props}
      style={{
        background: 'var(--color-surface)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        outline: `0.8px var(--color-border) solid`,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 18,
        fontFamily: 'var(--font-display)',
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--color-title)',
        ...style,
      }}
    >
      <div style={{ width: 24, height: 24, overflow: 'hidden', borderRadius: 12, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <span style={{ marginLeft: 16 }}>{label}</span>
    </button>
  );
};

export default SocialButton;


