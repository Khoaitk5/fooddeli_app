import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '@/components/shared/BackArrow';
import HelpPopup from '@/components/shared/HelpPopup';
import { pxW, pxH } from '../../utils/scale.js';

const LoginPassword = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showHelpPopup, setShowHelpPopup] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login with password:', password);
        // Navigate to home or handle login
        navigate('/customer/home');
    };

    const buttonBackground = password.length > 0 ? 'rgba(249, 112, 75, 1)' : 'rgba(249, 112, 75, 0.5)';

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
                width: pxW(360),
                height: pxH(800),
                position: 'relative',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>

                {/* Back Arrow */}
                <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '43px',
                    cursor: 'pointer'
                }} onClick={() => navigate(-1)}>
                    <BackArrow />
                </div>

                {/* Title */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '119px',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <span style={{
                        color: 'black',
                        fontSize: 28,
                        fontFamily: 'TikTok Sans',
                        fontWeight: '700',
                        whiteSpace: 'nowrap'
                    }}>
                        Nhập mật khẩu
                    </span>
                </div>

                {/* Password Input */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '169px',
                        transform: 'translateX(-50%)',
                        width: '302px',
                    }}
                >
                    <div style={{
                        width: '302px',
                        height: '50px',
                        background: '#F2F2F2',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                        border: 'none',
                        boxShadow: 'none'
                    }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                color: 'black',
                                fontSize: 16,
                                fontFamily: 'TikTok Sans',
                                fontWeight: '400',
                            }}
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: '#868686',
                                padding: '6px 4px',
                                fontSize: 13,
                                fontFamily: 'TikTok Sans',
                                fontWeight: '600'
                            }}
                        >
                            {showPassword ? 'Ẩn' : 'Hiện'}
                        </button>
                    </div>
                </form>

                {/* Help Link */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '231px',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <span style={{
                        color: 'black',
                        fontSize: 14,
                        fontFamily: 'TikTok Sans',
                        fontWeight: '700',
                        wordWrap: 'break-word',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }} onClick={() => setShowHelpPopup(true)}>
                        Bạn cần trợ giúp đăng nhập?
                    </span>
                </div>

                {/* Continue Button */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '746px',
                    transform: 'translateX(-50%)',
                    width: '269px',
                    height: '43px'
                }}>
                    <button
                        onClick={handleSubmit}
                        disabled={password.length === 0}
                        style={{
                            width: '100%',
                            height: '100%',
                            background: buttonBackground,
                            borderRadius: '9999px',
                            border: 'none',
                            cursor: password.length > 0 ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span style={{
                            color: 'white',
                            fontSize: 13,
                            fontFamily: 'TikTok Sans',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                        }}>
                            Tiếp tục
                        </span>
                    </button>
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

export default LoginPassword;
