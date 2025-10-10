import React from 'react';

export const ShipperContext = React.createContext({
  shipper: null,
  loading: true,
  isOnline: false,
  setIsOnline: () => {},
  updateShipper: () => {},
  // Orders state
  availableOrders: [],
  setAvailableOrders: () => {},
  currentOrder: null,
  setCurrentOrder: () => {},
});


