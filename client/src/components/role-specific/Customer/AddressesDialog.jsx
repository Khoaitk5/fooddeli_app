import { useState } from 'react';
import { X, MapPin, Home, Briefcase, Plus, Edit2, Trash2 } from 'lucide-react';

export function AddressesDialog({ isOpen, onClose, isMobile, isTablet }) {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Nhà riêng',
      name: 'Nguyễn Thị Lan Anh',
      phone: '0901234567',
      address: 'Số 456 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
      isDefault: true,
      type: 'home'
    },
    {
      id: 2,
      label: 'Văn phòng',
      name: 'Nguyễn Thị Lan Anh',
      phone: '0901234567',
      address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      isDefault: false,
      type: 'work'
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);

  const padding = isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem';

  const getIcon = (type) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Briefcase;
      default: return MapPin;
    }
  };

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
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
        width: isMobile ? 'calc(100% - 2rem)' : isTablet ? '540px' : '600px',
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
            Địa chỉ của tôi
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
          {addresses.map((addr, index) => {
            const Icon = getIcon(addr.type);
            return (
              <div
                key={addr.id}
                style={{
                  background: '#f9f9f9',
                  borderRadius: '1rem',
                  padding: isMobile ? '1.125rem' : '1.25rem',
                  marginBottom: index < addresses.length - 1 ? '1rem' : 0,
                  border: addr.isDefault ? '0.125rem solid #ee4d2d' : '0.0625rem solid #e5e5e5',
                  position: 'relative'
                }}
              >
                {addr.isDefault && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#ee4d2d',
                    color: '#fff',
                    fontSize: '0.6875rem',
                    fontWeight: '600',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '0.375rem'
                  }}>
                    Mặc định
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.625rem',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={20} color="#ee4d2d" strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, paddingRight: addr.isDefault ? '4rem' : 0 }}>
                    <div style={{
                      fontSize: isMobile ? '1rem' : '1.0625rem',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '0.25rem'
                    }}>
                      {addr.label}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.875rem' : '0.9375rem',
                      color: '#666',
                      marginBottom: '0.125rem'
                    }}>
                      {addr.name} | {addr.phone}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.875rem' : '0.9375rem',
                      color: '#666'
                    }}>
                      {addr.address}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '0.0625rem solid #e5e5e5'
                }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '0.625rem',
                      background: '#fff',
                      border: '0.0625rem solid #e5e5e5',
                      borderRadius: '0.5rem',
                      fontSize: isMobile ? '0.875rem' : '0.9375rem',
                      fontWeight: '500',
                      color: '#666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ee4d2d';
                      e.currentTarget.style.color = '#ee4d2d';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.color = '#666';
                    }}
                  >
                    <Edit2 size={16} strokeWidth={2} />
                    Sửa
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleDelete(addr.id)}
                      style={{
                        flex: 1,
                        padding: '0.625rem',
                        background: '#fff',
                        border: '0.0625rem solid #e5e5e5',
                        borderRadius: '0.5rem',
                        fontSize: isMobile ? '0.875rem' : '0.9375rem',
                        fontWeight: '500',
                        color: '#666',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#ef4444';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e5e5';
                        e.currentTarget.style.color = '#666';
                      }}
                    >
                      <Trash2 size={16} strokeWidth={2} />
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setIsAddingNew(true)}
            style={{
              width: '100%',
              padding: isMobile ? '1rem' : '1.125rem',
              marginTop: '1rem',
              background: '#fff',
              border: '0.125rem dashed #ee4d2d',
              borderRadius: '1rem',
              color: '#ee4d2d',
              fontSize: isMobile ? '0.9375rem' : '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            <Plus size={20} strokeWidth={2.5} />
            Thêm địa chỉ mới
          </button>
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
