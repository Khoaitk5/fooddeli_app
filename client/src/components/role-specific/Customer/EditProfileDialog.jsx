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
      justifyContent: 'center'
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
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
          padding,
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
          >
            <X size={isMobile ? 18 : 20} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding }}>
          {/* Họ và tên */}
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
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{
                position: 'absolute', left: inputPadding,
                display: 'flex', alignItems: 'center', pointerEvents: 'none'
              }}>
                <User size={isMobile ? 18 : 20} color="#999" strokeWidth={2} />
              </div>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
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
              />
            </div>
          </div>

          {/* Số điện thoại */}
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
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{
                position: 'absolute', left: inputPadding,
                display: 'flex', alignItems: 'center', pointerEvents: 'none'
              }}>
                <Phone size={isMobile ? 18 : 20} color="#999" strokeWidth={2} />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
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
              />
            </div>
          </div>

          {/* Email */}
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
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{
                position: 'absolute', left: inputPadding,
                display: 'flex', alignItems: 'center', pointerEvents: 'none'
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
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: isMobile ? '0.875rem' : '1rem',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '0.75rem',
                color: '#666',
                fontSize: isMobile ? '0.9375rem' : '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
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
                opacity: loading ? 0.7 : 1
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
            from { opacity: 0; transform: translateY(1rem); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
