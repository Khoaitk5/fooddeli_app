import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../../../styles/theme';

export default function Header({ onSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleCartClick = () => {
    navigate('/customer/cart');
  };

  const styles = {
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 50%, ${theme.colors.primaryLight} 100%)`,
      boxShadow: theme.shadow['2xl'],
      transition: `all ${theme.transition.normal}`,
    },
    container: {
      padding: isScrolled ? `${theme.spacing.md} ${theme.spacing.lg}` : `${theme.spacing.xl} ${theme.spacing.lg}`,
      transition: `padding ${theme.transition.normal}`,
    },
    addressSection: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      overflow: 'hidden',
      opacity: isScrolled ? 0 : 1,
      height: isScrolled ? 0 : 'auto',
      transition: `all ${theme.transition.fast}`,
    },
    addressBox: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flex: 1,
      background: theme.colors.whiteAlpha(0.15),
      backdropFilter: 'blur(12px)',
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      border: `1px solid ${theme.colors.whiteAlpha(0.3)}`,
      boxShadow: theme.shadow.lg,
    },
    addressText: {
      color: theme.colors.text.white,
      fontSize: theme.fontSize.sm,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 1,
    },
    cartButton: {
      position: 'relative',
      padding: theme.spacing.md,
      background: theme.colors.whiteAlpha(0.2),
      backdropFilter: 'blur(12px)',
      borderRadius: theme.borderRadius.xl,
      border: 'none',
      cursor: 'pointer',
      boxShadow: theme.shadow.lg,
      transition: `all ${theme.transition.fast}`,
      flexShrink: 0,
    },
    cartButtonHover: {
      background: theme.colors.whiteAlpha(0.3),
    },
    cartBadge: {
      position: 'absolute',
      top: '-0.375rem',
      right: '-0.375rem',
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      color: theme.colors.text.white,
      fontSize: theme.fontSize.xs,
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: theme.borderRadius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme.shadow.lg,
    },
    searchContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    searchForm: {
      position: 'relative',
      flex: 1,
    },
    searchIcon: {
      position: 'absolute',
      left: theme.spacing.lg,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1.25rem',
      height: '1.25rem',
      color: theme.colors.text.secondary,
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      paddingLeft: '3.25rem',
      paddingRight: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      fontSize: theme.fontSize.sm,
      background: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      border: 'none',
      outline: 'none',
      boxShadow: theme.shadow.xl,
      transition: `all ${theme.transition.fast}`,
    },
    searchInputFocus: {
      boxShadow: theme.shadow['2xl'],
      ring: `2px solid ${theme.colors.whiteAlpha(0.5)}`,
    },
    icon: {
      width: '1.25rem',
      height: '1.25rem',
      color: theme.colors.text.white,
    },
    iconSmall: {
      width: '1rem',
      height: '1rem',
      color: theme.colors.whiteAlpha(0.8),
    },
  };

  return (
    <div style={styles.header}>
      <div style={styles.container}>
        {!isScrolled && (
          <div style={styles.addressSection}>
            <div style={styles.addressBox}>
              <svg style={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span style={styles.addressText}>227 Nguyễn Văn Cừ, Q5</span>
              <svg style={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <button style={styles.cartButton} onClick={handleCartClick}>
              <svg style={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span style={styles.cartBadge}>3</span>
            </button>
          </div>
        )}

        <div style={styles.searchContainer}>
          <form style={styles.searchForm} onSubmit={handleSearchSubmit}>
            <svg style={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm món ăn, quán ăn..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={styles.searchInput}
            />
          </form>
          
          {isScrolled && (
            <button style={styles.cartButton} onClick={handleCartClick}>
              <svg style={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span style={styles.cartBadge}>3</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
