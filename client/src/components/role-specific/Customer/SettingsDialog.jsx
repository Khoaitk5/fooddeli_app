import { X, Bell, Globe, Moon, HelpCircle, Shield } from 'lucide-react';
import { useState } from 'react';

export function SettingsDialog({ isOpen, onClose, isMobile, isTablet }) {
  const [settings, setSettings] = useState({
    notifications: true,
    orderUpdates: true,
    promotions: false,
    darkMode: false,
    language: 'vi'
  });

  const padding = isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem';

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) return null;

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

      <div style={{
        position: 'relative',
        background: '#fff',
        borderRadius: isMobile ? '1.25rem' : '1.5rem',
        width: isMobile ? 'calc(100% - 2rem)' : isTablet ? '480px' : '520px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
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
            Cài đặt
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

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: padding
        }}>
          {/* Notifications Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '0.9375rem',
              fontWeight: '600',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              Thông báo
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '0.75rem',
              border: '0.0625rem solid #f0f0f0',
              overflow: 'hidden'
            }}>
              <SettingItem
                icon={Bell}
                label="Nhận thông báo"
                checked={settings.notifications}
                onChange={() => toggleSetting('notifications')}
                isMobile={isMobile}
              />
              <SettingItem
                icon={Bell}
                label="Cập nhật đơn hàng"
                checked={settings.orderUpdates}
                onChange={() => toggleSetting('orderUpdates')}
                isMobile={isMobile}
                hasBorder
              />
              <SettingItem
                icon={Bell}
                label="Khuyến mãi & Ưu đãi"
                checked={settings.promotions}
                onChange={() => toggleSetting('promotions')}
                isMobile={isMobile}
              />
            </div>
          </div>

          {/* Appearance Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '0.9375rem',
              fontWeight: '600',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              Giao diện
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '0.75rem',
              border: '0.0625rem solid #f0f0f0',
              overflow: 'hidden'
            }}>
              <SettingItem
                icon={Moon}
                label="Chế độ tối"
                checked={settings.darkMode}
                onChange={() => toggleSetting('darkMode')}
                isMobile={isMobile}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isMobile ? '1rem' : '1.125rem',
                borderTop: '0.0625rem solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: isMobile ? '2.25rem' : '2.5rem',
                    height: isMobile ? '2.25rem' : '2.5rem',
                    borderRadius: '0.625rem',
                    background: '#f0f9ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Globe size={isMobile ? 18 : 20} color="#0ea5e9" strokeWidth={2} />
                  </div>
                  <span style={{
                    fontSize: isMobile ? '0.9375rem' : '1rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    Ngôn ngữ
                  </span>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '0.0625rem solid #e5e5e5',
                    fontSize: isMobile ? '0.875rem' : '0.9375rem',
                    color: '#666',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Other Section */}
          <div>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '0.9375rem',
              fontWeight: '600',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              Khác
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '0.75rem',
              border: '0.0625rem solid #f0f0f0',
              overflow: 'hidden'
            }}>
              <button style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: isMobile ? '1rem' : '1.125rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: isMobile ? '2.25rem' : '2.5rem',
                  height: isMobile ? '2.25rem' : '2.5rem',
                  borderRadius: '0.625rem',
                  background: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <HelpCircle size={isMobile ? 18 : 20} color="#f59e0b" strokeWidth={2} />
                </div>
                <span style={{
                  fontSize: isMobile ? '0.9375rem' : '1rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  Trợ giúp & Hỗ trợ
                </span>
              </button>

              <button style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: isMobile ? '1rem' : '1.125rem',
                background: 'transparent',
                border: 'none',
                borderTop: '0.0625rem solid #f0f0f0',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: isMobile ? '2.25rem' : '2.5rem',
                  height: isMobile ? '2.25rem' : '2.5rem',
                  borderRadius: '0.625rem',
                  background: '#f3e8ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Shield size={isMobile ? 18 : 20} color="#8b5cf6" strokeWidth={2} />
                </div>
                <span style={{
                  fontSize: isMobile ? '0.9375rem' : '1rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  Chính sách & Điều khoản
                </span>
              </button>
            </div>
          </div>
        </div>
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

function SettingItem({ icon: Icon, label, checked, onChange, isMobile, hasBorder }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '1rem' : '1.125rem',
      borderTop: hasBorder ? '0.0625rem solid #f0f0f0' : 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: isMobile ? '2.25rem' : '2.5rem',
          height: isMobile ? '2.25rem' : '2.5rem',
          borderRadius: '0.625rem',
          background: checked ? '#fff7ed' : '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={isMobile ? 18 : 20} color={checked ? '#ee4d2d' : '#999'} strokeWidth={2} />
        </div>
        <span style={{
          fontSize: isMobile ? '0.9375rem' : '1rem',
          color: '#333',
          fontWeight: '500'
        }}>
          {label}
        </span>
      </div>

      <label style={{
        position: 'relative',
        display: 'inline-block',
        width: isMobile ? '2.75rem' : '3rem',
        height: isMobile ? '1.5rem' : '1.625rem',
        cursor: 'pointer'
      }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ display: 'none' }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: checked ? '#ee4d2d' : '#e5e5e5',
          borderRadius: '1.5rem',
          transition: 'all 0.3s'
        }}>
          <div style={{
            position: 'absolute',
            top: '0.125rem',
            left: checked ? (isMobile ? '1.375rem' : '1.5rem') : '0.125rem',
            width: isMobile ? '1.25rem' : '1.375rem',
            height: isMobile ? '1.25rem' : '1.375rem',
            background: '#fff',
            borderRadius: '50%',
            transition: 'all 0.3s',
            boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.2)'
          }} />
        </div>
      </label>
    </div>
  );
}
