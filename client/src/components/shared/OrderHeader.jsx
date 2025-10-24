import React from 'react';
import OrderTabs from './OrderTabs';

const OrderHeader = ({ activeTab, setActiveTab, ongoingOrders, completedOrders, padding }) => {
  return (
    <div style={{
      background: '#fff',
      padding: padding,
      boxShadow: '0 0.125rem 0.5rem rgba(238, 77, 45, 0.3)'
    }}>
      <h1 style={{
        margin: 0,
        color: '#333',
        fontSize: '2.75rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        letterSpacing: '-0.025em'
      }}>
        Đơn hàng của tôi
      </h1>

      <OrderTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ongoingOrders={ongoingOrders}
        completedOrders={completedOrders}
      />
    </div>
  );
};

export default OrderHeader;