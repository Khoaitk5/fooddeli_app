// src/contexts/shipperContext.js
import React from 'react';

export const ShipperContext = React.createContext({
  // Shipper info
  shipper: null,
  loading: false,      // default chỉ dùng khi *không* bọc Provider
  isOnline: true,
  setIsOnline: () => {},
  updateShipper: () => {},

  // Orders state
  availableOrders: [],
  setAvailableOrders: () => {},
  resetAvailableOrders: () => {},   // ← thêm dòng này để khớp Provider
  currentOrder: null,
  setCurrentOrder: () => {},
});
