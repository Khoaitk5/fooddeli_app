import React from 'react';

const OrderTabs = ({ activeTab, setActiveTab, ongoingOrders, completedOrders }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      background: '#f5f5f5',
      padding: '0.25rem',
      borderRadius: '0.75rem',
      backdropFilter: 'blur(10px)'
    }}>
      <button
        onClick={() => setActiveTab('ongoing')}
        style={{
          flex: 1,
          padding: '0.875rem',
          background: activeTab === 'ongoing' ? '#5EAD1D' : 'transparent',
          border: 'none',
          borderRadius: '0.625rem',
          color: activeTab === 'ongoing' ? '#fff' : '#666',
          fontSize: '1.375rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: activeTab === 'ongoing' ? '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        Đang đến ({ongoingOrders.length})
      </button>
      <button
        onClick={() => setActiveTab('completed')}
        style={{
          flex: 1,
          padding: '0.875rem',
          background: activeTab === 'completed' ? '#5EAD1D' : 'transparent',
          border: 'none',
          borderRadius: '0.625rem',
          color: activeTab === 'completed' ? '#fff' : '#666',
          fontSize: '1.375rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: activeTab === 'completed' ? '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        Đã giao ({completedOrders.length})
      </button>
    </div>
  );
};

export default OrderTabs;