import React from 'react';
import { useNavigate } from 'react-router-dom';
import SocialButton from '../../components/shared/SocialButton.jsx';
import PrimaryButton from '../../components/shared/PrimaryButton.jsx';

const BrandLogo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 22c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M2 22h32" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="17" cy="7" r="2" fill="var(--brand)"/>
      </svg>
      <div>
        <span style={{ color: 'var(--brand)', fontSize: 'var(--text-xl)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>Food</span>
        <span style={{ color: 'var(--brand)', fontSize: 'var(--text-xl)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Deli</span>
      </div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const handleFacebook = () => alert('Facebook signup chưa được triển khai');
  const handleGoogle = () => alert('Google signup chưa được triển khai');
  const handleEmail = () => navigate('/register/phone');

  const wrapperStyle = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'var(--color-surface)'
  };

  const stackStyle = {
    marginTop: 72,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  };

  const buttonColStyle = {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 320,
  };

  const disclaimerStyle = {
    width: 320,
    textAlign: 'center',
    color: 'rgba(22, 24, 35, 0.50)',
    fontSize: 'var(--text-xs)',
    fontFamily: 'var(--font-display)',
    lineHeight: '15px',
    marginTop: 120,
  };

  const footerStyle = {
    marginTop: 12,
    color: 'var(--color-text)',
    fontSize: 16,
    fontFamily: 'var(--font-display)'
  };

  return (
    <div style={wrapperStyle}>
      <div style={stackStyle}>
        <BrandLogo />
        <div style={{ color: 'var(--brand-strong)', fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Đăng ký</div>

        <div style={buttonColStyle}>
          <SocialButton onClick={handleEmail} label="Sử dụng SĐT hoặc email" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="var(--color-title)" strokeWidth="1.5"/>
              <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="var(--color-title)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          } />
          <SocialButton onClick={handleFacebook} label="Tiếp tục với Facebook" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12a10 10 0 1 0-11.56 9.9v-7h-2.3V12h2.3V9.8c0-2.27 1.35-3.53 3.42-3.53.99 0 2.03.18 2.03.18v2.24h-1.14c-1.12 0-1.47.7-1.47 1.42V12h2.5l-.4 2.9h-2.1v7A10 10 0 0 0 22 12Z" fill="#1877F2"/>
              <path d="M15.5 14.9 15.9 12h-2.5V10.1c0-.72.35-1.42 1.47-1.42h1.14V6.44s-1.04-.18-2.03-.18c-2.07 0-3.42 1.26-3.42 3.53V12h-2.3v2.9h2.3v7a10.08 10.08 0 0 0 3 .02v-7.02h2.1Z" fill="#fff"/>
            </svg>
          } />
          <SocialButton onClick={handleGoogle} label="Tiếp tục với Google" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M12 10.2v3.6h5.02A4.3 4.3 0 0 1 12 19a7 7 0 1 1 6.63-9.3l-2.85 2.22A3.98 3.98 0 1 0 12 10.2z"/>
              <path fill="#4285F4" d="M21.99 12.23a7 7 0 0 0-.21-1.73H12v3.24h5.02a4.3 4.3 0 0 1-1.85 2.82l2.85 2.22c1.65-1.52 2.6-3.76 2.6-6.55z"/>
              <path fill="#FBBC05" d="M7.15 14.29A4.2 4.2 0 0 1 6.9 13a4.2 4.2 0 0 1 .25-1.29L4.23 9.33A7 7 0 0 0 5 17.18l2.15-2.89z"/>
              <path fill="#34A853" d="M12 19a6.99 6.99 0 0 0 4.83-1.74l-2.85-2.22A3.98 3.98 0 0 1 8.5 12H5a7 7 0 0 0 7 7z"/>
            </svg>
          } />
        </div>
      </div>

      <div style={disclaimerStyle}>
        Bằng việc tiếp tục với tài khoản có vị trí tại <strong style={{ color: 'rgba(22, 24, 35, 0.75)', fontWeight: 600, fontFamily: 'IBM Plex Sans' }}>Việt Nam</strong>, bạn đồng ý với <strong style={{ color: '#161823', fontWeight: 500, fontFamily: 'IBM Plex Sans' }}>Điều khoản dịch vụ</strong>, đồng thời xác nhận rằng bạn đã đọc <strong style={{ color: '#161823', fontWeight: 500, fontFamily: 'IBM Plex Sans' }}>Chính sách quyền riêng tư</strong> của chúng tôi.
      </div>

      <div style={footerStyle}>
        Bạn đã có tài khoản? <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', color: 'var(--brand-strong)', fontWeight: 700, cursor: 'pointer' }}>Đăng nhập</button>
      </div>
    </div>
  );
};

export default Register;


