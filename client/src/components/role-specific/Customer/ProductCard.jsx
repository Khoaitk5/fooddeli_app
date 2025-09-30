import React from 'react';

const ProductCard = ({ product, onAddToCart }) => (
  <div style={{ maxWidth: '345px', margin: '8px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
    <img
      src={product.image || '/placeholder.jpg'}
      alt={product.name}
      style={{ width: '100%', height: '140px', objectFit: 'cover' }}
    />
    <div style={{ padding: '16px' }}>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: '500' }}>
        {product.name}
      </h2>
      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.875rem' }}>
        {product.description}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: '500', color: '#1976d2' }}>
          ${product.price}
        </span>
        <span style={{ background: '#e0e0e0', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
          {product.category}
        </span>
      </div>
      <button
        style={{
          width: '100%',
          padding: '8px',
          marginTop: '8px',
          background: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  </div>
);

export default ProductCard;