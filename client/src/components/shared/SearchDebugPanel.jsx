import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * 🐛 SearchDebugPanel - Component debug cho chức năng tìm kiếm
 * 
 * Cách sử dụng:
 * 1. Import vào SearchResults.jsx
 * 2. Thêm <SearchDebugPanel /> vào cuối component
 * 3. Chỉ hiển thị trong development mode
 * 
 * Component này sẽ hiển thị:
 * - Query parameters hiện tại
 * - State của component
 * - API response
 * - Errors (nếu có)
 */
const SearchDebugPanel = ({
  queryParam,
  loading,
  products,
  videos,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();

  // Chỉ hiển thị trong development
  if (import.meta.env.PROD) {
    return null;
  }

  const debugInfo = {
    'URL Query Param': queryParam || '(empty)',
    'Loading State': loading ? 'true' : 'false',
    'Products Count': products?.length || 0,
    'Videos Count': videos?.length || 0,
    'Has Error': error ? 'true' : 'false',
    'All Search Params': Object.fromEntries(searchParams.entries()),
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: isOpen ? '400px' : '120px',
        maxHeight: isOpen ? '80vh' : '40px',
        backgroundColor: '#1a1a1a',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 9999,
        border: '2px solid #00ff00',
        borderRadius: '8px 0 0 0',
        overflow: 'auto',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 12px',
          backgroundColor: '#2a2a2a',
          cursor: 'pointer',
          fontWeight: 'bold',
          borderBottom: isOpen ? '1px solid #00ff00' : 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>🐛 Search Debug</span>
        <span>{isOpen ? '▼' : '▲'}</span>
      </div>

      {/* Content */}
      {isOpen && (
        <div style={{ padding: '12px' }}>
          {/* Debug Info */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#ffff00', marginBottom: '8px', fontWeight: 'bold' }}>
              📊 Debug Info:
            </div>
            {Object.entries(debugInfo).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '4px' }}>
                <span style={{ color: '#00aaff' }}>{key}:</span>{' '}
                <span style={{ color: '#ffffff' }}>
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>

          {/* Sample Data */}
          {products && products.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#ffff00', marginBottom: '8px', fontWeight: 'bold' }}>
                🍔 Sample Product:
              </div>
              <pre
                style={{
                  backgroundColor: '#0a0a0a',
                  padding: '8px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '150px',
                  fontSize: '10px',
                }}
              >
                {JSON.stringify(products[0], null, 2)}
              </pre>
            </div>
          )}

          {videos && videos.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#ffff00', marginBottom: '8px', fontWeight: 'bold' }}>
                🎥 Sample Video:
              </div>
              <pre
                style={{
                  backgroundColor: '#0a0a0a',
                  padding: '8px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '150px',
                  fontSize: '10px',
                }}
              >
                {JSON.stringify(videos[0], null, 2)}
              </pre>
            </div>
          )}

          {/* Error Info */}
          {error && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#ff0000', marginBottom: '8px', fontWeight: 'bold' }}>
                ❌ Error:
              </div>
              <pre
                style={{
                  backgroundColor: '#0a0a0a',
                  padding: '8px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '150px',
                  fontSize: '10px',
                  color: '#ff6666',
                }}
              >
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #00ff00', paddingTop: '12px' }}>
            <div style={{ color: '#ffff00', marginBottom: '8px', fontWeight: 'bold' }}>
              ⚡ Quick Actions:
            </div>
            <button
              onClick={() => {
                console.clear();
                console.log('🧹 Console cleared');
              }}
              style={{
                backgroundColor: '#2a2a2a',
                color: '#00ff00',
                border: '1px solid #00ff00',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px',
                fontSize: '11px',
              }}
            >
              Clear Console
            </button>
            <button
              onClick={() => {
                console.log('📊 Debug Info:', debugInfo);
                console.log('🍔 Products:', products);
                console.log('🎥 Videos:', videos);
              }}
              style={{
                backgroundColor: '#2a2a2a',
                color: '#00ff00',
                border: '1px solid #00ff00',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              Log to Console
            </button>
          </div>

          {/* Tips */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #00ff00', paddingTop: '12px' }}>
            <div style={{ color: '#ffff00', marginBottom: '8px', fontWeight: 'bold' }}>
              💡 Debug Tips:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '10px', color: '#aaaaaa' }}>
              <li>Mở Network tab để xem API requests</li>
              <li>Kiểm tra Console logs để xem errors</li>
              <li>Verify query parameter trong URL</li>
              <li>Check response format từ API</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDebugPanel;

