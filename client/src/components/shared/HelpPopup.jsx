import React from 'react';
import { useNavigate } from 'react-router-dom';

const HelpPopup = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleOptionClick = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px 12px 0 0',
                width: '360px',
                maxWidth: '100vw',
                height: '300px',
                position: 'relative'
            }}>
                {/* Header */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '18px',
                    transform: 'translateX(-50%)',
                    textAlign: 'center'
                }}>
                    <span style={{
                        color: '#868686',
                        fontSize: '12px',
                        fontFamily: 'TikTok Sans',
                        fontWeight: '600'
                    }}>
                        Chọn một tùy chọn đăng nhập
                    </span>
                </div>

                {/* Divider */}
                <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '84px',
                    width: '100%',
                    height: '0.3px',
                    backgroundColor: '#d9d9d9'
                }} />

                {/* Option 1: Chuyển sang dùng email */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50px',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: '16px 20px',
                    width: 'calc(100% - 40px)',
                    transition: 'background-color 0.2s ease'
                }} 
                onClick={() => handleOptionClick('/login/email')}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                    <span style={{
                        color: 'black',
                        fontSize: '16px',
                        fontFamily: 'TikTok Sans',
                        fontWeight: '600'
                    }}>
                        Chuyển sang dùng email
                    </span>
                </div>

                {/* Divider 1 */}
                <div style={{
                    position: 'absolute',
                    left: '20px',
                    top: '90px',
                    width: 'calc(100% - 40px)',
                    height: '1px',
                    backgroundColor: '#e0e0e0'
                }} />

                {/* Option 2: Chuyển sang dùng mật khẩu */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '110px',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: '16px 20px',
                    width: 'calc(100% - 40px)',
                    transition: 'background-color 0.2s ease'
                }} 
                onClick={() => handleOptionClick('/login/password')}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                    <span style={{
                        color: 'black',
                        fontSize: '16px',
                        fontFamily: 'TikTok Sans',
                        fontWeight: '600'
                    }}>
                        Chuyển sang dùng mật khẩu
                    </span>
                </div>

                {/* Divider 2 */}
                <div style={{
                    position: 'absolute',
                    left: '20px',
                    top: '150px',
                    width: 'calc(100% - 40px)',
                    height: '1px',
                    backgroundColor: '#e0e0e0'
                }} />

                {/* Option 3: Khôi phục tài khoản */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '170px',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: '16px 20px',
                    width: 'calc(100% - 40px)',
                    transition: 'background-color 0.2s ease'
                }} 
                onClick={() => {
                    // Có thể mở trang khôi phục tài khoản
                    alert('Tính năng khôi phục tài khoản sẽ được cập nhật sớm!');
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                    <span style={{
                        color: 'black',
                        fontSize: '16px',
                        fontFamily: 'TikTok Sans',
                        fontWeight: '600'
                    }}>
                        Khôi phục tài khoản của bạn
                    </span>
                </div>

                {/* Divider 3 */}
                <div style={{
                    position: 'absolute',
                    left: '20px',
                    top: '210px',
                    width: 'calc(100% - 40px)',
                    height: '1px',
                    backgroundColor: '#e0e0e0'
                }} />

                {/* Bottom handle */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '7px',
                    transform: 'translateX(-50%)',
                    width: '360px',
                    height: '7px',
                    backgroundColor: '#f5f5f5'
                }} />

                {/* Option 4: Hủy */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '230px',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: '16px 20px',
                    width: 'calc(100% - 40px)',
                    transition: 'background-color 0.2s ease'
                }} 
                onClick={onClose}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                    <span style={{
                        color: 'black',
                        fontSize: '16px',
                        fontFamily: 'TikTok Sans',
                        fontWeight: '400'
                    }}>
                        Hủy
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HelpPopup;
