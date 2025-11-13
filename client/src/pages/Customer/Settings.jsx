import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, HelpCircle, Shield, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CustomerSettings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isMobile, setIsMobile] = useState(true);
  const [isTablet, setIsTablet] = useState(false);

  const layoutPadding = isMobile ? '1.75rem' : isTablet ? '2.25rem' : '3rem';
  const headerPadding = isMobile ? '1.25rem 1.5rem' : isTablet ? '1.75rem 2.25rem' : '2rem 3rem';
  const sectionSpacing = isMobile ? '1.75rem' : '2.25rem';
  const contentMaxWidth = isMobile ? '100%' : isTablet ? '720px' : '840px';
  const sectionLabelStyle = {
    fontSize: isMobile ? '1.1rem' : '1.2rem',
    fontWeight: 700,
    color: '#4b5563',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.85rem'
  };
  const cardWrapperStyle = {
    background: 'rgba(255,255,255,0.98)',
    borderRadius: '1rem',
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: '0 22px 50px rgba(15,23,42,0.08)',
    overflow: 'hidden',
    backdropFilter: 'blur(4px)'
  };

  const [userId, setUserId] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    orderUpdates: true,
  });

  const [showChangePwd, setShowChangePwd] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Detect viewport for simple mobile-first behavior
    const onResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 640);
      setIsTablet(w > 640 && w <= 1024);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true });
        const id = res.data?.user?.id;
        if (id) {
          setUserId(id);
          const raw = localStorage.getItem(`settings:user:${id}`);
          if (raw) {
            setSettings(prev => ({ ...prev, ...JSON.parse(raw) }));
          }
        }
      } catch {
        // ignore
      }
    };
    fetchUser();
  }, []);

  const toggleSetting = (key) => {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        if (userId) {
          localStorage.setItem(`settings:user:${userId}`, JSON.stringify(next));
        }
      } catch { /* ignore */ }
      return next;
    });
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá tài khoản?')) return;
    try {
      setDeleting(true);
      const res = await axios.delete(`${API_BASE_URL}/users/me`, { withCredentials: true });
      if (res.data?.success) {
        logout();
        navigate('/login');
      } else {
        alert(res.data?.message || 'Không thể xoá tài khoản');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi xoá tài khoản');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #fef2f2 0%, #ffffff 45%, #f8fafc 100%)',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#1f2937'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ee4d2d 0%, #ff7a45 100%)',
        padding: headerPadding,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 18px 40px rgba(238,77,45,0.35)'
      }}>
        <button onClick={() => navigate(-1)} style={{
          width: isMobile ? '2.4rem' : '2.75rem',
          height: isMobile ? '2.4rem' : '2.75rem',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.22)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 10px 18px rgba(255,255,255,0.25)',
          transition: 'transform 0.2s ease'
        }}>
          <X size={isMobile ? 20 : 22} color="#fff" strokeWidth={2.5} />
        </button>
        <h2 style={{
          margin: 0,
          color: '#fff',
          fontSize: isMobile ? '1.5rem' : isTablet ? '1.65rem' : '1.85rem',
          fontWeight: 700,
          letterSpacing: '0.03em'
        }}>Cài đặt</h2>
        <div style={{ width: isMobile ? '2.4rem' : '2.75rem' }} />
      </div>

      {/* Content */}
      <div style={{
        padding: layoutPadding,
        margin: '0 auto',
        marginTop: '0.75rem',
        maxWidth: contentMaxWidth,
        display: 'grid',
        gap: sectionSpacing
      }}>
        {/* Notifications Section */}
        <div style={{ display: 'grid', gap: isMobile ? '1.1rem' : '1.35rem' }}>
          <div style={sectionLabelStyle}>Thông báo</div>

          <div style={cardWrapperStyle}>
            <SettingItem icon={Bell} label="Nhận thông báo" checked={settings.notifications} onChange={() => toggleSetting('notifications')} isMobile={isMobile} />
            <SettingItem icon={Bell} label="Cập nhật đơn hàng" checked={settings.orderUpdates} onChange={() => toggleSetting('orderUpdates')} isMobile={isMobile} hasBorder />
          </div>
        </div>

        {/* Security Section */}
        <div style={{ display: 'grid', gap: isMobile ? '1.1rem' : '1.35rem' }}>
          <div style={sectionLabelStyle}>Cài đặt tài khoản</div>

          <div style={cardWrapperStyle}>
            <div
              onClick={() => setShowChangePwd(true)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.85rem',
                padding: isMobile ? '1.15rem 1.4rem' : '1.25rem 1.75rem', background: 'transparent', cursor: 'pointer', transition: 'background 0.2s ease, transform 0.2s',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,247,237,0.85)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: isMobile ? '1.15rem' : '1.1rem', color: '#111827' }}>Đổi mật khẩu</span>
              <span style={{ color: '#9ca3af', fontSize: isMobile ? '1.35rem' : '1.4rem' }}>›</span>
            </div>
            <div
              onClick={handleDeleteAccount}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.85rem',
                padding: isMobile ? '1.15rem 1.4rem' : '1.25rem 1.75rem', background: 'transparent', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1, transition: 'background 0.2s ease, transform 0.2s',
                fontWeight: 700
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(254,226,226,0.9)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: isMobile ? '1.15rem' : '1.1rem', color: '#ef4444' }}>{deleting ? 'Đang xoá...' : 'Xoá tài khoản'}</span>
              <span style={{ color: '#f87171', fontSize: isMobile ? '1.35rem' : '1.4rem' }}>›</span>
            </div>
          </div>
        </div>

        {/* Other Section */}
        <div style={{ display: 'grid', gap: isMobile ? '1.1rem' : '1.35rem' }}>
          <div style={sectionLabelStyle}>Khác</div>

          <div style={cardWrapperStyle}>
            <div style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.95rem', padding: isMobile ? '1.15rem 1.4rem' : '1.3rem 1.75rem',
              background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s ease, transform 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(249,250,251,0.95)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: isMobile ? '2.6rem' : '2.9rem',
                height: isMobile ? '2.6rem' : '2.9rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, rgba(254,243,199,0.95) 0%, rgba(253,230,138,0.9) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 28px rgba(253,230,138,0.4)'
              }}>
                <HelpCircle size={isMobile ? 22 : 24} color="#d97706" strokeWidth={2.1} />
              </div>
              <span style={{ fontSize: isMobile ? '1.15rem' : '1.12rem', color: '#1f2937', fontWeight: 600 }}>Trợ giúp & Hỗ trợ</span>
            </div>

            <div style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.95rem', padding: isMobile ? '1.15rem 1.4rem' : '1.3rem 1.75rem',
              background: 'transparent', border: 'none', borderTop: '0.0625rem solid rgba(226,232,240,0.65)', cursor: 'pointer', transition: 'background 0.2s ease, transform 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(243,244,255,0.95)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: isMobile ? '2.6rem' : '2.9rem',
                height: isMobile ? '2.6rem' : '2.9rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, rgba(237,233,254,0.95) 0%, rgba(221,214,254,0.9) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 28px rgba(196,181,253,0.4)'
              }}>
                <Shield size={isMobile ? 22 : 24} color="#7c3aed" strokeWidth={2.1} />
              </div>
              <span style={{ fontSize: isMobile ? '1.15rem' : '1.12rem', color: '#1f2937', fontWeight: 600 }}>Chính sách & Điều khoản</span>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal isOpen={showChangePwd} onClose={() => setShowChangePwd(false)} userId={userId} isMobile={isMobile} />
    </div>
  );
}

