import { useState } from 'react';
import theme from '../../../styles/theme';

export default function FoodCard({
  name,
  image,
  price,
  originalPrice,
  rating,
  restaurant,
  distance,
  promotion,
  onClick,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    card: {
      display: 'flex',
      height: '10rem',  // increased from 8rem for better mobile visibility
      background: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      boxShadow: theme.shadow.md,
      border: `1px solid ${theme.colors.borderLight}`,
      cursor: 'pointer',
      transition: `all ${theme.transition.normal}`,
      ...(isHovered && {
        boxShadow: theme.shadow.xl,
        transform: 'scale(0.98)',
      }),
    },
    imageContainer: {
      position: 'relative',
      width: '10rem',  // increased from 8rem for better mobile visibility
      flexShrink: 0,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: `transform ${theme.transition.normal}`,
      ...(isHovered && {
        transform: 'scale(1.05)',
      }),
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
      opacity: isHovered ? 1 : 0,
      transition: `opacity ${theme.transition.normal}`,
    },
    promotion: {
      position: 'absolute',
      top: '0.5rem',
      left: '0.5rem',
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
      color: theme.colors.text.white,
      padding: '0.25rem 0.5rem',
      borderRadius: theme.borderRadius.full,
      fontSize: '0.75rem',
      boxShadow: theme.shadow.lg,
    },
    ratingBadge: {
      position: 'absolute',
      bottom: '0.5rem',
      left: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      background: theme.colors.blackAlpha(0.6),
      backdropFilter: 'blur(8px)',
      padding: '0.25rem 0.5rem',
      borderRadius: theme.borderRadius.full,
    },
    starIcon: {
      width: '0.75rem',
      height: '0.75rem',
      fill: '#fbbf24',
      color: '#fbbf24',
    },
    ratingText: {
      fontSize: '0.75rem',
      color: theme.colors.text.white,
    },
    content: {
      flex: 1,
      padding: '1rem',  // increased from 0.75rem
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minWidth: 0,
    },
    title: {
      marginBottom: '0.5rem',  // increased from 0.375rem
      fontSize: theme.fontSize.lg,  // increased from base
      lineHeight: '1.3',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: theme.colors.text.primary,
      transition: `color ${theme.transition.fast}`,
      ...(isHovered && {
        color: theme.colors.primary,
      }),
    },
    restaurantInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',  // increased from 0.375rem
      fontSize: '0.9rem',  // increased from 0.8rem
      color: theme.colors.text.secondary,
      marginBottom: '0.5rem',  // increased from 0.375rem
      overflow: 'hidden',
    },
    restaurantName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    separator: {
      color: theme.colors.text.light,
      flexShrink: 0,
    },
    distance: {
      flexShrink: 0,
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    price: {
      fontSize: theme.fontSize.xl,  // increased from lg for better mobile visibility
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: '600',
    },
    originalPrice: {
      fontSize: '0.75rem',
      color: theme.colors.text.light,
      textDecoration: 'line-through',
    },
    addButton: {
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
      color: theme.colors.text.white,
      padding: '0.5rem',  // increased from 0.375rem
      borderRadius: theme.borderRadius.md,
      border: 'none',
      cursor: 'pointer',
      boxShadow: theme.shadow.md,
      flexShrink: 0,
      transition: `all ${theme.transition.fast}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addIcon: {
      width: '1.25rem',  // increased from 1rem
      height: '1.25rem',  // increased from 1rem
    },
    favoriteButton: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      background: theme.colors.whiteAlpha(0.9),
      backdropFilter: 'blur(8px)',
      padding: '0.5rem',  // increased from 0.375rem
      borderRadius: theme.borderRadius.full,
      border: 'none',
      cursor: 'pointer',
      boxShadow: theme.shadow.lg,
      transition: `all ${theme.transition.fast}`,
    },
    heartIcon: {
      width: '1.25rem',  // increased from 1rem
      height: '1.25rem',  // increased from 1rem
      ...(isFavorite ? {
        fill: '#ef4444',
        color: '#ef4444',
      } : {
        fill: 'none',
        color: theme.colors.text.secondary,
      }),
      transition: `all ${theme.transition.fast}`,
    },
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    // Handle add to cart
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      style={styles.card}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        <img src={image} alt={name} style={styles.image} />
        <div style={styles.overlay} />
        
        {promotion && (
          <div style={styles.promotion}>{promotion}</div>
        )}
        
        {rating && (
          <div style={styles.ratingBadge}>
            <svg style={styles.starIcon} viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span style={styles.ratingText}>{rating}</span>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div>
          <h3 style={styles.title}>{name}</h3>
          <div style={styles.restaurantInfo}>
            <span style={styles.restaurantName}>{restaurant}</span>
            <span style={styles.separator}>•</span>
            <span style={styles.distance}>{distance}</span>
          </div>
        </div>

        <div style={styles.footer}>
          <div style={styles.priceContainer}>
            <span style={styles.price}>{price}</span>
            {originalPrice && (
              <span style={styles.originalPrice}>{originalPrice}</span>
            )}
          </div>
          
          <button style={styles.addButton} onClick={handleAddClick}>
            <svg style={styles.addIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <button style={styles.favoriteButton} onClick={handleFavoriteClick}>
        <svg style={styles.heartIcon} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
  );
}
