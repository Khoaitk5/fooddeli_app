import { useContext } from 'react';
import { ShipperContext } from '@/contexts/shipperContext';

export const useShipper = () => useContext(ShipperContext);
export default useShipper;