// Inline SettingItem (moved from old SettingsDialog)
function SettingItem({ icon, label, checked, onChange, isMobile, hasBorder }) {
  const IconComponent = icon;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '1.1rem 1.4rem' : '1.3rem 1.75rem',
      borderTop: hasBorder ? '0.0625rem solid rgba(226,232,240,0.65)' : 'none',
      background: checked ? 'rgba(255,247,237,0.72)' : 'transparent',
      transition: 'background 0.25s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: isMobile ? '2.7rem' : '3rem',
          height: isMobile ? '2.7rem' : '3rem',
          borderRadius: '0.8rem',
          background: checked ? 'linear-gradient(135deg, rgba(255,237,213,0.95) 0%, rgba(254,215,170,0.9) 100%)' : 'linear-gradient(135deg, rgba(241,245,249,0.95) 0%, rgba(226,232,240,0.9) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: checked ? '0 12px 26px rgba(251,191,36,0.35)' : '0 12px 26px rgba(148,163,184,0.2)',
          transition: 'all 0.3s ease'
        }}>
          <IconComponent size={isMobile ? 22 : 24} color={checked ? '#f97316' : '#6b7280'} strokeWidth={2.1} />
        </div>
        <span style={{
          fontSize: isMobile ? '1.15rem' : '1.12rem',
          color: '#1f2937',
          fontWeight: 600,
          letterSpacing: '0.01em'
        }}>
          {label}
        </span>
      </div>

      <label style={{
        position: 'relative',
        display: 'inline-block',
        width: isMobile ? '3.15rem' : '3.4rem',
        height: isMobile ? '1.65rem' : '1.8rem',
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
          background: checked ? 'linear-gradient(135deg, #ee4d2d 0%, #ff7a45 100%)' : '#e5e7eb',
          borderRadius: '2rem',
          transition: 'all 0.3s ease',
          boxShadow: checked ? '0 10px 25px rgba(238,77,45,0.35)' : 'none'
        }}>
          <div style={{
            position: 'absolute',
            top: '0.125rem',
            left: checked ? (isMobile ? '1.55rem' : '1.75rem') : '0.125rem',
            width: isMobile ? '1.35rem' : '1.45rem',
            height: isMobile ? '1.35rem' : '1.45rem',
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
function ChangePasswordModal({ isOpen, onClose, userId, isMobile }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const rules = [
    { id: 'len', label: 'Tối thiểu 6 ký tự', test: (v) => v.length >= 6 },
    { id: 'num', label: 'Có ít nhất 1 chữ số', test: (v) => /\d/.test(v) },
    { id: 'char', label: 'Có ít nhất 1 chữ cái', test: (v) => /[A-Za-z]/.test(v) },
  ];

  const allValid = oldPassword && newPassword && confirmPassword && rules.every(r => r.test(newPassword)) && newPassword === confirmPassword;

  const handleSubmit = async () => {
    setMessage('');
    if (!allValid) {
      setMessage('Vui lòng kiểm tra lại các điều kiện mật khẩu.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await axios.post(`${API_BASE_URL}/auth/change-password`, { userId, oldPassword, newPassword }, { withCredentials: true });
      if (res.data?.success) {
        setMessage('Đổi mật khẩu thành công');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(onClose, 900);
      } else {
        setMessage(res.data?.message || 'Không thể đổi mật khẩu');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Lỗi đổi mật khẩu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'relative', background: '#fff', borderRadius: isMobile ? '1rem 1rem 0 0' : '1rem',
        width: isMobile ? '100%' : '520px', maxHeight: '90vh', height: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
        animation: 'sheetUp 0.28s ease-out'
      }}>
        <div style={{ padding: isMobile ? '1.25rem' : '1.5rem', display: 'grid', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 700 }}>Đổi mật khẩu</h3>
            <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          <input type="password" placeholder="Mật khẩu hiện tại" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: isMobile ? '1rem' : '1rem' }} />
          <input type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: isMobile ? '1rem' : '1rem' }} />
          <input type="password" placeholder="Xác nhận mật khẩu mới" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: isMobile ? '1rem' : '1rem' }} />

          <div style={{ display: 'grid', gap: '0.35rem', marginTop: '0.25rem' }}>
            {rules.map(r => {
              const ok = r.test(newPassword);
              return (
                <div key={r.id} style={{ fontSize: '0.95rem', color: ok ? '#10b981' : '#9ca3af', fontWeight: 600 }}>
                  {ok ? '✓' : '•'} {r.label}
                </div>
              );
            })}
            {newPassword && confirmPassword && (
              <div style={{ fontSize: '0.95rem', color: newPassword === confirmPassword ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                {newPassword === confirmPassword ? 'Xác nhận khớp' : 'Xác nhận không khớp'}
              </div>
            )}
          </div>

          {message && (
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: message.includes('thành công') ? '#10b981' : '#ef4444' }}>{message}</div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', border: 'none', background: '#f3f4f6', color: '#374151', fontWeight: 700, cursor: 'pointer' }}>Huỷ</button>
            <button onClick={handleSubmit} disabled={!allValid || submitting} style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', border: 'none', background: (!allValid || submitting) ? '#fecaca' : 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)', color: '#fff', fontWeight: 800, cursor: (!allValid || submitting) ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sheetUp {
          from { opacity: 0; transform: translateY(2.5rem); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
