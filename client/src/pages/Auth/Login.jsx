import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const Login = () => {
  const navigate = useNavigate();

  const handleFacebook = () => {
    // TODO: Integrate Facebook login
    alert('Facebook login not implemented');
  };

  const handleGoogle = () => {
    // TODO: Integrate Google login
    alert('Google login not implemented');
  };

  const handleGuest = () => {
    // Navigate to customer home as guest
    navigate('/customer/home');
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', position: 'relative', background: 'white', overflow: 'hidden' }}>
      {/* Status bar bottom */}
      <Box sx={{ width: 360, height: 55, left: 0, top: 745, position: 'absolute', background: '#F7F7F7', outline: '0.30px #E6E6E6 solid' }} />
      
      {/* Time */}
      <Box sx={{ width: 36, left: 26, top: 14, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 17, fontFamily: 'SF Pro', fontWeight: '590', wordWrap: 'break-word' }}>9:41</Box>
      
      {/* Battery/signal icons */}
      <Box sx={{ left: 254.47, top: 17.50, position: 'absolute', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
        <Box sx={{ width: 25, height: 13, opacity: 0.35, borderRadius: 3.50, border: '1px black solid' }} />
        <Box sx={{ width: 1.33, height: 4, opacity: 0.40, background: 'black' }} />
        <Box sx={{ width: 21, height: 9, background: 'black', borderRadius: 1.33 }} />
      </Box>
      
      {/* Logo */}
      <Box sx={{ left: 152, top: 73.05, position: 'absolute' }}>
        <Typography sx={{ color: '#F9704B', fontSize: 25, fontFamily: 'TikTok Sans', fontWeight: '500', display: 'inline' }}>Food</Typography>
        <Typography sx={{ color: '#F9704B', fontSize: 25, fontFamily: 'TikTok Sans', fontWeight: '700', display: 'inline' }}>Deli</Typography>
      </Box>
      
      {/* Logo underlines */}
      <Box sx={{ width: 42.13, height: 5.83, left: 106, top: 95.83, position: 'absolute', background: '#F9704B' }} />
      <Box sx={{ width: 35.65, height: 22.99, left: 109.24, top: 71.13, position: 'absolute', background: '#F9704B' }} />
      
      {/* Title */}
      <Box sx={{ width: 144, height: 50, left: 107, top: 202, position: 'absolute', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#EF5126', fontSize: 29, fontFamily: 'TikTok Sans', fontWeight: '700', wordWrap: 'break-word' }}>Đăng nhập</Box>
      
      {/* Phone/email placeholder */}
      <Box sx={{ width: 267, height: 43, left: 46, top: 278, position: 'absolute', background: 'white', borderRadius: 12, outline: '0.80px #D0D1D3 solid', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#161823', fontSize: 13, fontFamily: 'TikTok Sans', fontWeight: '600' }}>Sử dụng SĐT hoặc email</Typography>
      </Box>
      
      {/* Facebook button */}
      <Button onClick={handleFacebook} sx={{ width: 267, height: 43, left: 46, top: 336, position: 'absolute', background: 'white', borderRadius: 12, outline: '0.80px #D0D1D3 solid', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '18px', textTransform: 'none', '&:hover': { background: 'white' } }}>
        <Box sx={{ width: 24.67, height: 24.67, overflow: 'hidden', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: 23.65, height: 23.65, background: 'white' }} />
          <Box sx={{ width: 23.65, height: 23.50, background: '#0075FA' }} />
        </Box>
        <Typography sx={{ color: '#161823', fontSize: 13, fontFamily: 'TikTok Sans', fontWeight: '600', marginLeft: '16px' }}>Tiếp tục với Facebook</Typography>
      </Button>
      
      {/* Google button */}
      <Button onClick={handleGoogle} sx={{ width: 267, height: 43, left: 46, top: 394, position: 'absolute', background: 'white', borderRadius: 12, outline: '0.80px #D0D1D3 solid', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '18px', textTransform: 'none', '&:hover': { background: 'white' } }}>
        <Box sx={{ width: 23.60, height: 23.60, overflow: 'hidden', borderRadius: 12, position: 'relative' }}>
          <Box sx={{ width: 9.15, height: 8.78, left: 11.99, top: 10.10, position: 'absolute', background: '#4285F4' }} />
          <Box sx={{ width: 14.83, height: 7.57, left: 3.47, top: 13.58, position: 'absolute', background: '#34A853' }} />
          <Box sx={{ width: 4.20, height: 8.39, left: 2.46, top: 7.60, position: 'absolute', background: '#FBBC04' }} />
          <Box sx={{ width: 14.90, height: 7.57, left: 3.47, top: 2.46, position: 'absolute', background: '#EA4335' }} />
        </Box>
        <Typography sx={{ color: '#161823', fontSize: 13, fontFamily: 'TikTok Sans', fontWeight: '600', marginLeft: '16px' }}>Tiếp tục với Google</Typography>
      </Button>
      
      {/* Guest button */}
      <Button onClick={handleGuest} sx={{ width: 267, height: 49.49, left: 46, top: 457, position: 'absolute', background: '#F9704B', boxShadow: '0px -1px 33.70000076293945px rgba(0, 0, 0, 0.25)', borderRadius: 9999, textTransform: 'none', '&:hover': { background: '#F9704B' } }}>
        <Typography sx={{ color: 'white', fontSize: 13, fontFamily: 'TikTok Sans', fontWeight: '600' }}>Tiếp tục với tư cách là khách</Typography>
      </Button>
      
      {/* Terms text */}
      <Box sx={{ width: 283, height: 45, left: 39, top: 690, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: 'rgba(22, 24, 35, 0.50)', fontSize: 10, fontFamily: 'TikTok Sans', fontWeight: '400', lineHeight: 15, wordWrap: 'break-word' }}>
          Bằng việc tiếp tục với tài khoản có vị trí tại <span style={{ color: 'rgba(22, 24, 35, 0.75)', fontWeight: '600', fontFamily: 'IBM Plex Sans' }}>Việt Nam</span>, bạn<br/>đồng ý với <span style={{ color: '#161823', fontWeight: '500', fontFamily: 'IBM Plex Sans' }}>Điều khoản dịch vụ</span>, đồng thời xác nhận rằng bạn<br/>đã đọc <span style={{ color: '#161823', fontWeight: '500', fontFamily: 'IBM Plex Sans' }}>Chính sách quyền riêng tư</span> của chúng tôi.
        </Typography>
      </Box>
      
      {/* Bottom text */}
      <Box sx={{ width: 223, height: 18, left: 68, top: 763, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: 'black', fontSize: 14, fontFamily: 'TikTok Sans', fontWeight: '400', lineHeight: 18, wordWrap: 'break-word' }}>
          Bạn không có tài khoản? <span style={{ color: '#EF5126', fontWeight: '600' }}>Đăng ký</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
