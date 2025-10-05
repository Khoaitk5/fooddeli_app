import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShopLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const imgIcon = "https://www.figma.com/api/mcp/asset/47d4d3ef-37b1-48d4-868c-fe561ddb00a3";

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
            <img src={imgIcon} alt="" style={{ width: 32, height: 32 }} />
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


