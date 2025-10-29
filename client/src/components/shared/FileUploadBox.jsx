import React, { useRef, useState } from 'react';

const FileUploadBox = ({ label, fieldName, icon: Icon, required = true, preview, onFileChange, aspectRatio = 'square' }) => {
  const inputRef = useRef(null);
  const [previewError, setPreviewError] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    try {
      setPreviewError(false);
      if (typeof onFileChange === 'function') {
        onFileChange(e);
      }
    } catch (error) {
      console.error('❌ [FileUploadBox] Error handling file change:', error);
      setPreviewError(true);
    }
  };

  const isValidPreview = preview && typeof preview === 'string' && preview.trim() !== '';

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.9375rem',
        fontWeight: '500',
        color: '#333'
      }}>
        {label} {required && <span style={{ color: '#ee4d2d' }}>*</span>}
      </label>
      <div
        style={{
          border: '0.125rem dashed #ddd',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: isValidPreview ? '#f9f9f9' : '#fff'
        }}
        onClick={handleClick}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ee4d2d'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {isValidPreview && !previewError ? (
          <div>
            <img 
              src={preview} 
              alt="Preview" 
              style={{
                maxWidth: '100%',
                maxHeight: aspectRatio === 'wide' ? '10rem' : '12rem',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem'
              }}
              onError={() => {
                console.warn('⚠️ [FileUploadBox] Failed to load preview image');
                setPreviewError(true);
              }}
            />
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              Nhấn để thay đổi ảnh
            </div>
          </div>
        ) : (
          <div>
            <Icon size={40} color="#ddd" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.9375rem', color: '#666' }}>
              Nhấn để tải ảnh lên
            </div>
            {aspectRatio === 'wide' && (
              <div style={{ fontSize: '0.8125rem', color: '#999', marginTop: '0.25rem' }}>
                Khuyến nghị tỷ lệ 16:9
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadBox;
