import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ProductCard from '../../components/role-specific/Customer/ProductCard';

const Home = () => {
  console.log('Home component rendered');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Mock data nếu API chưa sẵn sàng
      setProducts([
        { id: 1, name: 'Pizza Margherita', description: 'Classic pizza', price: 12.99, category: 'Pizza', image: '/pizza.jpg' },
        { id: 2, name: 'Burger', description: 'Juicy burger', price: 8.99, category: 'Burger', image: '/burger.jpg' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await api.post('/cart', { productId: product.id, quantity: 1 });
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ marginBottom: '16px', fontSize: '2.125rem', fontWeight: '400' }}>Menu</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;