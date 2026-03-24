'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import {Grid} from '@mui/material';
import { useAuth } from '../token context/authcontent';
import { createApiService } from '@/service/api';
import { motion, Variants } from 'framer-motion';

interface Product {
  name: string;
  type: string;
  creator_id: string;
  price: number;
  imageUrl: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.8, 0.25, 1],
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.8, 0.25, 1]
    }
  }
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <motion.div variants={itemVariants} style={{ height: '100%', willChange: 'transform, opacity' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          cursor: 'pointer',
          height: '100%',
          minHeight: '380px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          transform: 'translateZ(0)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            transform: 'translateY(-6px) translateZ(0)',
            boxShadow: '0 16px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:hover .product-image': {
            transform: 'scale(1.05)',
          },
          '&:hover .action-button': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <Box
            className="product-image"
            component="img"
            src={product.imageUrl || '/Moody Chill Gaming Setups.webp'}
            alt={product.name}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
              willChange: 'transform'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 100%)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 700, letterSpacing: '0.5px' }}>
              ${product.price.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', flexGrow: 1, zIndex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#FFFFFF',
              fontWeight: 600,
              lineHeight: 1.3,
              marginBottom: 1,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {product.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontWeight: 400,
              lineHeight: 1.5,
              marginBottom: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '3em'
            }}
          >
            {product.type}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 'auto' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              By {product.creator_id}
            </Typography>
          </Box>

          <Box sx={{ mt: 2, pt: 2, display: 'flex', justifyContent: 'center' }}>
             <Button
               className="action-button"
               variant="contained"
               fullWidth
               sx={{
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 color: '#fff',
                 backdropFilter: 'blur(8px)',
                 borderRadius: '16px',
                 textTransform: 'none',
                 fontWeight: 600,
                 padding: '10px 0',
                 border: '1px solid rgba(255, 255, 255, 0.1)',
                 opacity: 0.8,
                 transform: 'translateY(4px)',
                 transition: 'all 0.3s ease',
                 '&:hover': {
                   backgroundColor: '#FFFFFF',
                   color: '#000000',
                 }
               }}
             >
               View Details
             </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default function ProductsPage() {
  const { getToken, setToken, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiServiceRef = useRef(createApiService({ getToken, setToken }));

  useEffect(() => {
    if (authLoading) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiServiceRef.current.getProducts();
        setProducts(data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#050505]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-indigo-500/20"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 z-10"></div>
        </div>
      </div>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, md: 6 },
        backgroundImage: 'radial-gradient(circle at 50% 50%, #2a2a35 0%, #050505 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        style={{ width: '100%', maxWidth: '1400px', willChange: 'transform, opacity' }}
      >
        <Box
          sx={{
            width: '100%',
            minHeight: '80vh',
            backgroundColor: 'rgba(30, 30, 35, 0.4)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '40px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            padding: { xs: 4, md: 8 },
            display: 'flex',
            flexDirection: 'column',
            transform: 'translateZ(0)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 1, letterSpacing: '-1px', background: 'linear-gradient(90deg, #FFFFFF, #A0A0A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Digital Tools
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 500 }}>
              Explore {products.length} premium spatial assets
            </Typography>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 4, textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.15)', backdropFilter: 'blur(10px)', py: 2, borderRadius: 3, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              Error: {error}
            </Typography>
          )}

          {!error && products.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', fontSize: '1.2rem', fontWeight: 500 }}>
                No products available at the moment.
              </Typography>
            </Box>
          )}

          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`${product.name}-${index}`}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </motion.div>
    </Box>
  );
}