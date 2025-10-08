import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import StatusStepper from '@/components/Shipper/StatusStepper';
import BottomActionBar from '@/components/Shipper/BottomActionBar';
import MapView from '@/components/Shipper/MapView';
import { useOrderDetail } from '@/hooks/useOrderDetail';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order } = useOrderDetail(id);

  if (!order) return null;

  return (
    <Box>
      <MapView pickup={order.pickup} dropoff={order.dropoff} path={order.path} />
      <Box sx={{ p: 2 }}>
        <StatusStepper status={order.status} />
      </Box>
      <BottomActionBar order={order} onClose={() => navigate(-1)} />
    </Box>
  );
};

export default OrderDetail;


