'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Stack, Avatar } from '@mui/material';
import NextLink from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '../token context/authcontent';

const HeroSection: React.FC = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [offsetY, setOffsetY] = useState<number>(0);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          setOffsetY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: unknown) {
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#0F172A',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #2a2a35 0%, #050505 100%)',
        minHeight: { xs: '100vh', md: 'calc(100vh - 32px)' },
        borderRadius: { xs: '0', md: '40px' },
        margin: { xs: 0, md: 2 },
        paddingTop: 4,
        paddingBottom: { xs: 12, md: 16 },
        color: 'white',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 24,
          left: 0,
          right: 0,
          zIndex: 1000,
          px: { xs: 2, md: 4 },
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <Box
          data-aos="fade-down"
          sx={{
            width: '100%',
            maxWidth: '1152px',
            pointerEvents: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: isScrolled 
              ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%)'
              : 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)',
            backdropFilter: isScrolled ? 'blur(32px)' : 'blur(24px)',
            WebkitBackdropFilter: isScrolled ? 'blur(32px)' : 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            boxShadow: isScrolled 
              ? 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 16px 40px rgba(0, 0, 0, 0.5)'
              : 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              <span style={{ color: '#6366F1' }}>△</span> DIGIMART
            </Box>
          </Box>

          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Box sx={{ backgroundColor: '#6366F1', px: 2, py: 0.5, borderRadius: 2, cursor: 'pointer' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF' }}>Home</Typography>
            </Box>
            
            

            <NextLink href="#" style={{ textDecoration: 'none' }}>
              <Typography sx={{ cursor: 'pointer', color: "#F8FAFC", transition: 'all 0.4s ease-in-out', '&:hover': { color: '#6366F1' } }}>
                Marketplace
              </Typography>
            </NextLink>
            
            <NextLink href="#" style={{ textDecoration: 'none' }}>
              <Typography sx={{ cursor: 'pointer', color: "#F8FAFC", transition: 'all 0.4s ease-in-out', '&:hover': { color: '#6366F1' } }}>
                AI Agents
              </Typography>
            </NextLink>
            
            <NextLink href="#" style={{ textDecoration: 'none' }}>
              <Typography sx={{ cursor: 'pointer', color: "#F8FAFC", transition: 'all 0.4s ease-in-out', '&:hover': { color: '#6366F1' } }}>
                Templates & Themes
              </Typography>
            </NextLink>
            
            <NextLink href="#" style={{ textDecoration: 'none' }}>
              <Typography sx={{ cursor: 'pointer', color: "#F8FAFC", transition: 'all 0.4s ease-in-out', '&:hover': { color: '#6366F1' } }}>
                Datasets for ML models
              </Typography>
            </NextLink>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#0F172A',
                borderRadius: '24px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 0.5,
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { backgroundColor: '#f0f0f0', boxShadow: 'none' },
              }}
            >
              <Avatar sx={{ width: 24, height: 24, bgcolor: '#6366F1', fontSize: '0.75rem', fontWeight: 600 }}>
                {user?.sub ? user.sub.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              {user?.sub || 'User'}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#F8FAFC',
                borderRadius: '24px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  borderColor: 'rgba(255,255,255,0.3)' 
                },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 16 } }}>
        <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: { xs: 6, md: 10 } }}>
          <Typography
            variant="overline"
            data-aos="fade-up"
            sx={{
              color: '#F8FAFC',
              fontWeight: 700,
              letterSpacing: '1px',
              fontSize: '0.875rem',
              display: 'block',
              mb: 2,
            }}
          >
            CONNECT. ENGAGE. EXPLORE. SMARTER.
          </Typography>
          <Typography
            variant="h1"
            data-aos="fade-up"
            data-aos-delay="150"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              letterSpacing: '-1px'
            }}
          >
            Supercharge your workflow with premium AI agents and digital tools.
          </Typography>
          <Typography
            variant="h6"
            data-aos="fade-up"
            data-aos-delay="300"
            sx={{
              fontWeight: 400,
              color: '#e0e0e0',
              fontSize: { xs: '1rem', md: '1.25rem' },
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            Unlock unlimited potential with a single subscription. Gain continuous access to a growing library of custom AI agents, automated workflows, and premium digital assets designed to automate your daily tasks and elevate your projects
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', px: { xs: 2, md: 0 } }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: '900px' }}>
            <Box data-aos="zoom-in-up" data-aos-delay="400" sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                component="img"
                src="/tool_ Dashboard AI Meeting _.webp"
                alt="Dashboard Application"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '16px',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                  transform: `translateY(${offsetY * 0.03}px)`,
                  transition: 'transform 0.1s linear',
                }}
              />
            </Box>
            
            <Box 
              data-aos="fade-left" 
              data-aos-delay="600" 
              sx={{ 
                position: 'absolute',
                bottom: { xs: '-10%', md: '-15%' },
                right: { xs: '-5%', md: '-8%' },
                zIndex: 2,
                width: { xs: '35%', md: '25%' },
                maxWidth: '250px',
              }}
            >
              <Box
                component="img"
                src="/IA.webp"
                alt="Mobile Application"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '24px',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
                  transform: `translateY(${offsetY * -0.05}px)`,
                  transition: 'transform 0.1s linear',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;