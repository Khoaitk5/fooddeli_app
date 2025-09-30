import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Chip, Box } from '@mui/material';

const ProductCard = ({ product, onAddToCart }) => (
  <Card sx={{ maxWidth: 345, m: 1 }}>
    <CardMedia
      component="img"
      height="140"
      image={product.image || '/placeholder.jpg'}
      alt={product.name}
    />
    <CardContent>
      <Typography gutterBottom variant="h6" component="div">
        {product.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {product.description}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography variant="h6" color="primary">
          ${product.price}
        </Typography>
        <Chip label={product.category} size="small" />
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </Button>
    </CardContent>
  </Card>
);

export default ProductCard;