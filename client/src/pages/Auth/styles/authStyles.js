// Shared auth styles for Login/Register screens (prioritize Login look)

export const headerRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 16px',
};

export const titleText = {
  fontSize: 22,
  fontWeight: 700,
};

export const tabsRow = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: '0 16px',
};

export const makeTab = (active) => ({
  background: 'transparent',
  border: 'none',
  fontFamily: 'var(--font-display)',
  fontSize: 18,
  color: active ? '#111' : 'rgba(17,17,17,0.4)',
  padding: '10px 0',
  cursor: 'pointer',
  position: 'relative',
});

export const tabUnderline = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: -2,
  height: 3,
  background: '#111',
};

export const fieldBase = {
  height: 56,
  borderRadius: 16,
  border: '1px solid #E6E6E6',
  background: '#F0F0F0',
  padding: '0 16px',
  boxSizing: 'border-box',
  fontSize: 18,
  color: '#111',
};

export const pageContainer = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
};

export const contentPadding = {
  padding: '24px 16px',
};

export const footerPadding = {
  marginTop: 'auto',
  padding: 16,
};


