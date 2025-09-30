const SubmitButton = ({ children, onClick, style, ...props }) => (
  <button
    type="submit"
    onClick={onClick}
    style={{
      width: 267,
      height: 49.5,
      background: '#F9704B',
      boxShadow: '0px -1px 33.70000076293945px rgba(0, 0, 0, 0.25)',
      borderRadius: 9999,
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}
    {...props}
  >
    {children}
  </button>
);

export default SubmitButton;