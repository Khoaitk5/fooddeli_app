import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gift, Sparkles, Tag } from 'lucide-react';
import theme from '../../../styles/theme';

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    { 
      id: 1, 
      title: 'Giảm 50% cho đơn đầu tiên', 
      subtitle: 'Áp dụng cho đơn từ 0đ',
      gradient: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryLight}, #ff8566)`,
      Icon: Gift,
    },
    { 
      id: 2, 
      title: 'Freeship 0đ cho mọi đơn hàng', 
      subtitle: 'Không giới hạn khoảng cách',
      gradient: 'linear-gradient(to right, #3dc07e, #4fd88e, #5fd89a)',
      Icon: Sparkles,
    },
    { 
      id: 3, 
      title: 'Nhập mã FOODIE - Giảm 30K', 
      subtitle: 'Cho đơn hàng từ 99K',
      gradient: 'linear-gradient(to right, #6e4aff, #8563ff, #9575ff)',
      Icon: Tag,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBanner = banners[currentSlide];
  const Icon = currentBanner.Icon;

  const styles = {
    container: {
      padding: `${theme.spacing.lg} ${theme.spacing.lg}`,
      backgroundColor: '#f9fafb',
    },
    carouselWrapper: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: theme.borderRadius['2xl'],
      boxShadow: theme.shadow.xl,
    },
    slide: {
      background: currentBanner.gradient,
      padding: theme.spacing['2xl'],
      position: 'relative',
      overflow: 'hidden',
      minHeight: '12rem',  // increased from 9rem for better mobile visibility
    },
    decorativeCircle1: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '10rem',
      height: '10rem',
      backgroundColor: theme.colors.whiteAlpha(0.1),
      borderRadius: '50%',
      marginRight: '-5rem',
      marginTop: '-5rem',
    },
    decorativeCircle2: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '8rem',
      height: '8rem',
      backgroundColor: theme.colors.whiteAlpha(0.1),
      borderRadius: '50%',
      marginLeft: '-4rem',
      marginBottom: '-4rem',
    },
    decorativeCircle3: {
      position: 'absolute',
      top: '50%',
      right: '25%',
      width: '6rem',
      height: '6rem',
      backgroundColor: theme.colors.whiteAlpha(0.05),
      borderRadius: '50%',
    },
    content: {
      position: 'relative',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.lg,
    },
    iconContainer: {
      backgroundColor: theme.colors.whiteAlpha(0.2),
      backdropFilter: 'blur(10px)',
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius['2xl'],
    },
    textContainer: {
      flex: 1,
      color: theme.colors.white,
    },
    title: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
      lineHeight: 1.3,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      opacity: 0.9,
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: theme.colors.whiteAlpha(0.9),
      backdropFilter: 'blur(10px)',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      boxShadow: theme.shadow.lg,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: `all ${theme.transition.fast}`,
      zIndex: 20,
    },
    leftButton: {
      left: theme.spacing.md,
    },
    rightButton: {
      right: theme.spacing.md,
    },
    dotsContainer: {
      position: 'absolute',
      bottom: theme.spacing.lg,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: theme.spacing.sm,
      zIndex: 20,
    },
    dot: (isActive) => ({
      height: '0.5rem',
      width: isActive ? '2rem' : '0.5rem',
      backgroundColor: theme.colors.white,
      opacity: isActive ? 1 : 0.5,
      borderRadius: theme.borderRadius.full,
      transition: `all ${theme.transition.normal}`,
      cursor: 'pointer',
      border: 'none',
      padding: 0,
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.carouselWrapper}>
        <div style={styles.slide}>
          <div style={styles.decorativeCircle1} />
          <div style={styles.decorativeCircle2} />
          <div style={styles.decorativeCircle3} />
          
          <div style={styles.content}>
            <div style={styles.iconContainer}>
              <Icon size={36} color={theme.colors.white} strokeWidth={2} />
            </div>
            <div style={styles.textContainer}>
              <h3 style={styles.title}>
                {currentBanner.title}
              </h3>
              <p style={styles.subtitle}>
                {currentBanner.subtitle}
              </p>
            </div>
          </div>
        </div>

        <button
          style={{...styles.navButton, ...styles.leftButton}}
          onClick={prevSlide}
          onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.white}
          onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.whiteAlpha(0.9)}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          style={{...styles.navButton, ...styles.rightButton}}
          onClick={nextSlide}
          onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.white}
          onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.whiteAlpha(0.9)}
        >
          <ChevronRight size={18} />
        </button>

        <div style={styles.dotsContainer}>
          {banners.map((_, index) => (
            <button
              key={index}
              style={styles.dot(currentSlide === index)}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
