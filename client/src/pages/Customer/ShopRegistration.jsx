import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, Phone, Mail, CreditCard, FileText, Camera, MapPin, Clock, Tag, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import ShopTermsModal from '../../components/shared/ShopTermsModal';
import FileUploadBox from '../../components/shared/FileUploadBox';
import { getCurrentUser, getMyShop } from '../../api/userApi';
import React from 'react';

export default function ShopRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [autoFillLoading, setAutoFillLoading] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null); // null | 'already_shop' | 'shipper_restriction' | 'allowed'
  const [formData, setFormData] = useState({
    shopName: '',
    shopDescription: '',
    shopAddress: '',
    phone: '',
    email: '',
    businessLicenseNumber: '',
    bankAccountNumber: '',
    bankAccountName: '',
    bankName: '',
    openingTime: '08:00',
    closingTime: '22:00',
    foodCategories: []
  });

  const [files, setFiles] = useState({
    businessLicense: null,
    shopLogo: null,
    shopCover: null
  });

  const [previews, setPreviews] = useState({
    businessLicense: null,
    shopLogo: null,
    shopCover: null
  });

  const foodCategoryOptions = [
    'Món Việt',
    'Món Hàn',
    'Món Nhật',
    'Món Thái',
    'Món Trung',
    'Đồ ăn nhanh',
    'Cafe & Trà sữa',
    'Tráng miệng',
    'Bánh kem',
    'Lẩu',
    'Nướng',
    'Chay',
    'Hải sản',
    'Khác'
  ];

  // Auto-fill user information and check registration eligibility on component mount
  React.useEffect(() => {
    const autoFillUserInfo = async () => {
      try {
        setAutoFillLoading(true);
        console.log('🔄 [ShopRegistration] Bắt đầu auto-fill và kiểm tra role...');
        
        const userData = await getCurrentUser();
        console.log('📥 [ShopRegistration] User API Response:', userData);
        
        if (userData && typeof userData === 'object' && userData.user) {
          console.log('✅ [ShopRegistration] User data hợp lệ');
          const user = userData.user;
          
          // 🔍 Kiểm tra role và profile để xác định trạng thái đăng ký
          const hasShopProfile = user.shop_profile && typeof user.shop_profile === 'object';
          const hasShipperProfile = user.shipper_profile && typeof user.shipper_profile === 'object';
          const isShopRole = user.role === 'shop';
          const isShipperRole = user.role === 'shipper';

          console.log('🔍 [ShopRegistration] Role Check:', {
            role: user.role,
            hasShopProfile,
            hasShipperProfile,
            isShopRole,
            isShipperRole
          });

          // Xác định trạng thái đăng ký
          if (isShopRole || hasShopProfile) {
            console.log('⚠️ [ShopRegistration] User đã là shop owner');
            setRegistrationStatus('already_shop');
          } else if (isShipperRole) {
            console.log('⚠️ [ShopRegistration] Shipper không thể đăng ký làm shop');
            setRegistrationStatus('shipper_restriction');
          } else {
            console.log('✅ [ShopRegistration] User được phép đăng ký làm shop');
            setRegistrationStatus('allowed');
          }
          
          // Auto-fill thông tin cơ bản
          setFormData(prev => ({
            ...prev,
            email: prev.email || (user.email ? String(user.email).trim() : ''),
            phone: prev.phone || (user.phone ? String(user.phone).trim() : ''),
            bankAccountName: prev.bankAccountName || (user.full_name ? String(user.full_name).trim() : ''),
            shopAddress: prev.shopAddress || (
              user.addresses && Array.isArray(user.addresses) && user.addresses.length > 0
                ? (() => {
                    try {
                      const addr = user.addresses[0];
                      if (addr && addr.address_line) {
                        const parts = [
                          addr.address_line.detail,
                          addr.address_line.ward,
                          addr.address_line.district,
                          addr.address_line.city
                        ].filter(p => p && String(p).trim());
                        return parts.join(', ');
                      }
                      return '';
                    } catch (e) {
                      console.warn('⚠️ [ShopRegistration] Error parsing address:', e);
                      return '';
                    }
                  })()
                : ''
            ),
          }));

          // Nếu có shop_profile, auto-fill các trường shop
          if (hasShopProfile) {
            const shopData = user.shop_profile;
            console.log('📦 [ShopRegistration] Auto-fill từ shop_profile:', shopData);
            
            setFormData(prev => ({
              ...prev,
              shopName: shopData.shop_name ? String(shopData.shop_name).trim() : prev.shopName,
              shopDescription: shopData.description ? String(shopData.description).trim() : prev.shopDescription,
              openingTime: shopData.open_hours ? String(shopData.open_hours).trim() : prev.openingTime,
              closingTime: shopData.closed_hours ? String(shopData.closed_hours).trim() : prev.closingTime,
            }));
          }
        } else {
          console.warn('⚠️ [ShopRegistration] User data không hợp lệ:', userData);
          setRegistrationStatus('allowed'); // Default cho phép nếu không lấy được thông tin
        }
      } catch (error) {
        console.error('❌ [ShopRegistration] Error auto-filling user info:', error);
        setRegistrationStatus('allowed'); // Default cho phép nếu có lỗi
      } finally {
        setAutoFillLoading(false);
      }
    };

    autoFillUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      foodCategories: prev.foodCategories.includes(category)
        ? prev.foodCategories.filter(c => c !== category)
        : [...prev.foodCategories, category]
    }));
  };

  const handleSafeNavigate = (path) => {
    try {
      if (!path || typeof path !== 'string' || path.trim() === '') {
        console.error('❌ [ShopRegistration] Invalid path:', path);
        return;
      }
      console.log('✅ [ShopRegistration] Navigating to:', path);
      navigate(path);
    } catch (error) {
      console.error('❌ [ShopRegistration] Navigation error:', error);
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fieldName]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.shopName || !formData.phone || !formData.email || !formData.shopAddress) {
      alert('⚠️ Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!agreedToTerms) {
      alert('⚠️ Vui lòng đồng ý với điều khoản dịch vụ để tiếp tục');
      return;
    }

    if (formData.foodCategories.length === 0) {
      alert('⚠️ Vui lòng chọn ít nhất một danh mục món ăn');
      return;
    }

    if (!files.businessLicense || !files.shopLogo || !files.shopCover) {
      alert('⚠️ Vui lòng tải lên đầy đủ các ảnh yêu cầu');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'foodCategories') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });
      Object.keys(files).forEach(key => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });

      const response = await axios.post('http://localhost:5000/api/shop/register', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('✅ Đăng ký thành công! Chúng tôi sẽ xem xét và phản hồi trong vòng 24-48 giờ.');
      handleSafeNavigate('/customer/profile');
    } catch (error) {
      alert('❌ Đăng ký thất bại: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Render "Already Shop Owner" message
  const renderAlreadyShopMessage = () => (
    <div style={{
      maxWidth: '48rem',
      margin: '2rem auto',
      padding: '1.5rem 1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{
          width: '5rem',
          height: '5rem',
          borderRadius: '50%',
          background: '#d1fae5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Store size={40} color="#10b981" />
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '1rem'
        }}>
          Bạn đã là chủ Shop rồi! 🎉
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Tài khoản của bạn đã được đăng ký làm chủ Shop. Hãy chuyển đến trang quản lý Shop để bắt đầu kinh doanh.
        </p>
        <button
          onClick={() => handleSafeNavigate('/shop/dashboard')}
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 0.25rem 1rem rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-0.125rem)';
            e.currentTarget.style.boxShadow = '0 0.375rem 1.25rem rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0.25rem 1rem rgba(16, 185, 129, 0.3)';
          }}
        >
          Đi đến Dashboard Shop
        </button>
      </div>
    </div>
  );

  // Render "Shipper Restriction" message
  const renderShipperRestriction = () => (
    <div style={{
      maxWidth: '48rem',
      margin: '2rem auto',
      padding: '1.5rem 1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{
          width: '5rem',
          height: '5rem',
          borderRadius: '50%',
          background: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Store size={40} color="#ef4444" />
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '1rem'
        }}>
          Shipper không thể đăng ký làm Shop
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Tài khoản Shipper không được phép đăng ký trở thành chủ Shop. Vui lòng sử dụng tài khoản User để đăng ký.
        </p>
        <button
          onClick={() => handleSafeNavigate('/customer/profile')}
          style={{
            padding: '1rem 2rem',
            background: '#fff',
            color: '#ef4444',
            border: '0.125rem solid #ef4444',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ef4444';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#ef4444';
          }}
        >
          Quay lại Trang Cá Nhân
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      background: '#f5f5f5',
      paddingBottom: '2rem'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        padding: '1.5rem 1rem',
        boxShadow: '0 0.25rem 1rem rgba(16, 185, 129, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '48rem',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <button
            onClick={() => handleSafeNavigate('/customer/profile')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '0.5rem',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} color="#fff" strokeWidth={2.5} />
          </button>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#fff'
            }}>
              Đăng ký trở thành chủ Shop
            </h1>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', marginTop: '0.25rem' }}>
              Điền thông tin để bắt đầu kinh doanh
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Content Based on Registration Status */}
      {autoFillLoading ? (
        <div style={{
          maxWidth: '48rem',
          margin: '2rem auto',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.25rem', color: '#666' }}>⏳ Đang kiểm tra thông tin...</div>
        </div>
      ) : registrationStatus === 'already_shop' ? (
        renderAlreadyShopMessage()
      ) : registrationStatus === 'shipper_restriction' ? (
        renderShipperRestriction()
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} style={{
          maxWidth: '48rem',
          margin: '0 auto',
          padding: '1.5rem 1rem'
        }}>
        {/* Auto-fill Notification */}
        {!autoFillLoading && (
          <div style={{
            background: '#d1fae5',
            border: '0.0625rem solid #10b981',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{ color: '#10b981', marginTop: '0.125rem' }}>ℹ️</div>
            <div>
              <div style={{ fontWeight: '600', color: '#065f46', marginBottom: '0.25rem' }}>
                Thông tin đã được điền tự động
              </div>
              <div style={{ fontSize: '0.875rem', color: '#047857' }}>
                Chúng tôi đã điền các thông tin từ tài khoản của bạn. Vui lòng kiểm tra và điền thêm các thông tin còn thiếu.
              </div>
            </div>
          </div>
        )}

        {/* Shop Information */}
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#333',
            marginTop: 0,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Store size={20} color="#10b981" />
            Thông tin cửa hàng
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Tên cửa hàng <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleInputChange}
              placeholder="Nhập tên cửa hàng"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '0.0625rem solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Mô tả cửa hàng <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <textarea
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleInputChange}
              placeholder="Giới thiệu về cửa hàng của bạn..."
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '0.0625rem solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Địa chỉ cửa hàng <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="text"
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ đầy đủ"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '0.0625rem solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Số điện thoại <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '0.0625rem solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Email <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ email"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '0.0625rem solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Số giấy phép kinh doanh <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="text"
              name="businessLicenseNumber"
              value={formData.businessLicenseNumber}
              onChange={handleInputChange}
              placeholder="Nhập số giấy phép kinh doanh"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '0.0625rem solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#333',
            marginTop: 0,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Clock size={20} color="#10b981" />
            Giờ hoạt động
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            '@media (max-width: 600px)': {
              gridTemplateColumns: '1fr'
            }
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: '500',
                color: '#333'
              }}>
                Giờ mở cửa <span style={{ color: '#ee4d2d' }}>*</span>
              </label>
              <input
                type="time"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '0.0625rem solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: '500',
                color: '#333'
              }}>
                Giờ đóng cửa <span style={{ color: '#ee4d2d' }}>*</span>
              </label>
              <input
                type="time"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '0.0625rem solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          </div>
        </div>

        {/* Food Categories */}
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#333',
            marginTop: 0,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Tag size={20} color="#10b981" />
            Danh mục món ăn
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '0.75rem'
          }}>
            {foodCategoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryToggle(category)}
                style={{
                  padding: '0.75rem 1rem',
                  border: formData.foodCategories.includes(category) 
                    ? '0.125rem solid #10b981' 
                    : '0.0625rem solid #ddd',
                  borderRadius: '0.5rem',
                  background: formData.foodCategories.includes(category) ? '#d1fae5' : '#fff',
                  color: formData.foodCategories.includes(category) ? '#10b981' : '#666',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: formData.foodCategories.includes(category) ? '600' : '400'
                }}
                onMouseEnter={(e) => {
                  if (!formData.foodCategories.includes(category)) {
                    e.currentTarget.style.borderColor = '#10b981';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!formData.foodCategories.includes(category)) {
                    e.currentTarget.style.borderColor = '#ddd';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
          <div style={{ 
            marginTop: '1rem', 
            fontSize: '0.875rem', 
            color: '#666',
            fontStyle: 'italic'
          }}>
            Đã chọn: {formData.foodCategories.length} danh mục
          </div>
        </div>

        {/* Bank Information */}
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#333',
            marginTop: 0,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CreditCard size={20} color="#10b981" />
            Thông tin ngân hàng
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Tên ngân hàng <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              placeholder="VD: Vietcombank, Techcombank..."
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '0.0625rem solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Số tài khoản <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="text"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleInputChange}
              placeholder="Nhập số tài khoản"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '0.0625rem solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Tên chủ tài khoản <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="text"
              name="bankAccountName"
              value={formData.bankAccountName}
              onChange={handleInputChange}
              placeholder="Nhập tên chủ tài khoản"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '0.0625rem solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        </div>

        {/* Document Uploads */}
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#333',
            marginTop: 0,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Camera size={20} color="#10b981" />
            Hình ảnh cửa hàng
          </h2>

          <FileUploadBox 
            label="Logo cửa hàng" 
            fieldName="shopLogo" 
            icon={Store} 
            aspectRatio="square"
            preview={previews.shopLogo}
            onFileChange={(e) => handleFileChange(e, 'shopLogo')}
          />
          <FileUploadBox 
            label="Ảnh bìa cửa hàng" 
            fieldName="shopCover" 
            icon={Camera} 
            aspectRatio="wide"
            preview={previews.shopCover}
            onFileChange={(e) => handleFileChange(e, 'shopCover')}
          />
          <FileUploadBox 
            label="Ảnh giấy phép kinh doanh" 
            fieldName="businessLicense" 
            icon={FileText} 
            aspectRatio="square"
            preview={previews.businessLicense}
            onFileChange={(e) => handleFileChange(e, 'businessLicense')}
          />
        </div>

        {/* Terms Agreement */}
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#333',
            marginTop: 0,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={20} color="#10b981" />
            Điều khoản dịch vụ
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#666', marginBottom: '1.5rem' }}>
            Vui lòng đọc và đồng ý với các điều khoản dịch vụ trước khi đăng ký.
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              id="termsAgreement"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.25rem', cursor: 'pointer' }}
            />
            <label htmlFor="termsAgreement" style={{ fontSize: '0.9375rem', color: '#333', cursor: 'pointer' }}>
              Tôi đã đọc và đồng ý với&nbsp;
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#10b981',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  padding: 0
                }}
              >
                Điều khoản dịch vụ Shop
              </button>
            </label>
          </div>
          {!agreedToTerms && (
            <p style={{ fontSize: '0.875rem', color: '#ee4d2d', marginTop: '0.75rem' }}>
              ⚠️ Vui lòng đồng ý với điều khoản trước khi đăng ký
            </p>
          )}
        </div>

        {/* Button Group */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1rem', 
          marginBottom: '1rem',
          '@media (max-width: 600px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => handleSafeNavigate('/customer/profile')}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#fff',
              color: '#10b981',
              border: '0.125rem solid #10b981',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0.125rem 1rem rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s',
              opacity: loading ? 0.6 : 1,
              minHeight: '44px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#10b981';
              }
            }}
          >
            ❌ Hủy
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            style={{
              padding: '1rem',
              background: loading || !agreedToTerms ? '#ccc' : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading || !agreedToTerms ? 'not-allowed' : 'pointer',
              boxShadow: loading || !agreedToTerms ? 'none' : '0 0.25rem 1rem rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s',
              minHeight: '44px'
            }}
            onMouseEnter={(e) => {
              if (!loading && agreedToTerms) {
                e.currentTarget.style.transform = 'translateY(-0.125rem)';
                e.currentTarget.style.boxShadow = '0 0.375rem 1.25rem rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && agreedToTerms) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0.25rem 1rem rgba(16, 185, 129, 0.3)';
              }
            }}
          >
            {loading ? '⏳ Đang gửi...' : '🚀 Đăng ký'}
          </button>
        </div>
      </form>
      )}

      {/* Terms Modal */}
      <ShopTermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}

