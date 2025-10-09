// Theme configuration
export const theme = {
  colors: {
    primary: '#ff5c39',
    primaryDark: '#ff4520',
    primaryLight: '#ff7657',
    secondary: '#ff6b47',
    
    success: '#3dc07e',
    successLight: '#4fd88e',
    
    warning: '#fbbf24',
    warningLight: '#fcd34d',
    
    danger: '#ef4444',
    
    background: '#ffffff',
    backgroundGray: '#f9fafb',
    backgroundLight: '#f3f4f6',
    
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      light: '#9ca3af',
      white: '#ffffff',
    },
    
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    
    overlay: 'rgba(0, 0, 0, 0.4)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
    
    white: '#ffffff',
    whiteAlpha: (opacity) => `rgba(255, 255, 255, ${opacity})`,
    blackAlpha: (opacity) => `rgba(0, 0, 0, ${opacity})`,
  },
  
  spacing: {
    xs: '0.75rem',    // was 0.5rem
    sm: '1rem',       // was 0.75rem
    md: '1.5rem',     // was 1rem
    lg: '2rem',       // was 1.5rem
    xl: '2.5rem',     // was 2rem
    '2xl': '3rem',    // was 2.5rem
    '3xl': '4rem',    // was 3.5rem
    '4xl': '5rem',    // was 4.5rem
  },
  
  fontSize: {
    xs: '1rem',       // was 0.875rem
    sm: '1.125rem',   // was 1rem
    base: '1.25rem',  // was 1.125rem
    lg: '1.5rem',     // was 1.375rem
    xl: '1.75rem',    // was 1.5rem
    '2xl': '2rem',    // was 1.875rem
    '3xl': '2.5rem',  // was 2.25rem
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    full: '9999px',
  },
  
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  transition: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  
  breakpoints: {
    mobile: '360px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
};

export default theme;
