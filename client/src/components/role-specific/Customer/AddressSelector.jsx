import { useState, useEffect } from 'react';
import { MapPin, Plus, ChevronRight, Check, X } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PROVINCES_API = `${API_BASE_URL}/provinces/provinces`;
const WARDS_API = `${API_BASE_URL}/provinces/wards`;

/**
 * Component cho phép người dùng:
 * - Chọn địa chỉ đã lưu
 * - Thêm địa chỉ mới (tỉnh/xã - không có quận/huyện)
 * - Sửa và xóa địa chỉ
 */
export default function AddressSelector({ isOpen, onClose, onSelectAddress, currentAddress, showInDialog = false }) {
  const [step, setStep] = useState('list'); // list | add | edit
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Form data for new address
  const [formData, setFormData] = useState({
    detail: '',
    province: '',
    provinceCode: '',
    ward: '',
    wardCode: '',
    note: '',
    address_type: 'Nhà',
  });
  
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchUserAddresses();
      fetchProvinces();
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'add' && provinces.length === 0) {
      console.log('🔄 Fetching provinces for add step...');
      fetchProvinces();
    }
  }, [step]);

  // Fetch danh sách địa chỉ đã lưu
  const fetchUserAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/addresses/user-addresses`, { withCredentials: true });
      if (res.data?.success) {
        setAddresses(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách tỉnh
  const fetchProvinces = async () => {
    try {
      console.log('🌍 Fetching provinces from:', PROVINCES_API);
      const res = await axios.get(PROVINCES_API);
      console.log('📥 Provinces API response:', res.data);
      // API mới trả về array trực tiếp, không có .results
      if (Array.isArray(res.data)) {
        setProvinces(res.data);
        console.log('✅ Loaded provinces:', res.data.length);
      }
    } catch (err) {
      console.error('❌ Error fetching provinces:', err);
    }
  };

  // Fetch danh sách xã/phường khi chọn tỉnh
  const fetchWards = async (provinceCode) => {
    try {
      console.log('🏘️ Fetching wards for province:', provinceCode);
      const res = await axios.get(`${WARDS_API}/${provinceCode}`);
      console.log('📥 Wards API response:', res.data);
      // API mới trả về array trực tiếp
      if (Array.isArray(res.data)) {
        setWards(res.data);
        console.log('✅ Loaded wards:', res.data.length);
      }
    } catch (err) {
      console.error('❌ Error fetching wards:', err);
    }
  };

  // Thêm địa chỉ mới
  const handleAddAddress = async () => {
    if (!formData.detail || !formData.province || !formData.ward) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    try {
      setLoading(true);
      
      // 🗺️ Gọi Map4D Geocode API để lấy tọa độ
      const fullAddress = `${formData.detail}, ${formData.ward}, ${formData.province}`;
      console.log('🌍 Geocoding address:', fullAddress);
      
      let lat_lon = null;
      try {
        const geocodeRes = await axios.get(`${API_BASE_URL}/map4d/geocode`, {
          params: { address: fullAddress }
        });
        
        console.log('📍 Geocode response:', geocodeRes.data);
        
        if (geocodeRes.data?.result && geocodeRes.data.result.length > 0) {
          const location = geocodeRes.data.result[0].location;
          if (location && location.lat && location.lng) {
            lat_lon = {
              lat: location.lat,
              lon: location.lng
            };
            console.log('✅ Got coordinates:', lat_lon);
          }
        }
      } catch (geocodeErr) {
        console.warn('⚠️ Geocode error, continuing without coordinates:', geocodeErr);
        // Tiếp tục lưu địa chỉ ngay cả khi không lấy được tọa độ
      }
      
      const res = await axios.post(
        `${API_BASE_URL}/addresses/user-addresses`,
        {
          address_line: {
            detail: formData.detail,
            ward: formData.ward,
            province: formData.province,
          },
          lat_lon: lat_lon,
          note: formData.note,
          address_type: formData.address_type,
          is_primary: addresses.length === 0, // Nếu chưa có địa chỉ nào thì set làm mặc định
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        await fetchUserAddresses();
        setStep('list');
        // Reset form
        setFormData({
          detail: '',
          province: '',
          provinceCode: '',
          ward: '',
          wardCode: '',
          note: '',
          address_type: 'Nhà',
        });
      }
    } catch (err) {
      console.error('Error adding address:', err);
      alert('Không thể thêm địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  // Chọn địa chỉ
  const handleSelectAddress = async (address) => {
    // Nếu đang trong dialog (UserProfile), không set default và close
    if (showInDialog) {
      onSelectAddress && onSelectAddress(address);
      return;
    }
    
    try {
      // Set làm địa chỉ mặc định
      await axios.put(
        `${API_BASE_URL}/addresses/user-addresses/${address.address_id}/set-default`,
        {},
        { withCredentials: true }
      );
      
      onSelectAddress(address);
      onClose();
    } catch (err) {
      console.error('Error setting default address:', err);
      // Vẫn gọi callback ngay cả khi API fail
      onSelectAddress(address);
      onClose();
    }
  };

  // Xóa địa chỉ
  const handleDeleteAddress = async (addressId, e) => {
    e.stopPropagation(); // Prevent triggering select
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    
    try {
      setLoading(true);
      console.log('Deleting address ID:', addressId);
      const res = await axios.delete(
        `${API_BASE_URL}/addresses/user-addresses/${addressId}`,
        { withCredentials: true }
      );
      
      if (res.data?.success) {
        console.log('Address deleted successfully');
        await fetchUserAddresses();
      } else {
        alert('Xóa địa chỉ thất bại');
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      const errorMsg = err.response?.data?.message || 'Không thể xóa địa chỉ';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Sửa địa chỉ - populate form
  const handleEditAddress = (address, e) => {
    e.stopPropagation(); // Prevent triggering select
    setEditingAddress(address);
    const addrLine = address.address_line || {};
    
    // Find province and ward codes
    const province = provinces.find(p => p.name === addrLine.province);
    
    setFormData({
      detail: addrLine.detail || '',
      province: addrLine.province || '',
      provinceCode: province?.code || '',
      ward: addrLine.ward || '',
      wardCode: '', // Will be set after fetching wards
      note: address.note || '',
      address_type: address.address_type || 'Nhà',
    });
    
    // Fetch wards for selected province
    if (province?.code) {
      fetchWards(province.code);
    }
    
    setStep('edit');
  };

  // Cập nhật địa chỉ
  const handleUpdateAddress = async () => {
    if (!formData.detail || !formData.province || !formData.ward) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    if (!editingAddress || !editingAddress.address_id) {
      alert('Lỗi: Không tìm thấy địa chỉ cần cập nhật');
      console.error('editingAddress is null or missing address_id:', editingAddress);
      return;
    }

    try {
      setLoading(true);
      
      // 🗺️ Gọi Map4D Geocode API để lấy tọa độ
      const fullAddress = `${formData.detail}, ${formData.ward}, ${formData.province}`;
      console.log('🌍 Geocoding address:', fullAddress);
      
      let lat_lon = null;
      try {
        const geocodeRes = await axios.get(`${API_BASE_URL}/map4d/geocode`, {
          params: { address: fullAddress }
        });
        
        console.log('📍 Geocode response:', geocodeRes.data);
        
        if (geocodeRes.data?.result && geocodeRes.data.result.length > 0) {
          const location = geocodeRes.data.result[0].location;
          if (location && location.lat && location.lng) {
            lat_lon = {
              lat: location.lat,
              lon: location.lng
            };
            console.log('✅ Got coordinates:', lat_lon);
          }
        }
      } catch (geocodeErr) {
        console.warn('⚠️ Geocode error, continuing without coordinates:', geocodeErr);
        // Tiếp tục cập nhật địa chỉ ngay cả khi không lấy được tọa độ
      }
      
      console.log('Updating address ID:', editingAddress.address_id);
      const res = await axios.put(
        `${API_BASE_URL}/addresses/user-addresses/${editingAddress.address_id}`,
        {
          address_line: {
            detail: formData.detail,
            ward: formData.ward,
            province: formData.province,
          },
          lat_lon: lat_lon,
          note: formData.note,
          address_type: formData.address_type,
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        console.log('Address updated successfully');
        await fetchUserAddresses();
        setStep('list');
        setEditingAddress(null);
        // Reset form
        setFormData({
          detail: '',
          province: '',
          provinceCode: '',
          ward: '',
          wardCode: '',
          note: '',
          address_type: 'Nhà',
        });
      } else {
        alert('Cập nhật địa chỉ thất bại');
      }
    } catch (err) {
      console.error('Error updating address:', err);
      const errorMsg = err.response?.data?.message || 'Không thể cập nhật địa chỉ';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const containerStyle = showInDialog ? {
    position: 'relative',
    width: '100%',
    height: '100%',
  } : {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  };

  const contentStyle = showInDialog ? {
    position: 'relative',
    background: 'white',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  } : {
    position: 'relative',
    background: 'white',
    borderRadius: '1.2rem 1.2rem 0 0',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '85vh',
    overflow: 'hidden',
    animation: 'slideUp 0.3s ease-out',
  };

  return (
    <div style={containerStyle}>
      {/* Backdrop - chỉ hiển thị khi không phải trong dialog */}
      {!showInDialog && (
        <div
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Content */}
      <div style={contentStyle}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #F0F0F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: '#1A1A1A' }}>
            {step === 'list' ? 'Địa chỉ của tôi' : step === 'edit' ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h3>
          <button
            onClick={showInDialog ? () => {} : onClose}
            style={{
              background: '#F5F5F5',
              border: 'none',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              display: showInDialog ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#E0E0E0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#F5F5F5'}
          >
            <X size={20} color="#666" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: '1.5rem',
          maxHeight: 'calc(85vh - 80px)',
          overflowY: 'auto',
        }}>
          {step === 'list' && (
            <>
              {/* Quick actions */}
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => setStep('add')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.2rem',
                    background: '#FFF5F0',
                    border: '2px dashed #FE5621',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FFE5DB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFF5F0';
                  }}
                >
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    background: '#FE5621',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Plus size={24} color="white" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: '1.3rem', fontWeight: 600, color: '#FE5621' }}>
                    Thêm địa chỉ mới
                  </span>
                </button>
              </div>

              {/* Saved addresses */}
              {addresses.length > 0 && (
                <>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '1rem' }}>
                    Địa chỉ đã lưu
                  </h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {addresses.map((addr) => {
                      const addrLine = addr.address_line || {};
                      const isSelected = currentAddress?.address_id === addr.address_id;
                      
                      return (
                        <div
                          key={addr.address_id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.8rem',
                            padding: '1.2rem',
                            background: isSelected ? '#FFF5F0' : 'white',
                            border: isSelected ? '2px solid #FE5621' : '1px solid #E0E0E0',
                            borderRadius: '1rem',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div
                            onClick={() => !showInDialog && handleSelectAddress(addr)}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '1rem',
                              cursor: showInDialog ? 'default' : 'pointer',
                            }}
                          >
                            <div style={{
                              width: '3rem',
                              height: '3rem',
                              borderRadius: '50%',
                              background: isSelected ? '#FE5621' : '#F5F5F5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              {isSelected ? (
                                <Check size={24} color="white" strokeWidth={2.5} />
                              ) : (
                                <MapPin size={24} color="#999" strokeWidth={2} />
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{
                                  fontSize: '1.3rem',
                                  fontWeight: 700,
                                  color: isSelected ? '#FE5621' : '#1A1A1A',
                                }}>
                                  {addr.address_type || 'Nhà'}
                                </span>
                                {addr.is_primary && (
                                  <span style={{
                                    padding: '0.2rem 0.6rem',
                                    background: '#FE5621',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    borderRadius: '0.4rem',
                                  }}>
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <p style={{
                                margin: 0,
                                fontSize: '1.2rem',
                                color: '#666',
                                lineHeight: 1.4,
                              }}>
                                {addrLine.detail}, {addrLine.ward}, {addrLine.province}
                              </p>
                              {addr.note && (
                                <p style={{
                                  margin: '0.5rem 0 0',
                                  fontSize: '1.1rem',
                                  color: '#999',
                                  fontStyle: 'italic',
                                }}>
                                  Ghi chú: {addr.note}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div style={{
                            display: 'flex',
                            gap: '0.8rem',
                            paddingTop: '0.8rem',
                            borderTop: '1px solid #F0F0F0',
                          }}>
                            <button
                              onClick={(e) => handleEditAddress(addr, e)}
                              style={{
                                flex: 1,
                                padding: '0.8rem',
                                background: 'white',
                                border: '1px solid #E0E0E0',
                                borderRadius: '0.6rem',
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                color: '#666',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F5F5F5';
                                e.currentTarget.style.color = '#1A1A1A';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#666';
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Sửa
                            </button>
                            {!addr.is_primary && (
                              <button
                                onClick={(e) => handleDeleteAddress(addr.address_id, e)}
                                style={{
                                  flex: 1,
                                  padding: '0.8rem',
                                  background: 'white',
                                  border: '1px solid #FFE5E5',
                                  borderRadius: '0.6rem',
                                  fontSize: '1.2rem',
                                  fontWeight: 600,
                                  color: '#FF4D4F',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#FFF1F0';
                                  e.currentTarget.style.borderColor = '#FF4D4F';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'white';
                                  e.currentTarget.style.borderColor = '#FFE5E5';
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {addresses.length === 0 && !loading && (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: '#999',
                }}>
                  <MapPin size={48} color="#E0E0E0" strokeWidth={1.5} />
                  <p style={{ fontSize: '1.3rem', marginTop: '1rem' }}>
                    Chưa có địa chỉ nào được lưu
                  </p>
                </div>
              )}
            </>
          )}

          {(step === 'add' || step === 'edit') && (
            <div style={{ display: 'grid', gap: '1.2rem' }}>
              {/* Tỉnh/Thành phố */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginBottom: '0.5rem',
                }}>
                  Tỉnh/Thành phố <span style={{ color: '#FE5621' }}>*</span>
                </label>
                <select
                  value={formData.provinceCode}
                  onChange={(e) => {
                    const selectedProvince = provinces.find(p => String(p.code) === e.target.value);
                    console.log('🏙️ Province selected:', selectedProvince);
                    setFormData(prev => ({
                      ...prev,
                      provinceCode: e.target.value,
                      province: selectedProvince?.name || '',
                      ward: '',
                      wardCode: '',
                    }));
                    if (e.target.value) {
                      console.log('🔄 Fetching wards for province:', e.target.value);
                      fetchWards(e.target.value);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.2rem',
                    fontSize: '1.2rem',
                    border: '1px solid #E0E0E0',
                    borderRadius: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FE5621'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                >
                  <option value="">-- Chọn tỉnh/thành phố --</option>
                  {console.log('🏗️ Rendering provinces select, count:', provinces.length)}
                  {provinces.map(province => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Xã/Phường/Quận/Huyện */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginBottom: '0.5rem',
                }}>
                  Quận/Huyện/Xã/Phường <span style={{ color: '#FE5621' }}>*</span>
                </label>
                <select
                  value={formData.wardCode}
                  onChange={(e) => {
                    const selectedWard = wards.find(w => String(w.code) === e.target.value);
                    console.log('🏘️ Ward selected:', selectedWard);
                    setFormData(prev => ({
                      ...prev,
                      wardCode: e.target.value,
                      ward: selectedWard?.name || '',
                    }));
                  }}
                  disabled={!formData.provinceCode || wards.length === 0}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.2rem',
                    fontSize: '1.2rem',
                    border: '1px solid #E0E0E0',
                    borderRadius: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    opacity: (!formData.provinceCode || wards.length === 0) ? 0.6 : 1,
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FE5621'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                >
                  <option value="">-- Chọn quận/huyện/xã/phường --</option>
                  {wards.map(ward => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Địa chỉ chi tiết */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginBottom: '0.5rem',
                }}>
                  Địa chỉ chi tiết <span style={{ color: '#FE5621' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường..."
                  value={formData.detail}
                  onChange={(e) => setFormData(prev => ({ ...prev, detail: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.2rem',
                    fontSize: '1.2rem',
                    border: '1px solid #E0E0E0',
                    borderRadius: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FE5621'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                />
              </div>

              {/* Loại địa chỉ */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginBottom: '0.5rem',
                }}>
                  Loại địa chỉ
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['Nhà', 'Công ty', 'Khác'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData(prev => ({ ...prev, address_type: type }))}
                      style={{
                        flex: 1,
                        padding: '1rem',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        background: formData.address_type === type ? '#FE5621' : 'white',
                        color: formData.address_type === type ? 'white' : '#666',
                        border: formData.address_type === type ? 'none' : '1px solid #E0E0E0',
                        borderRadius: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginBottom: '0.5rem',
                }}>
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  placeholder="VD: Giao tại cổng phụ, gọi trước khi đến..."
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.2rem',
                    fontSize: '1.2rem',
                    border: '1px solid #E0E0E0',
                    borderRadius: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    resize: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FE5621'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => {
                    setStep('list');
                    setEditingAddress(null);
                    setFormData({
                      detail: '',
                      province: '',
                      provinceCode: '',
                      ward: '',
                      wardCode: '',
                      note: '',
                      address_type: 'Nhà',
                    });
                  }}
                  style={{
                    flex: 1,
                    padding: '1.2rem',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    background: '#F5F5F5',
                    color: '#666',
                    border: 'none',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#E0E0E0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#F5F5F5'}
                >
                  Hủy
                </button>
                <button
                  onClick={step === 'edit' ? handleUpdateAddress : handleAddAddress}
                  disabled={loading || !formData.detail || !formData.province || !formData.ward}
                  style={{
                    flex: 1,
                    padding: '1.2rem',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    background: (loading || !formData.detail || !formData.province || !formData.ward) ? '#FFCCBC' : '#FE5621',
                    color: 'white',
                    border: 'none',
                    borderRadius: '1rem',
                    cursor: (loading || !formData.detail || !formData.province || !formData.ward) ? 'not-allowed' : 'pointer',
                    opacity: (loading || !formData.detail || !formData.province || !formData.ward) ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && formData.detail && formData.province && formData.ward) {
                      e.currentTarget.style.background = '#E64A19';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && formData.detail && formData.province && formData.ward) {
                      e.currentTarget.style.background = '#FE5621';
                    }
                  }}
                >
                  {loading ? (step === 'edit' ? 'Đang cập nhật...' : 'Đang lưu...') : (step === 'edit' ? 'Cập nhật' : 'Lưu địa chỉ')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!showInDialog && (
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(100%); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      )}
    </div>
  );
}
