import { useState, useEffect } from 'react';

export const useMyRuns = () => {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    // Mock data - thay thế bằng API call thực tế
    setRuns([
      {
        id: 1,
        orderId: 'DH001',
        pickup: {
          name: 'Nhà hàng Phở 24',
          address: '123 Nguyễn Huệ, Q.1',
          coordinates: { lat: 10.7769, lng: 106.7009 }
        },
        dropoff: {
          name: 'Nguyễn Văn A',
          address: '456 Lê Lợi, Q.3',
          coordinates: { lat: 10.7829, lng: 106.7009 }
        },
        path: [
          { lat: 10.7769, lng: 106.7009 },
          { lat: 10.7789, lng: 106.7029 },
          { lat: 10.7809, lng: 106.7049 },
          { lat: 10.7829, lng: 106.7009 }
        ],
        status: 'in_progress',
        distance: 3.5,
        estimatedTime: 15
      }
    ]);
  }, []);

  return { runs };
};
