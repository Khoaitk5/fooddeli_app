import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackIcon = ({ onClick }) => (
  <button onClick={onClick} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }} aria-label="Quay lại">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18l-6-6 6-6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const OtpVerify = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const phone = query.get('phone') || '+84 123456789';

  const [code, setCode] = React.useState('');
  const [seconds, setSeconds] = React.useState(60);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(onlyDigits);
    if (onlyDigits.length === 6) {
      // giả lập xác thực thành công
      setTimeout(() => navigate('/customer/home'), 300);
    }
  };

  const resend = () => {
    if (seconds > 0) return;
    setSeconds(60);
  };

  const box = (i) => (
    <div key={i} style={{
      width: 64,
      height: 64,
      borderRadius: 12,
      background: '#F0F0F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      color: '#111'
    }}>
      {code[i] || ''}
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px' }}>
        <BackIcon onClick={() => navigate(-1)} />
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginTop: 12 }}>Nhập mã gồm 6 chữ số</div>
        <div style={{ marginTop: 14, color: 'rgba(0,0,0,0.45)', fontSize: 16 }}>Mã của bạn đã được gửi đến {phone}.</div>

        {/* Hidden input to capture OTP */}
        <input ref={inputRef} value={code} onChange={handleChange} inputMode="numeric" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />

        <div onClick={() => inputRef.current?.focus()} style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          {[0,1,2,3,4,5].map(box)}
        </div>

        <button onClick={resend} disabled={seconds > 0} style={{ marginTop: 28, background: 'transparent', border: 'none', color: '#888', fontSize: 18, cursor: seconds > 0 ? 'default' : 'pointer' }}>
          Gửi lại mã {seconds > 0 ? `${seconds}s` : ''}
        </button>
      </div>
    </div>
  );
};

export default OtpVerify;


