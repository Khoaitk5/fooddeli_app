import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import OrderHeader from '../../components/shared/OrderHeader';
import OngoingOrderCard from '../../components/shared/OngoingOrderCard';
import CompletedOrderCard from '../../components/shared/CompletedOrderCard';
import EmptyState from '../../components/shared/EmptyState';
import { useTheme, useMediaQuery } from '@mui/material';

function OrdersPage({ isMobile = false, isTablet = false, onTrackOrder = () => {} }) {
  const [activeTab, setActiveTab] = useState('ongoing');
  const navigate = useNavigate();
  const paddingApplied = useRef(false);
  const theme = useTheme();

  // Add safe area padding for mobile status bar
  useEffect(() => {
    console.log('paddingApplied:', paddingApplied.current);
    if (isMobile && !paddingApplied.current) {
      const originalPadding = document.body.style.paddingTop;
      document.body.style.paddingTop = '3rem';
      paddingApplied.current = true;
      console.log('Applied padding, original was:', originalPadding);
      
      return () => {
        document.body.style.paddingTop = originalPadding;
        paddingApplied.current = false;
        console.log('Removed padding, restored to:', originalPadding);
      };
    }
  }, [isMobile]);

  // Mock data for ongoing orders
  const ongoingOrders = [
    {
      id: '2024100912345',
      restaurant: 'Quán Phở Ngon',
      restaurantAddress: '123 Nguyễn Huệ, Q.1',
      status: 'Đang giao hàng',
      estimatedTime: '14:30',
      items: [
        { name: 'Phở bò tái', quantity: 2, price: 80000 },
        { name: 'Gỏi cuốn tôm thịt', quantity: 1, price: 30000 },
        { name: 'Trà sữa trân châu', quantity: 1, price: 35000 }
      ],
      total: 145000,
      image: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMG5vb2RsZXN8ZW58MXx8fHwxNzU5OTkyOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  // Mock data for completed orders
  const completedOrders = [
    {
      id: '2024100812344',
      restaurant: 'Bún Chả Hà Nội',
      restaurantAddress: '789 Trần Hưng Đạo, Q.5',
      deliveredAt: 'Hôm qua, 12:30',
      items: [
        { name: 'Bún chả Hà Nội', quantity: 2, price: 70000 },
        { name: 'Nem cua bể', quantity: 1, price: 40000 }
      ],
      total: 110000,
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwY2hhfGVufDF8fHx8MTc2MDAyNjkzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      rated: false
    },
    {
      id: '2024100712343',
      restaurant: 'Cơm Tấm Sườn Bì',
      restaurantAddress: '321 Võ Văn Tần, Q.3',
      deliveredAt: '2 ngày trước, 19:15',
      items: [
        { name: 'Cơm tấm sườn bì chả', quantity: 1, price: 45000 },
        { name: 'Trà đá', quantity: 1, price: 5000 }
      ],
      total: 50000,
      image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZGlzaCUyMHZpZXRuYW1lc2V8ZW58MXx8fHwxNzYwMDI2OTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rated: true,
      rating: 5
    },
    {
      id: '2024100612342',
      restaurant: 'Bánh Mì Huỳnh Hoa',
      restaurantAddress: '26 Lê Thị Riêng, Q.1',
      deliveredAt: '3 ngày trước, 08:45',
      items: [
        { name: 'Bánh mì đặc biệt', quantity: 3, price: 75000 }
      ],
      total: 75000,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5oJTIwbWl8ZW58MXx8fHwxNzYwMDI2OTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rated: true,
      rating: 4
    }
  ];

  const padding = '2rem';
  const cardMargin = '1.25rem';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      {/* Header */}
      <OrderHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ongoingOrders={ongoingOrders}
        completedOrders={completedOrders}
        padding={padding}
      />

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: padding,
        paddingBottom: '9rem',
        background: '#f5f5f5'
      }}>
        {activeTab === 'ongoing' ? (
          ongoingOrders.length > 0 ? (
            ongoingOrders.map(order => (
              <OngoingOrderCard
                key={order.id}
                order={order}
                cardMargin={cardMargin}
              />
            ))
          ) : (
            <EmptyState message="Chưa có đơn hàng nào đang giao" />
          )
        ) : (
          completedOrders.length > 0 ? (
            completedOrders.map(order => (
              <CompletedOrderCard
                key={order.id}
                order={order}
                cardMargin={cardMargin}
              />
            ))
          ) : (
            <EmptyState message="Chưa có đơn hàng nào đã giao" />
          )
        )}
      </div>
      <Navbar isProfilePage={false} />
    </div>
  );
}

export default OrdersPage;
