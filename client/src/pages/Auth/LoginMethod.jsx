import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/shared/PrimaryButton.jsx';
import { headerRow, titleText, tabsRow, makeTab, tabUnderline, fieldBase, pageContainer, contentPadding, footerPadding } from './styles/authStyles.js';

const BackIcon = ({ onClick }) => (
  <button onClick={onClick} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }} aria-label="Quay lại">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18l-6-6 6-6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

const Tab = ({ active, onClick, children }) => (
  <button onClick={onClick} style={makeTab(active)}>
    {children}
    {active && <span style={tabUnderline} />}
  </button>
);

// fieldBase moved to shared styles

const LoginMethod = () => {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState('phone'); // 'phone' | 'email'
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');

  const isValid = tab === 'phone'
    ? phone.trim().length >= 9
    : /.+@.+\..+/.test(email);

  const onContinue = () => {
    if (!isValid) return;
    if (tab === 'phone') {
      navigate(`/login/otp?phone=${encodeURIComponent(phone)}`);
    } else {
      navigate(`/login/otp?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div style={pageContainer}>
      <div style={headerRow}>
        <BackIcon onClick={() => navigate('/login')} />
        <div style={titleText}>Đăng nhập</div>
      </div>

      <div style={tabsRow}>
        <Tab active={tab === 'phone'} onClick={() => setTab('phone')}>Điện thoại</Tab>
        <Tab active={tab === 'email'} onClick={() => setTab('email')}>Email</Tab>
      </div>

      <div style={contentPadding}>
        {tab === 'phone' ? (
          <input
            style={{ ...fieldBase, width: '100%' }}
            placeholder="Số điện thoại"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
          />
        ) : (
          <input
            style={{ ...fieldBase, width: '100%' }}
            placeholder="Email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
      </div>

      <div style={footerPadding}>
        <PrimaryButton disabled={!isValid} onClick={onContinue} style={{ width: '100%', height: 64, opacity: isValid ? 1 : 0.5 }}>
          Tiếp tục
        </PrimaryButton>
      </div>
    </div>
  );
};

export default LoginMethod;


