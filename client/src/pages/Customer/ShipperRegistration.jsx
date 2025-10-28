import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Truck, User, Phone, Mail, CreditCard, FileText, Camera, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import ShipperTermsModal from '../../components/shared/ShipperTermsModal';

export default function ShipperRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    vehicleType: 'motorcycle',
    vehiclePlateNumber: '',
    idCardNumber: '',
    driverLicenseNumber: '',
    bankAccountNumber: '',
    bankAccountName: '',
    bankName: ''
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    idCardFront: null,
    idCardBack: null,
    vehicleRegistration: null,
    drivingLicense: null,
    proofImage: null
  });

  const [previews, setPreviews] = useState({
    profilePhoto: null,
    idCardFront: null,
    idCardBack: null,
    vehicleRegistration: null,
    drivingLicense: null,
    proofImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.fullName || !formData.phone || !formData.email) {
      alert('⚠️ Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!agreedToTerms) {
      alert('⚠️ Vui lòng đồng ý với điều khoản dịch vụ để tiếp tục');
      return;
    }

    if (!files.profilePhoto || !files.idCardFront || !files.idCardBack || !files.vehicleRegistration) {
      alert('⚠️ Vui lòng tải lên đầy đủ các ảnh yêu cầu');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      Object.keys(files).forEach(key => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });

      const response = await axios.post('http://localhost:5000/api/shipper/register', submitData, {
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

  const FileUploadBox = ({ label, fieldName, icon: Icon, required = true }) => (
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
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ee4d2d'}
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
              maxHeight: '12rem',
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
        background: 'linear-gradient(135deg, #f97316 0%, #ff9447 100%)',
        padding: '1.5rem 1rem',
        boxShadow: '0 0.25rem 1rem rgba(249, 115, 22, 0.2)',
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
              Đăng ký trở thành Shipper
            </h1>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', marginTop: '0.25rem' }}>
              Điền thông tin để bắt đầu
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
        {/* Personal Information */}
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
            <User size={20} color="#f97316" />
            Thông tin cá nhân
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Họ và tên <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên đầy đủ"
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
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
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
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
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
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
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
              Số CMND/CCCD <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="text"
              name="idCardNumber"
              value={formData.idCardNumber}
              onChange={handleInputChange}
              placeholder="Nhập số CMND/CCCD"
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
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        </div>

        {/* Vehicle Information */}
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
            <Truck size={20} color="#f97316" />
            Thông tin phương tiện
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Loại phương tiện <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '0.0625rem solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
                background: '#fff'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            >
              <option value="motorcycle">Xe máy</option>
              <option value="bicycle">Xe đạp</option>
              <option value="car">Ô tô</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Biển số xe <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="text"
              name="vehiclePlateNumber"
              value={formData.vehiclePlateNumber}
              onChange={handleInputChange}
              placeholder="Nhập biển số xe"
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
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
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
            <CreditCard size={20} color="#f97316" />
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
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
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
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
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
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        </div>

        {/* Driver License Information */}
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
            <FileText size={20} color="#f97316" />
            Thông tin giấy phép lái xe
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Số giấy phép lái xe <span style={{ color: '#ee4d2d' }}>*</span>
            </label>
            <input
              type="text"
              name="driverLicenseNumber"
              value={formData.driverLicenseNumber}
              onChange={handleInputChange}
              placeholder="Nhập số giấy phép lái xe"
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
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
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
            <Camera size={20} color="#f97316" />
            Hình ảnh xác thực
          </h2>

          <FileUploadBox label="Ảnh đại diện" fieldName="profilePhoto" icon={User} />
          <FileUploadBox label="Ảnh CMND/CCCD (Mặt trước)" fieldName="idCardFront" icon={FileText} />
          <FileUploadBox label="Ảnh CMND/CCCD (Mặt sau)" fieldName="idCardBack" icon={FileText} />
          <FileUploadBox label="Ảnh đăng ký xe" fieldName="vehicleRegistration" icon={FileText} />
          <FileUploadBox label="Ảnh giấy phép lái xe" fieldName="drivingLicense" icon={FileText} />
          <FileUploadBox label="Ảnh minh chứng khác" fieldName="proofImage" icon={FileText} />
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
            <CheckCircle2 size={20} color="#f97316" />
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
                  color: '#f97316',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  padding: 0
                }}
              >
                Điều khoản dịch vụ Shipper
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate('/customer/profile')}
            disabled={loading}
            style={{
              padding: '1rem',
              background: '#fff',
              color: '#f97316',
              border: '0.125rem solid #f97316',
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
                e.currentTarget.style.background = '#f97316';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#f97316';
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
              background: loading || !agreedToTerms ? '#ccc' : 'linear-gradient(135deg, #f97316 0%, #ff9447 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading || !agreedToTerms ? 'not-allowed' : 'pointer',
              boxShadow: loading || !agreedToTerms ? 'none' : '0 0.25rem 1rem rgba(249, 115, 22, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading && agreedToTerms) {
                e.currentTarget.style.transform = 'translateY(-0.125rem)';
                e.currentTarget.style.boxShadow = '0 0.375rem 1.25rem rgba(249, 115, 22, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && agreedToTerms) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0.25rem 1rem rgba(249, 115, 22, 0.3)';
              }
            }}
          >
            {loading ? '⏳ Đang gửi...' : '🚀 Đăng ký'}
          </button>
        </div>
      </form>

      {/* Terms Modal */}
      <ShipperTermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}

