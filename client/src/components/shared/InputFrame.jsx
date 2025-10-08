const InputFrame = ({ children }) => (
  <div style={{
    width: '83.89vw',
    height: '5.5vh',
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