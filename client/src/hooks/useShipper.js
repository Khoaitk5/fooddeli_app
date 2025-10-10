import { useContext } from 'react';
import { ShipperContext } from '@/contexts/shipperContext';

export const useShipper = () => {
  return useContext(ShipperContext);
};
