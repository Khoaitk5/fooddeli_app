import { useState, useEffect } from 'react';
import { X, MapPin, Home, Briefcase, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function AddressesDialog({ isOpen, onClose, isMobile, isTablet }) {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const padding = isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem';

  // 🧩 Lấy dữ liệu địa chỉ thật từ backend
  useEffect(() => {
    if (!isOpen) return;
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true });
        const user = res.data?.user;
        if (user && Array.isArray(user.addresses)) {
          setAddresses(user.addresses);
        } else {
          setAddresses([]);
        }
      } catch (err) {
        console.error("❌ Lỗi tải địa chỉ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [isOpen]);

  // 🗑️ Xóa địa chỉ qua API
  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/addresses/${id}`, { withCredentials: true });
      setAddresses(prev => prev.filter(addr => addr.address_id !== id));
    } catch (err) {
      alert("❌ Lỗi khi xóa địa chỉ: " + (err.response?.data?.message || err.message));
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Briefcase;
      default: return MapPin;
    }
  };

  // 👉 Điều hướng sang trang AddAddress
  const handleAddAddress = () => {
    onClose(); // đóng dialog trước
    navigate("/address/add");
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
          background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
          padding, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h2 style={{
            margin: 0, color: '#fff', fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: '600'
          }}>
            Địa chỉ của tôi
          </h2>
          <button
            onClick={onClose}
            style={{
              width: isMobile ? '2rem' : '2.25rem', height: isMobile ? '2rem' : '2.25rem',
              borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <X size={isMobile ? 18 : 20} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding }}>
          {loading ? (
            <p>Đang tải địa chỉ...</p>
          ) : addresses.length === 0 ? (
            <p>📭 Chưa có địa chỉ nào.</p>
          ) : (
            addresses.map((addr, index) => {
              const Icon = getIcon(addr.address_type);
              const detail = addr.address_line?.detail || "";
              const ward = addr.address_line?.ward || "";
              const district = addr.address_line?.district || "";
              const city = addr.address_line?.city || "";
              const fullAddress = [detail, ward, district, city].filter(Boolean).join(", ");
              return (
                <div
                  key={addr.address_id || index}
                  style={{
                    background: '#f9f9f9',
                    borderRadius: '1rem',
                    padding: isMobile ? '1.125rem' : '1.25rem',
                    marginBottom: '1rem',
                    border: addr.is_primary ? '0.125rem solid #ee4d2d' : '0.0625rem solid #e5e5e5',
                    position: 'relative'
                  }}
                >
                  {addr.is_primary && (
                    <div style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      background: '#ee4d2d', color: '#fff',
                      fontSize: '0.6875rem', fontWeight: '600',
                      padding: '0.25rem 0.625rem', borderRadius: '0.375rem'
                    }}>
                      Mặc định
                    </div>
                  )}

                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{
                      width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem',
                      background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Icon size={20} color="#ee4d2d" strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: isMobile ? '1rem' : '1.0625rem',
                        fontWeight: '600', color: '#333', marginBottom: '0.25rem'
                      }}>
                        {addr.address_type || "Địa chỉ"}
                      </div>
                      <div style={{
                        fontSize: isMobile ? '0.875rem' : '0.9375rem', color: '#666'
                      }}>
                        {fullAddress}
                      </div>
                      {addr.note && (
                        <div style={{
                          fontSize: isMobile ? '0.8125rem' : '0.875rem',
                          color: '#999', marginTop: '0.25rem'
                        }}>
                          Ghi chú: {addr.note}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', gap: '0.75rem', marginTop: '0.75rem',
                    paddingTop: '0.75rem', borderTop: '0.0625rem solid #e5e5e5'
                  }}>
                    <button
                      style={{
                        flex: 1, padding: '0.625rem', background: '#fff',
                        border: '0.0625rem solid #e5e5e5', borderRadius: '0.5rem',
                        fontSize: '0.9375rem', fontWeight: '500', color: '#666', cursor: 'pointer'
                      }}
                    >
                      <Edit2 size={16} strokeWidth={2} /> Sửa
                    </button>
                    {!addr.is_primary && (
                      <button
                        onClick={() => handleDelete(addr.address_id)}
                        style={{
                          flex: 1, padding: '0.625rem', background: '#fff',
                          border: '0.0625rem solid #e5e5e5', borderRadius: '0.5rem',
                          fontSize: '0.9375rem', fontWeight: '500', color: '#666', cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} strokeWidth={2} /> Xóa
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* 👉 Nút chuyển qua trang thêm địa chỉ */}
          <button
            onClick={handleAddAddress}
            style={{
              width: '100%', padding: '1rem', marginTop: '1rem',
              background: '#fff', border: '0.125rem dashed #ee4d2d',
              borderRadius: '1rem', color: '#ee4d2d', fontSize: '1rem',
              fontWeight: '600', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            <Plus size={20} strokeWidth={2.5} />
            Thêm địa chỉ mới
          </button>
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
