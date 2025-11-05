import React from 'react';
import { ShipperContext } from './shipperContext';

// Khóa lưu đơn hiện tại
const ORDER_KEY = 'currentOrder';
// (tuỳ chọn) khóa trạng thái online nếu bạn muốn giữ lại
const ONLINE_KEY = 'shipperOnline';

function readJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, val) {
  try {
    if (val === null || val === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

const ShipperProvider = ({ children }) => {
  // Thông tin shipper (tuỳ bạn gắn từ API sau)
  const [shipper, setShipper] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Trạng thái online (persist nhẹ, không bắt buộc)
  const [isOnline, setIsOnlineState] = React.useState(() => {
    const v = readJSON(ONLINE_KEY, true);
    return typeof v === 'boolean' ? v : true;
  });
  const setIsOnline = React.useCallback((next) => {
    const value = typeof next === 'function' ? next(isOnline) : next;
    setIsOnlineState(value);
    writeJSON(ONLINE_KEY, !!value);
  }, [isOnline]);

  // Danh sách đơn có sẵn (để sau này bạn đổ từ API)
  const [availableOrders, setAvailableOrders] = React.useState([]);
  const resetAvailableOrders = React.useCallback(() => {
    setAvailableOrders([]); // giữ đúng structure, không dùng data tĩnh
  }, []);

  // Đơn hiện tại: persist qua localStorage + sync cross-tab
  const [currentOrder, setCurrentOrderState] = React.useState(() => readJSON(ORDER_KEY, null));

  const setCurrentOrder = React.useCallback((updater) => {
    setCurrentOrderState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      writeJSON(ORDER_KEY, next ?? null);
      return next ?? null;
    });
  }, []);

  // Sync khi tab khác thay đổi localStorage
  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ORDER_KEY) {
        setCurrentOrderState(readJSON(ORDER_KEY, null));
      }
      if (e.key === ONLINE_KEY) {
        const v = readJSON(ONLINE_KEY, true);
        setIsOnlineState(typeof v === 'boolean' ? v : true);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const updateShipper = React.useCallback((patch) => {
    setShipper((prev) => ({ ...(prev || {}), ...(patch || {}) }));
  }, []);

  const value = React.useMemo(() => ({
    // info
    shipper,
    loading,
    isOnline,
    setIsOnline,
    updateShipper,

    // orders
    availableOrders,
    setAvailableOrders,
    resetAvailableOrders,
    currentOrder,
    setCurrentOrder,
  }), [
    shipper, loading, isOnline,
    availableOrders, currentOrder,
    setIsOnline, updateShipper, resetAvailableOrders, setCurrentOrder
  ]);

  return <ShipperContext.Provider value={value}>{children}</ShipperContext.Provider>;
};

export default ShipperProvider;
