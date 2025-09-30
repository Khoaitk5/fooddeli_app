import React from 'react';

const DESIGN_WIDTH = 360;
const DESIGN_HEIGHT = 800;

const frameBaseStyle = {
  width: DESIGN_WIDTH,
  height: DESIGN_HEIGHT,
  margin: '0 auto',
  position: 'relative',
  background: 'var(--color-surface)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  borderRadius: 16,
  overflow: 'hidden',
  transformOrigin: 'top center',
};

const viewportStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: '100vh',
  background: '#f2f3f5',
  padding: 16,
  boxSizing: 'border-box',
};

const AppShell = ({ children }) => {
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth - 32; // padding 16 * 2
      const vh = window.innerHeight - 32;
      const scaleX = vw / DESIGN_WIDTH;
      const scaleY = vh / DESIGN_HEIGHT;
      const nextScale = Math.min(1, Math.max(0.6, Math.min(scaleX, scaleY)));
      setScale(nextScale);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div style={viewportStyle}>
      <div style={{ ...frameBaseStyle, transform: `scale(${scale})` }}>{children}</div>
    </div>
  );
};

export default AppShell;


