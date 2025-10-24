const InputFrame = ({ children, isFocused = false }) => (
  <div style={{
    width: '89.3vw',
    height: '6vh',
    paddingLeft: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: "1.2rem",
    border: isFocused ? '2px solid #54a312' : '1px solid #e8ebe6',
    boxSizing: 'border-box',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'inline-flex'
  }}>
    {children}
  </div>
);

export default InputFrame;