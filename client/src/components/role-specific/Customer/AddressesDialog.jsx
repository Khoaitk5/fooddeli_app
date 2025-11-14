import { useState } from 'react';
import { X } from 'lucide-react';
import AddressSelector from './AddressSelector';

export function AddressesDialog({ isOpen, onClose, isMobile, isTablet }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const padding = isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem';

  const handleAddressChange = () => {
    // Refresh AddressSelector khi có thay đổi
    setRefreshKey(prev => prev + 1);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)'
        }}
      />

      <div style={{
        position: 'relative', background: '#fff',
        borderRadius: isMobile ? '1.25rem' : '1.5rem',
        width: isMobile ? 'calc(100% - 2rem)' : isTablet ? '540px' : '600px',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 1.25rem 3.75rem rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FE5621 0%, #FF8A65 100%)',
          padding, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTopLeftRadius: isMobile ? '1.25rem' : '1.5rem',
          borderTopRightRadius: isMobile ? '1.25rem' : '1.5rem'
        }}>
          <h2 style={{
            margin: 0, color: '#fff', fontSize: isMobile ? '1.6rem' : '1.8rem', fontWeight: '700'
          }}>
            Địa chỉ của tôi
          </h2>
          <button
            onClick={onClose}
            style={{
              width: isMobile ? '3rem' : '3.5rem', height: isMobile ? '3rem' : '3.5rem',
              borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <X size={isMobile ? 20 : 24} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content - Sử dụng AddressSelector component */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
          <AddressSelector
            key={refreshKey}
            isOpen={true}
            onClose={() => {}}
            onSelectAddress={handleAddressChange}
            showInDialog={true}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(1rem); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
