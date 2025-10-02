import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackArrow from '@/components/shared/BackArrow';
import Rectangle164 from '@/components/shared/Rectangle164';

const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [showOptions, setShowOptions] = useState(false);
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
            navigate('/customer/feed');
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

    const OTP_FILLED = otp.every(digit => digit !== '');

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

                {/* Help text */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '318px',
                    transform: 'translateX(-50%)',
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        display: 'flex'
                    }}>
                        <span onClick={() => setShowOptions(true)} style={{
                            color: 'black',
                            fontSize: 14,
                            fontFamily: 'TikTok Sans',
                            fontWeight: '700',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                        }}>
                            Bạn cần trợ giúp đăng nhập?
                        </span>
                    </div>
                </div>

                {/* Popup bottom sheet - only show when help is clicked */}
                {showOptions && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        style={{ position: 'absolute', inset: 0 }}
                    >
                        {/* Backdrop */}
                        <div
                            onClick={() => setShowOptions(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}
                        />

                        <Rectangle164 style={{ top: '540px', height: '260px' }}>
                            {/* Section title */}
                            <div style={{
                                position: 'absolute',
                                left: '50%',
                                top: '10px',
                                transform: 'translateX(-50%)',
                                color: '#868686',
                                fontSize: 12,
                                fontFamily: 'TikTok Sans',
                                fontWeight: '600',
                                whiteSpace: 'nowrap'
                            }}>
                                Chọn một tùy chọn đăng nhập
                            </div>

                            {/* Divider 1 */}
                            <div style={{ position: 'absolute', left: 0, top: '34px', width: '360px', height: '0.3px', background: '#d9d9d9' }} />

                            {/* Change to email */}
                            <div
                                onClick={() => { setShowOptions(false); navigate('/login/email'); }}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '56px',
                                    transform: 'translateX(-50%)',
                                    color: 'black',
                                    fontSize: 14,
                                    fontFamily: 'TikTok Sans',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Chuyển sang dùng email
                            </div>

                            {/* Divider 2 */}
                            <div style={{ position: 'absolute', left: 0, top: '88px', width: '360px', height: '0.3px', background: '#d9d9d9' }} />

                            {/* Change to password */}
                            <div
                                onClick={() => { setShowOptions(false); navigate('/login/password'); }}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '112px',
                                    transform: 'translateX(-50%)',
                                    color: 'black',
                                    fontSize: 14,
                                    fontFamily: 'TikTok Sans',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Chuyển sang dùng mật khẩu
                            </div>

                            {/* Divider 3 */}
                            <div style={{ position: 'absolute', left: 0, top: '144px', width: '360px', height: '0.3px', background: '#d9d9d9' }} />

                            {/* Recover account */}
                            <div
                                onClick={() => { setShowOptions(false); navigate('/recover'); }}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '168px',
                                    transform: 'translateX(-50%)',
                                    color: 'black',
                                    fontSize: 14,
                                    fontFamily: 'TikTok Sans',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Khôi phục tài khoản của bạn
                            </div>
                        </Rectangle164>

                        {/* Neutral bar separating Cancel line */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: '745px',
                            width: '360px',
                            height: '7px',
                            background: '#f5f5f5'
                        }} />

                        {/* White background for Cancel row */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: '752px',
                            width: '360px',
                            height: '48px',
                            background: 'white'
                        }} />

                        {/* Cancel link inside overlay */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '776px',
                            transform: 'translateX(-50%)',
                            color: 'black',
                            fontSize: 14,
                            fontFamily: 'TikTok Sans',
                            fontWeight: '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }} onClick={() => setShowOptions(false)}>
                            Hủy
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default OTP;