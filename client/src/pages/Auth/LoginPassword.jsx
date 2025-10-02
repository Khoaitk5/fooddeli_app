import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '@/components/shared/BackArrow';

const LoginPassword = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const isValid = password.length >= 6;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'white',
            padding: '20px'
        }}>
            <div style={{
                width: '360px',
                height: '800px',
                position: 'relative',
                background: 'white'
            }}>
                {/* Back */}
                <div style={{ position: 'absolute', left: '12px', top: '43px', cursor: 'pointer' }} onClick={() => navigate(-1)}>
                    <BackArrow />
                </div>

                {/* Title */}
                <div style={{ position: 'absolute', left: '50%', top: '119px', transform: 'translateX(-50%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <span style={{ color: 'black', fontSize: 28, fontFamily: 'TikTok Sans', fontWeight: '700', whiteSpace: 'nowrap' }}>
                            Nhập mật khẩu
                        </span>
                    </div>
                </div>

                {/* Password field (gray rounded) */}
                <div style={{ position: 'absolute', left: '50%', top: '169px', transform: 'translateX(-50%)', width: '302px', height: '44px', background: '#F2F2F2', borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu"
                        style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'TikTok Sans', fontSize: 14, color: '#000' }}
                    />
                </div>

                {/* Help link */}
                <div style={{ position: 'absolute', left: '30px', top: '240px' }}>
                    <span style={{ color: 'black', fontSize: 14, fontFamily: 'TikTok Sans', fontWeight: '700' }}>Bạn cần trợ giúp đăng nhập?</span>
                </div>

                {/* Continue button */}
                <div
                    onClick={() => isValid && navigate('/customer/feed')}
                    style={{ position: 'absolute', left: '50%', top: '746px', transform: 'translateX(-50%)', width: '269px', height: '43px', borderRadius: 9999, background: isValid ? 'rgba(249,112,75,1)' : 'rgba(249,112,75,0.5)', cursor: 'pointer' }}
                >
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: 13, fontFamily: 'TikTok Sans', fontWeight: '600' }}>Tiếp tục</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPassword;


