const SubmitButton = ({ children, onClick, style, isValid = true, ...props }) => {
  const containerStyle = {
    width: '100%',
    height: "10.125vh",
    position: 'relative',
    ...style,
  };

  const backgroundStyle = {
    width: "100%",
    height: "10.125vh",
    left: 0,
    top: 0,
    position: 'absolute',
    background: 'white',
    boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.25)',
    borderTopLeftRadius: "1.6rem",
    borderTopRightRadius: "1.6rem",
  };

  const buttonStyle = {
    width: "87.78vw",
    height: "6.375vh",
    left: "50%",
    top: "1.875vh",
    transform: 'translateX(-50%)',
    position: 'absolute',
    background: isValid ? '#2BCDD2' : '#EAF8F8',
    borderRadius: 999,
    cursor: isValid ? 'pointer' : 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isValid ? 'white' : '#2BCDD2',
    fontSize: "1.4rem",
    fontFamily: 'Be Vietnam Pro',
    fontWeight: '700',
  };

  return (
    <div style={containerStyle} onClick={isValid ? onClick : undefined} {...props}>
      <div style={backgroundStyle} />
      <div style={buttonStyle}>
        {children}
      </div>
    </div>
  );
};

export default SubmitButton;

