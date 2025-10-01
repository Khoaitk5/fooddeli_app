const LoadingSpinner = ({ size = 40 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #1976d2',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;