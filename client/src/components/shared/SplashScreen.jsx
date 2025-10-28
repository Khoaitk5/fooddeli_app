import React from 'react';
import { Box, Typography, Fade } from '@mui/material';
import Logo from './Logo';

const SplashScreen = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1000); // Hiển thị splash screen trong 5 giây

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Fade in={true} timeout={1000}>
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          overflow: 'hidden',
          backgroundColor: 'white', // Nền trắng
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
            // Fallback background nếu không load được - nền trắng
            e.target.style.display = 'none';
            e.target.parentElement.style.backgroundColor = 'white';
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
          <Logo/>
        </Box>
      </Box>
    </Fade>
  );
};

export default SplashScreen;
