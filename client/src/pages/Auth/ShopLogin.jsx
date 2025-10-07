import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShopLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Replaced remote icon with inline SVG to avoid CORS/404 issues

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up real auth; for now, navigate to dashboard on submit
    navigate('/shop/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage:
          'linear-gradient(147.55105109201673deg, rgba(255, 247, 237, 1) 0%, rgba(254, 242, 242, 1) 100%), linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)',
        padding: 16
      }}
    >
      <div
        style={{
          width: 448,
          height: 425.6,
          background: '#ffffff',
          borderRadius: 14,
          border: '0.8px solid rgba(0,0,0,0.1)',
          boxShadow:
            '0px 12px 24px rgba(63, 76, 95, 0.12), 0px 4px 12px rgba(63, 76, 95, 0.06)',
          padding: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ height: 156, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: 191.2,
              top: 24,
              width: 64,
              height: 64,
              borderRadius: 9999,
              background: '#ff6900',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Login Icon"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="#ffffff"
              aria-hidden="true"
              focusable="false"
              style={{ display: 'block' }}
            >
              <path d="M7 4a5 5 0 0 1 10 0h3a1 1 0 1 1 0 2h-1l-1.2 12.02A3 3 0 0 1 14.81 21H9.19a3 3 0 0 1-2.99-2.98L5 6H4a1 1 0 1 1 0-2h3zm2 0a3 3 0 1 1 6 0H9zm-1.02 4 1.04 10.02c.06.52.5.92 1.03.92h5.62c.53 0 .97-.4 1.03-.92L18.74 8H7.98z" />
            </svg>
          </div>
          <div
            style={{ position: 'absolute', left: 24, top: 110, width: 398.4 }}
          >
            <p
              style={{
                textAlign: 'center',
                transform: 'translateX(-50%)',
                position: 'relative',
                left: 199.96,
                fontSize: 16,
                lineHeight: '16px',
                color: '#111827'
              }}
            >
              Đăng nhập Shop
            </p>
          </div>
          <div
            style={{ position: 'absolute', left: 24, top: 132, width: 398.4 }}
          >
            <p
              style={{
                textAlign: 'center',
                transform: 'translateX(-50%)',
                position: 'relative',
                left: 199.66,
                fontSize: 16,
                lineHeight: '24px',
                color: '#717182'
              }}
            >
              Đăng nhập để quản lý shop của bạn
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              padding: '0 24px'
            }}
          >
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, color: '#111827' }}>Email</label>
              <div
                style={{
                  height: 36,
                  borderRadius: 8,
                  background: '#f3f3f5',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px'
                }}
              >
                <input
                  type="email"
                  placeholder="admin@shop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 14,
                    color: '#000'
                  }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, color: '#111827' }}>Mật khẩu</label>
              <div
                style={{
                  height: 36,
                  borderRadius: 8,
                  background: '#f3f3f5',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px'
                }}
              >
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 14,
                    color: '#000'
                  }}
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              style={{
                height: 36,
                borderRadius: 8,
                background: '#ff6900',
                color: '#fff',
                fontSize: 14,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Đăng nhập
            </button>

            {/* Caption */}
            <p
              style={{
                textAlign: 'center',
                color: '#717182',
                fontSize: 14,
                margin: 0
              }}
            >
              Demo: Nhập bất kỳ email và mật khẩu nào để đăng nhập
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopLogin;


