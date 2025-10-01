const FooterBar = ({ text1 = "Bạn không có tài khoản?", text2 = "Đăng ký", onClick }) => {
  const barStyle = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 55,
  };

  const textStyle = {
    fontSize: 14,
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
        zIndex: 1,
        cursor: onClick ? 'pointer' : 'default'
      }} onClick={onClick}>
        <span style={{...textStyle, color: 'black', fontWeight: '400'}}>
          {text1}
        </span>
        <span style={{...textStyle, color: '#EF5126', fontWeight: '600', marginLeft: 5}}>
          {text2}
        </span>
      </div>
    </>
  );
};

export default FooterBar;