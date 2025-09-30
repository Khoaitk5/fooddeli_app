const FooterBar = () => {
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
        zIndex: 1
      }}>
        <span style={{...textStyle, color: 'black', fontWeight: '400'}}>
          Bạn không có tài khoản?
        </span>
        <span style={{...textStyle, color: '#EF5126', fontWeight: '600', marginLeft: 5}}>
          Đăng ký
        </span>
      </div>
    </>
  );
};

export default FooterBar;