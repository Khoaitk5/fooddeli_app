import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AddressContext = createContext();

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within AddressProvider');
  }
  return context;
};

export const AddressProvider = ({ children }) => {
  const [currentAddress, setCurrentAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch địa chỉ mặc định khi component mount
  const fetchDefaultAddress = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/addresses/user-addresses', {
        withCredentials: true,
      });
      
      const addresses = res.data?.data || [];
      
      if (res.data?.success && addresses.length > 0) {
        // Ưu tiên địa chỉ mặc định
        const defaultAddr = addresses.find(addr => addr.is_primary) || addresses[0];
        setCurrentAddress(defaultAddr);
        
        // Tự động set làm mặc định nếu chưa có
        if (!defaultAddr.is_primary && defaultAddr.address_id) {
          try {
            await axios.put(
              `http://localhost:5000/api/addresses/user-addresses/${defaultAddr.address_id}/set-default`,
              {},
              { withCredentials: true }
            );
          } catch (err) {
            console.warn('⚠️ Không thể set default address:', err);
          }
        }
      }
    } catch (err) {
      console.error('❌ Error fetching address:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultAddress();
  }, []);

  // Cập nhật địa chỉ hiện tại
  const updateCurrentAddress = (address) => {
    setCurrentAddress(address);
  };

  // Reload địa chỉ từ server
  const reloadAddress = () => {
    fetchDefaultAddress();
  };

  return (
    <AddressContext.Provider
      value={{
        currentAddress,
        setCurrentAddress: updateCurrentAddress,
        reloadAddress,
        loading,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
