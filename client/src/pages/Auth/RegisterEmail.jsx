import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/shared/PrimaryButton.jsx';
import { headerRow, titleText, tabsRow, makeTab, tabUnderline, fieldBase, pageContainer, contentPadding, footerPadding } from './styles/authStyles.js';

const BackIcon = ({ onClick }) => (
  <button onClick={onClick} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }} aria-label="Quay lại">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18l-6-6 6-6" stroke="var(--brand-strong)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

const BrandLogo = () => (
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

// fieldBase dùng từ styles/authStyles.js

const TabButton = ({ active, children, onClick }) => (
  <button onClick={onClick} style={makeTab(active)}>
    {children}
    {active && <span style={tabUnderline} />}
  </button>
);

const RegisterEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  const isValid = /.+@.+\..+/.test(email) && code.trim().length >= 4 && password.trim().length >= 6;

  const sendCode = async () => {
    if (sending || !/.+@.+\..+/.test(email)) return;
    setSending(true);
    setTimeout(() => setSending(false), 1200);
  };

  return (
    <div style={pageContainer}>
      <div style={headerRow}>
        <BackIcon onClick={() => navigate('/register')} />
        <div style={titleText}>Đăng ký</div>
      </div>

      <div style={tabsRow}>
        <TabButton active>Email</TabButton>
        <TabButton active={false} onClick={() => navigate('/register/phone')}>Đăng ký bằng số điện thoại</TabButton>
      </div>

      <div style={{ ...contentPadding, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          style={{ ...fieldBase }}
          placeholder="Email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
          <input
            style={{ ...fieldBase, flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            placeholder="Nhập mã"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
          />
          <button onClick={sendCode} disabled={sending || !/.+@.+\..+/.test(email)} style={{
            height: 52,
            width: 110,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            border: '1px solid #DDDEE1',
            background: '#F3F3F4',
            fontWeight: 700,
            color: 'rgba(22,24,35,0.6)'
          }}>{sending ? 'Đang gửi…' : 'Gửi mã'}</button>
        </div>

        <div style={{ position: 'relative' }}>
          <input
            style={{ ...fieldBase, width: '100%', paddingRight: 48 }}
            placeholder="Nhập mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 12, top: 10, background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#999" strokeWidth="1.6"/>
              <circle cx="12" cy="12" r="3" fill="#999"/>
            </svg>
          </button>
        </div>

        <PrimaryButton disabled={!isValid} style={{ width: '100%', height: 56, opacity: isValid ? 1 : 0.6 }}>
          Tiếp
        </PrimaryButton>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#F7F7F7', borderTop: '1px solid #E6E6E6', padding: '14px 16px', textAlign: 'center', fontFamily: 'var(--font-display)' }}>
        Bạn đã có tài khoản? <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', color: 'var(--brand-strong)', fontWeight: 700, cursor: 'pointer' }}>Đăng nhập</button>
      </div>
    </div>
  );
};

export default RegisterEmail;


