import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackArrow from '@/components/shared/BackArrow';
import HelpPopup from '@/components/shared/HelpPopup';

const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [showHelpPopup, setShowHelpPopup] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const phone = location.state?.phone || '';
    const email = location.state?.email || '';
    const contact = phone ? `+84 ${phone}` : email;
    const inputRefs = useRef([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (otp.every(digit => digit !== '')) {
            // Navigate to home or handle login
            navigate('/customer/home');
        } else {
            setError('Please enter a valid 6-digit OTP');
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value.replace(/\D/g, '');
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const buttonBackground = otp.every(digit => digit !== '') ? 'rgba(249, 112, 75, 1)' : 'rgba(249, 112, 75, 0.5)';

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
                    top: '119px',
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
                            fontSize: 28,
                            fontFamily: 'TikTok Sans',
                            fontWeight: '700',
                            whiteSpace: 'nowrap'
                        }}>
                            Nhập mã gồm 6 chữ số
                        </span>
                    </div>
                </div>

                {/* Phone Message */}
                <div style={{
                    position: 'absolute',
                    left: '33px',
                    top: '168px',
                    width: 'auto',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <span style={{
                        color: '#868686',
                        fontSize: 12.50,
                        fontFamily: 'TikTok Sans',
                        fontWeight: '400',
                        whiteSpace: 'nowrap',
                        marginRight: '4px'
                    }}>
                        Mã của bạn đã được gửi đến 
                    </span>
                    <span style={{
                        color: '#868686',
                        fontSize: 12.50,
                        fontFamily: 'TikTok Sans',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                    }}>
                        {contact}
                    </span>
                </div>

                {/* Back Arrow */}
                <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '43px',
                    cursor: 'pointer'
                }} onClick={() => navigate(-1)}>
                    <BackArrow />
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '206px',
                        transform: 'translateX(-50%)',
                        width: '300px',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        gap: '6px',
                        justifyContent: 'center',
                        marginBottom: '16px'
                    }}>
                        {otp.map((digit, index) => (
                            <div key={index} style={{
                                width: '45px',
                                height: '48px',
                                background: '#F2F2F2',
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <input
                                    ref={(el) => inputRefs.current[index] = el}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => {
                                        handleKeyDown(index, e);
                                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                            e.preventDefault();
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: 'transparent',
                                        textAlign: 'center',
                                        color: 'black',
                                        fontSize: 24,
                                        fontFamily: 'TikTok Sans',
                                        fontWeight: '600',
                                    }}
                                    maxLength={1}
                                />
                            </div>
                        ))}
                    </div>
                    {error && (
                        <div style={{ color: 'red', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}
                </form>

                {/* Resend Code */}
                <div style={{
                    position: 'absolute',
                    left: '30px',
                    top: '276px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <span style={{
                        color: '#868686',
                        fontSize: 14,
                        fontFamily: 'TikTok Sans',
                        fontWeight: '500',
                        wordWrap: 'break-word',
                        cursor: countdown === 0 ? 'pointer' : 'default'
                    }} onClick={countdown === 0 ? () => setCountdown(60) : undefined}>
                        Gửi lại mã{countdown > 0 ? ` ${countdown}s` : ''}
                    </span>
                </div>

                {/* Help Link */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '320px',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <span style={{
                        color: '#EF5126',
                        fontSize: 14,
                        fontFamily: 'TikTok Sans',
                        fontWeight: '500',
                        wordWrap: 'break-word',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }} onClick={() => setShowHelpPopup(true)}>
                        Bạn cần trợ giúp đăng nhập?
                    </span>
                </div>

            </div>

            {/* Help Popup */}
            <HelpPopup 
                isOpen={showHelpPopup} 
                onClose={() => setShowHelpPopup(false)} 
            />
        </div>
    );
};

export default OTP;