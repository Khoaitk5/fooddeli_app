import React from 'react';
import { Box, Typography, Fade } from '@mui/material';
import Logo from './Logo';

const SplashScreen = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // Hiển thị splash screen trong 2.5 giây

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Fade in={true} timeout={1000}>
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '360px',
          height: '800px',
          zIndex: 9999,
          overflow: 'hidden',
        }}
      >
        {/* Background Image */}
        <img
          src="/WelcomeBG.svg"
          alt="Welcome Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            // Fallback background nếu không load được
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #fe724c 0%, #ff9a7a 100%)';
          }}
        />

        {/* Logo ở giữa */}
        <Box
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            animation: 'fadeIn 1s ease-in-out',
          }}
        >
          <Logo
            width="120px"
            height="120px"
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              display: 'none', // Ẩn mặc định, chỉ hiện khi logo lỗi
            }}
          >
            🍽️
          </Typography>
        </Box>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default SplashScreen;