import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, Phone, Mail, CreditCard, FileText, Camera, MapPin, Clock, Tag } from 'lucide-react';
import axios from 'axios';

export default function ShopRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      navigate('/customer/profile');
    } catch (error) {
      alert('❌ Đăng ký thất bại: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const FileUploadBox = ({ label, fieldName, icon: Icon, required = true, aspectRatio = 'square' }) => (
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
      <div style={{
        border: '0.125rem dashed #ddd',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        background: previews[fieldName] ? '#f9f9f9' : '#fff'
      }}
      onClick={() => document.getElementById(fieldName).click()}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
      >
        <input
          id={fieldName}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, fieldName)}
          style={{ display: 'none' }}
        />
        {previews[fieldName] ? (
          <div>
            <img src={previews[fieldName]} alt="Preview" style={{
              maxWidth: '100%',
              maxHeight: aspectRatio === 'wide' ? '10rem' : '12rem',
              borderRadius: '0.5rem',
              marginBottom: '0.5rem'
            }} />
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
          margin: '0 auto'
        }}>
          <button
            onClick={() => navigate('/customer/profile')}
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

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        maxWidth: '48rem',
        margin: '0 auto',
        padding: '1.5rem 1rem'
      }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
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

          <FileUploadBox label="Logo cửa hàng" fieldName="shopLogo" icon={Store} aspectRatio="square" />
          <FileUploadBox label="Ảnh bìa cửa hàng" fieldName="shopCover" icon={Camera} aspectRatio="wide" />
          <FileUploadBox label="Ảnh giấy phép kinh doanh" fieldName="businessLicense" icon={FileText} aspectRatio="square" />
        </div>

        {/* Button Group */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate('/customer/profile')}
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
              opacity: loading ? 0.6 : 1
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
            disabled={loading}
            style={{
              padding: '1rem',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0.25rem 1rem rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-0.125rem)';
                e.currentTarget.style.boxShadow = '0 0.375rem 1.25rem rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0.25rem 1rem rgba(16, 185, 129, 0.3)';
              }
            }}
          >
            {loading ? '⏳ Đang gửi...' : '🚀 Đăng ký'}
          </button>
        </div>
      </form>
    </div>
  );
}

