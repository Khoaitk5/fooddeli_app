import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
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
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Menu
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;