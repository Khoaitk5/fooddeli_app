import { useState } from 'react';
import { X, CreditCard, Wallet, Plus, Trash2 } from 'lucide-react';

export function PaymentMethodsDialog({ isOpen, onClose, isMobile, isTablet }) {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      name: 'Thẻ Techcombank',
      number: '**** **** **** 4532',
      isDefault: true
    },
    {
      id: 2,
      type: 'wallet',
      name: 'Ví MoMo',
      number: '090 123 4567',
      isDefault: false
    }
  ]);

  const padding = isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem';

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc muốn xóa phương thức thanh toán này?')) {
      setPaymentMethods(methods => methods.filter(m => m.id !== id));
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
            Phương thức thanh toán
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
          {paymentMethods.map((method, index) => {
            const Icon = method.type === 'card' ? CreditCard : Wallet;
            return (
              <div
                key={method.id}
                style={{
                  background: method.type === 'card' 
                    ? 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
                    : 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                  borderRadius: '1rem',
                  padding: isMobile ? '1.25rem' : '1.5rem',
                  marginBottom: index < paymentMethods.length - 1 ? '1rem' : 0,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {method.isDefault && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    fontSize: '0.6875rem',
                    fontWeight: '600',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '0.375rem',
                    backdropFilter: 'blur(10px)'
                  }}>
                    Mặc định
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  paddingRight: method.isDefault ? '4.5rem' : 0
                }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Icon size={24} color="#fff" strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: isMobile ? '1rem' : '1.0625rem',
                      fontWeight: '600',
                      color: '#fff',
                      marginBottom: '0.25rem'
                    }}>
                      {method.name}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.875rem' : '0.9375rem',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                      {method.number}
                    </div>
                  </div>
                </div>

                {!method.isDefault && (
                  <button
                    onClick={() => handleDelete(method.id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      borderRadius: '0.625rem',
                      fontSize: isMobile ? '0.875rem' : '0.9375rem',
                      fontWeight: '600',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                  >
                    <Trash2 size={16} strokeWidth={2} />
                    Xóa phương thức
                  </button>
                )}
              </div>
            );
          })}

          <button
            style={{
              width: '100%',
              padding: isMobile ? '1rem' : '1.125rem',
              marginTop: '1rem',
              background: '#fff',
              border: '0.125rem dashed #0ea5e9',
              borderRadius: '1rem',
              color: '#0ea5e9',
              fontSize: isMobile ? '0.9375rem' : '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            <Plus size={20} strokeWidth={2.5} />
            Thêm phương thức mới
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
