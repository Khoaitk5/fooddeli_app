import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/shared/Logo';
import FooterBar from '@/components/shared/FooterBar';
import TermsAgreement from '@/components/shared/TermsAgreement';
import PhoneEmailButton from '@/components/shared/PhoneEmailButton';
import FacebookButton from '@/components/shared/FacebookButton';
import GoogleButton from '@/components/shared/GoogleButton';
import SubmitButton from '@/components/shared/SubmitButton';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        width: '360px',
        height: '800px',
        position: 'relative',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
      {/* Logo */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: 'translateX(-50%)',
        marginTop: '71.13px'
      }}>
        <Logo />
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '200px',
        transform: 'translateX(-50%)',
        color: '#EF5126',
        fontSize: 29,
        fontFamily: 'TikTok Sans',
        fontWeight: '700',
      }}>
        Đăng nhập
      </div>

      {/* Form */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '278px',
          transform: 'translateX(-50%)',
          width: '267px',
        }}
      >
        <PhoneEmailButton onClick={() => navigate('/login/phone')} style={{ marginBottom: '15px' }} />
        <FacebookButton onClick={() => {}} style={{ marginBottom: '15px' }} />
        <GoogleButton onClick={() => {}} style={{ marginBottom: '20px' }} />
        <SubmitButton>
          <div style={{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            fontSize: 13,
            fontFamily: 'TikTok Sans',
            fontWeight: '600',
            wordWrap: 'break-word'
          }}>
            Tiếp tục với tư cách là khách
          </div>
        </SubmitButton>
      </div>

      {/* Terms */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '690px',
        transform: 'translateX(-50%)',
        width: '267px',
        height: '100px'
      }}>
        <TermsAgreement />
      </div>

      <FooterBar onClick={() => navigate('/register')} />
    </div>
    </div>
  );
};

export default Login;
