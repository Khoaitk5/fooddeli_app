const SubmitButton = ({ children, onClick, style, ...props }) => (
  <button
    type="submit"
    onClick={onClick}
    style={{
      width: "74.16vw",
      height: "6.19vh",
      background: '#F9704B',
      borderRadius: 12,
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      fontSize: "1.5rem",
      fontFamily: 'TikTok Sans',
      fontWeight: '700',
      wordWrap: 'break-word',
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