import { X, User, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function EditProfileDialog({ isOpen, onClose, onSave, isMobile, isTablet }) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);

  const padding = isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem';
  const inputPadding = isMobile ? '0.875rem' : '1rem';

  // 🧩 Lấy dữ liệu user thật khi mở dialog
  useEffect(() => {
    if (!isOpen) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true });
        const u = res.data?.user;
        if (u) {
          setFormData({
            full_name: u.full_name || "",
            phone: u.phone || "",
            email: u.email || ""
          });
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin người dùng:", err);
        alert("Không thể tải thông tin người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isOpen]);

  // 🧩 Xử lý thay đổi input
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 🧩 Gửi dữ liệu cập nhật user
  const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔹 Kiểm tra số điện thoại
  const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
  if (!phoneRegex.test(formData.phone)) {
    alert("⚠️ Số điện thoại không hợp lệ.Vui lòng nhập 10 số hợp lệ.");
    return;
  }

  try {
    const res = await axios.put(
      `${API_BASE_URL}/users/me`,
      {
        full_name: formData.name,
        phone: formData.phone,
        email: formData.email,
      },
      { withCredentials: true }
    );

    alert(res.data.message || "✅ Cập nhật thông tin thành công!");
    onSave(res.data.user);
    onClose();
  } catch (err) {
    alert("❌ Lỗi khi lưu dữ liệu: " + (err.response?.data?.message || err.message));
  }
};


  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '1rem' : '2rem'
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-out'
        }}
      />

      {/* Dialog */}
      <div style={{
        position: 'relative',
        background: '#fff',
        borderRadius: isMobile ? '1.75rem' : '2.25rem',
        width: isMobile ? '100%' : isTablet ? '560px' : '640px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 1.5rem 5rem rgba(0, 0, 0, 0.4), 0 0.5rem 2rem rgba(238, 77, 45, 0.1)',
        animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 50%, #ff8c42 100%)',
          padding: isMobile ? '2rem 1.75rem' : '2.75rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 0.25rem 1.5rem rgba(238, 77, 45, 0.2)'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              color: '#fff',
              fontSize: isMobile ? '1.625rem' : '1.875rem',
              fontWeight: '700',
              letterSpacing: '-0.02em'
            }}>
              Chỉnh sửa thông tin
            </h2>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: isMobile ? '0.9375rem' : '1.0625rem',
              fontWeight: '500'
            }}>
              Cập nhật thông tin cá nhân của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: isMobile ? '2.75rem' : '3.25rem',
              height: isMobile ? '2.75rem' : '3.25rem',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <X size={isMobile ? 22 : 26} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ 
          padding: isMobile ? '2.5rem 2rem' : '3rem 2.5rem',
          background: '#fafafa'
        }}>
          {/* Họ và tên */}
          <div style={{ marginBottom: isMobile ? '2rem' : '2.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: isMobile ? '1.0625rem' : '1.1875rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Họ và tên <span style={{ color: '#ee4d2d', fontSize: '1.25rem' }}>*</span>
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{
                position: 'absolute', left: isMobile ? '1.25rem' : '1.5rem',
                display: 'flex', alignItems: 'center', pointerEvents: 'none',
                zIndex: 1
              }}>
                <User size={isMobile ? 24 : 28} color="#6b7280" strokeWidth={2} />
              </div>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                required
                placeholder="Nhập họ và tên"
                style={{
                  width: '100%',
                  padding: isMobile ? '1.25rem 1.25rem 1.25rem 3.75rem' : '1.5rem 1.5rem 1.5rem 4.5rem',
                  border: '0.125rem solid #e5e7eb',
                  borderRadius: '1.25rem',
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  background: '#fff',
                  color: '#1f2937',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ee4d2d';
                  e.target.style.boxShadow = '0 0 0 0.25rem rgba(238, 77, 45, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div style={{ marginBottom: isMobile ? '2rem' : '2.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: isMobile ? '1.0625rem' : '1.1875rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Số điện thoại
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{
                position: 'absolute', left: isMobile ? '1.25rem' : '1.5rem',
                display: 'flex', alignItems: 'center', pointerEvents: 'none',
                zIndex: 1
              }}>
                <Phone size={isMobile ? 24 : 28} color="#6b7280" strokeWidth={2} />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
                style={{
                  width: '100%',
                  padding: isMobile ? '1.25rem 1.25rem 1.25rem 3.75rem' : '1.5rem 1.5rem 1.5rem 4.5rem',
                  border: '0.125rem solid #e5e7eb',
                  borderRadius: '1.25rem',
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  background: '#fff',
                  color: '#1f2937',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ee4d2d';
                  e.target.style.boxShadow = '0 0 0 0.25rem rgba(238, 77, 45, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: isMobile ? '2.5rem' : '3rem' }}>
            <label style={{
              display: 'block',
              fontSize: isMobile ? '1.0625rem' : '1.1875rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Email <span style={{ color: '#ee4d2d', fontSize: '1.25rem' }}>*</span>
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{
                position: 'absolute', left: isMobile ? '1.25rem' : '1.5rem',
                display: 'flex', alignItems: 'center', pointerEvents: 'none',
                zIndex: 1
              }}>
                <Mail size={isMobile ? 24 : 28} color="#6b7280" strokeWidth={2} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                placeholder="Nhập email"
                style={{
                  width: '100%',
                  padding: isMobile ? '1.25rem 1.25rem 1.25rem 3.75rem' : '1.5rem 1.5rem 1.5rem 4.5rem',
                  border: '0.125rem solid #e5e7eb',
                  borderRadius: '1.25rem',
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  background: '#fff',
                  color: '#1f2937',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ee4d2d';
                  e.target.style.boxShadow = '0 0 0 0.25rem rgba(238, 77, 45, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: isMobile ? '1.25rem' : '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: isMobile ? '1.375rem' : '1.5rem',
                background: '#fff',
                border: '0.125rem solid #e5e7eb',
                borderRadius: '1.25rem',
                color: '#6b7280',
                fontSize: isMobile ? '1.125rem' : '1.25rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.transform = 'translateY(-0.125rem)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: isMobile ? '1.375rem' : '1.5rem',
                background: loading ? '#d1d5db' : 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 50%, #ff8c42 100%)',
                border: 'none',
                borderRadius: '1.25rem',
                color: '#fff',
                fontSize: isMobile ? '1.125rem' : '1.25rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 0.25rem 1rem rgba(238, 77, 45, 0.25)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-0.125rem)';
                  e.currentTarget.style.boxShadow = '0 0.5rem 1.5rem rgba(238, 77, 45, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0.25rem 1rem rgba(238, 77, 45, 0.25)';
              }}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from { 
              opacity: 0; 
              transform: translateY(2rem) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
