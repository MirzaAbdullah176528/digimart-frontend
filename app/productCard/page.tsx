'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';

interface Product {
  id: string;
  title: string;
  category: string;
  author: string;
  price: number;
  imageUrl: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height:'750px',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Box
        component="img"
        src={product.imageUrl}
        alt={product.title}
        sx={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '12px',
          marginBottom: 2,
        }}
      />
      <Typography
        variant="subtitle1"
        sx={{
          color: '#FFFFFF',
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.2,
          marginBottom: 0.5,
          minHeight: '2.4em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {product.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#94A3B8',
          textAlign: 'center',
          marginBottom: 0.25,
          letterSpacing:1
        }}
      >
        {product.category}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: '#64748B',
          textAlign: 'center',
          marginBottom: 2,
        }}
      >
        {product.author}
      </Typography>
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '4px 16px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#FFFFFF',
            fontWeight: 500,
          }}
        >
          ${product.price.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        
        setProducts([
          {
            id: '1',
            title: 'SMART TASK AUTOMATOR',
            category: 'Digital Workflow Tool for frontend development and UI&UX desgining by anoymous user',
            author: 'Aether Dynamics Inc.',
            price: 29.99,
            imageUrl: 'https://placehold.co/400x400',
          },
          {
            id: '2',
            title: 'FOCUS BOOST',
            category: 'Productivity App',
            author: 'Mindful Tech Group',
            price: 9.99,
            imageUrl: 'https://placehold.co/400x400',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#6366F1' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#0F172A', minHeight: '100vh' }}>
      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          Displaying fallback data due to fetch error: {error}
        </Typography>
      )}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid size={{xs:12, sm:6, md:4, lg:3}} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}