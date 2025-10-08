const FooterBar = ({ text1 = "Bạn không có tài khoản?", text2 = "Đăng ký", onClick }) => {
  const barStyle = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: "6.875vh",
  };

  const textStyle = {
    fontSize: "1.4rem",
    fontFamily: 'TikTok Sans',
  };

  return (
    <>
      <div style={{
        ...barStyle,
        background: '#F7F7F7'
      }} />

      <div style={{
        ...barStyle,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
      }}>
        <span style={{...textStyle, color: 'black', fontWeight: '400'}}>
          {text1}
        </span>
        <span 
          style={{...textStyle, color: '#EF5126', fontWeight: '600', marginLeft: 5, cursor: onClick ? 'pointer' : 'default'}}
          onClick={onClick}
        >
          {text2}
        </span>
      </div>
    </>
  );
};

export default FooterBar;