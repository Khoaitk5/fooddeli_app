import { X, User, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

export function EditProfileDialog({ isOpen, onClose, userData, onSave, isMobile, isTablet }) {
  const [formData, setFormData] = useState({
    name: userData.name,
    phone: userData.phone,
    email: userData.email
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const padding = isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem';
  const inputPadding = isMobile ? '0.875rem' : '1rem';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Dialog */}
      <div style={{
        position: 'relative',
        background: '#fff',
        borderRadius: isMobile ? '1.25rem' : '1.5rem',
        width: isMobile ? 'calc(100% - 2rem)' : isTablet ? '480px' : '520px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 1.25rem 3.75rem rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
          padding: padding,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            margin: 0,
            color: '#fff',
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '600'
          }}>
            Chỉnh sửa thông tin
          </h2>
          <button
            onClick={onClose}
            style={{
              width: isMobile ? '2rem' : '2.25rem',
              height: isMobile ? '2rem' : '2.25rem',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <X size={isMobile ? 18 : 20} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: padding }}>
          {/* Name Field */}
          <div style={{ marginBottom: isMobile ? '1.25rem' : '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: isMobile ? '0.875rem' : '0.9375rem',
              fontWeight: '500',
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Họ và tên
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                position: 'absolute',
                left: inputPadding,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <User size={isMobile ? 18 : 20} color="#999" strokeWidth={2} />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: inputPadding,
                  paddingLeft: `calc(${inputPadding} * 2 + ${isMobile ? '18px' : '20px'})`,
                  border: '0.0625rem solid #e5e5e5',
                  borderRadius: '0.75rem',
                  fontSize: isMobile ? '0.9375rem' : '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#ee4d2d';
                  e.currentTarget.style.boxShadow = '0 0 0 0.1875rem rgba(238, 77, 45, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Phone Field */}
          <div style={{ marginBottom: isMobile ? '1.25rem' : '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: isMobile ? '0.875rem' : '0.9375rem',
              fontWeight: '500',
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Số điện thoại
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                position: 'absolute',
                left: inputPadding,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <Phone size={isMobile ? 18 : 20} color="#999" strokeWidth={2} />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                pattern="[0-9]{10}"
                style={{
                  width: '100%',
                  padding: inputPadding,
                  paddingLeft: `calc(${inputPadding} * 2 + ${isMobile ? '18px' : '20px'})`,
                  border: '0.0625rem solid #e5e5e5',
                  borderRadius: '0.75rem',
                  fontSize: isMobile ? '0.9375rem' : '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#ee4d2d';
                  e.currentTarget.style.boxShadow = '0 0 0 0.1875rem rgba(238, 77, 45, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: isMobile ? '1.5rem' : '1.75rem' }}>
            <label style={{
              display: 'block',
              fontSize: isMobile ? '0.875rem' : '0.9375rem',
              fontWeight: '500',
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                position: 'absolute',
                left: inputPadding,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <Mail size={isMobile ? 18 : 20} color="#999" strokeWidth={2} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: inputPadding,
                  paddingLeft: `calc(${inputPadding} * 2 + ${isMobile ? '18px' : '20px'})`,
                  border: '0.0625rem solid #e5e5e5',
                  borderRadius: '0.75rem',
                  fontSize: isMobile ? '0.9375rem' : '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#ee4d2d';
                  e.currentTarget.style.boxShadow = '0 0 0 0.1875rem rgba(238, 77, 45, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: isMobile ? '0.75rem' : '1rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: isMobile ? '0.875rem' : '1rem',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '0.75rem',
                color: '#666',
                fontSize: isMobile ? '0.9375rem' : '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: isMobile ? '0.875rem' : '1rem',
                background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
                border: 'none',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: isMobile ? '0.9375rem' : '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 0.25rem 0.75rem rgba(238, 77, 45, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-0.125rem)';
                e.currentTarget.style.boxShadow = '0 0.375rem 1rem rgba(238, 77, 45, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0.25rem 0.75rem rgba(238, 77, 45, 0.3)';
              }}
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(1rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
