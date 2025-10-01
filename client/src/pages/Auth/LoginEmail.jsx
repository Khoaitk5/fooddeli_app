import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubmitButton from '@/components/shared/SubmitButton';
import BackArrow from '@/components/shared/BackArrow';
import OutlineBorder from '@/components/shared/OutlineBorder';
import InputFrame from '@/components/shared/InputFrame';
import BlackOutline from '@/components/shared/BlackOutline';


const LoginEmail = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (email && (email.endsWith('@gmail.com') || email.endsWith('@outlook.com') || email.endsWith('@hotmail.com'))) {
            // Navigate to OTP page or handle login
            navigate('/otp', { state: { email } });
        } else {
            setError('Please enter a valid email address from Gmail, Outlook, or Hotmail');
        }
    };

    const handleEmailChange = (e) => {
        let value = e.target.value.replace(/\s/g, '');
        value = value.replace(/[^a-zA-Z0-9@._-]/g, '');
        setEmail(value);
    };

    const buttonBackground = email && (email.endsWith('@gmail.com') || email.endsWith('@outlook.com') || email.endsWith('@hotmail.com')) ? 'rgba(249, 112, 75, 1)' : 'rgba(249, 112, 75, 0.5)';

    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginBottom: '16px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        fontSize: '16px',
    };

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

                {/* Title */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '44.5px',
                    transform: 'translateX(-50%)',
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        display: 'flex'
                    }}>
                        <span style={{
                            color: 'black',
                            fontSize: 16,
                            fontFamily: 'TikTok Sans',
                            fontWeight: '700',
                            wordWrap: 'break-word'
                        }}>
                            Đăng nhập
                        </span>
                    </div>
                </div>

                {/* Back Arrow */}
                <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '43px',
                    cursor: 'pointer'
                }} onClick={() => navigate('/login')}>
                    <BackArrow />
                </div>

                {/* Phone Label */}
                <div style={{
                  position: 'absolute',
                  left: '71px',
                  top: '91px',
                  cursor: 'pointer'
                }} onClick={() => navigate('/login/phone')}>
                  <div style={{
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#868686',
                    fontSize: 14,
                    fontFamily: 'TikTok Sans',
                    fontWeight: '500',
                    wordWrap: 'break-word'
                  }}>
                    Điện thoại
                  </div>
                </div>

                {/* Email Label */}
                <div style={{
                  position: 'absolute',
                  right: '71.5px',
                  top: '91px',
                }}>
                  <div style={{
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#868686',
                    fontSize: 14,
                    fontFamily: 'TikTok Sans',
                    fontWeight: '500',
                    wordWrap: 'break-word'
                  }}>
                    Email
                  </div>
                </div>

                {/* Outline Border */}
                <div style={{
                  position: 'absolute',
                  top: '115px',
                  left: 0
                }}>
                  <OutlineBorder />
                </div>

                {/* Black Outline */}
                <div style={{
                  position: 'absolute',
                  top: '115px',
                  right: '29px',
                }}>
                  <BlackOutline width='123px' />
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '137px',
                        transform: 'translateX(-50%)',
                        width: '267px',
                    }}
                >
                    <InputFrame>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }}
                            style={{
                                width: '100%',
                                border: 'none',
                                outline: 'none',
                                fontSize: '14px',
                                fontWeight: '400',
                                fontFamily: 'TikTok Sans',
                                color: '#aaaaae',
                                backgroundColor: 'transparent',
                            }}
                        />
                    </InputFrame>
                    {error && (
                        <div style={{
                            position: 'absolute',
                            top: '185px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '267px',
                            color: 'red'
                        }}>
                            {error}
                        </div>
                    )}
                    <SubmitButton style={{ background: buttonBackground, marginTop: '565px' }}>
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
                            Tiếp tục
                        </div>
                    </SubmitButton>
                </form>

            </div>
        </div>
    );
};

export default LoginEmail;