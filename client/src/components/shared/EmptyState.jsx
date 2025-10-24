import React from 'react';
import { ShoppingBag } from 'lucide-react';

const EmptyState = ({ message }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      color: '#999'
    }}>
      <ShoppingBag size={64} color="#ccc" strokeWidth={1.5} />
      <p style={{ marginTop: '1rem', fontSize: '1.25rem' }}>
        {message}
      </p>
    </div>
  );
};

export default EmptyState;