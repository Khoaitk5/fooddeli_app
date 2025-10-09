import { useState } from 'react';
import { Star, Clock, Heart, MapPin } from 'lucide-react';
import theme from '../../../styles/theme';

export default function RestaurantCard({
  name,
  image,
  rating,
  distance,
  time,
  promotion,
  tags,
  onClick,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    card: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius['2xl'],
      overflow: 'hidden',
      boxShadow: isHovered ? theme.shadow.xl : theme.shadow.md,
      transition: `all ${theme.transition.normal}`,
      cursor: 'pointer',
      border: `1px solid ${theme.colors.borderLight}`,
      transform: isHovered ? 'translateY(-0.5rem)' : 'translateY(0)',
    },
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      height: '10rem',  // increased from 8rem for better mobile visibility
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: `transform ${theme.transition.slow}`,
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent, transparent)',
      opacity: isHovered ? 1 : 0,
      transition: `opacity ${theme.transition.normal}`,
    },
    favoriteButton: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: theme.colors.whiteAlpha(0.9),
      backdropFilter: 'blur(10px)',
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      boxShadow: theme.shadow.lg,
      border: 'none',
      cursor: 'pointer',
      transition: `all ${theme.transition.fast}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    promotionBadge: {
      position: 'absolute',
      bottom: theme.spacing.sm,
      left: theme.spacing.sm,
      background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryLight})`,
      color: theme.colors.white,
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.full,
      fontSize: theme.fontSize.xs,
      boxShadow: theme.shadow.lg,
    },
    content: {
      padding: theme.spacing.md,
    },
    title: {
      marginBottom: theme.spacing.sm,
      fontSize: theme.fontSize.sm,
      fontWeight: '500',
      color: isHovered ? theme.colors.primary : theme.colors.text.primary,
      transition: `color ${theme.transition.fast}`,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      fontSize: theme.fontSize.xs,
    },
    ratingBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      background: 'linear-gradient(to bottom right, #fef3c7, #fed7aa)',
      padding: `0.25rem ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.full,
      boxShadow: theme.shadow.sm,
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      color: theme.colors.text.secondary,
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    tag: {
      fontSize: '0.65rem',
      padding: `0.25rem ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.full,
      boxShadow: theme.shadow.sm,
    },
    freeshipTag: {
      background: 'linear-gradient(to right, #d1fae5, #a7f3d0)',
      color: '#065f46',
    },
    normalTag: {
      background: 'linear-gradient(to right, #f3f4f6, #e5e7eb)',
      color: '#374151',
    },
  };

  return (
    <div
      style={styles.card}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        <img
          src={image}
          alt={name}
          style={styles.image}
        />
        
        <div style={styles.overlay} />
        
        <button
          style={{
            ...styles.favoriteButton,
            backgroundColor: isFavorite ? theme.colors.whiteAlpha(1) : theme.colors.whiteAlpha(0.9),
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart
            size={18}
            color={isFavorite ? '#ef4444' : '#6b7280'}
            fill={isFavorite ? '#ef4444' : 'none'}
            style={{ transition: `all ${theme.transition.fast}` }}
          />
        </button>

        {promotion && (
          <div style={styles.promotionBadge}>
            {promotion}
          </div>
        )}
      </div>
      
      <div style={styles.content}>
        <h3 style={styles.title}>
          {name}
        </h3>
        
        <div style={styles.infoRow}>
          <div style={styles.ratingBadge}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <span>{rating}</span>
          </div>
          <div style={styles.infoItem}>
            <MapPin size={14} />
            <span style={{ fontSize: theme.fontSize.xs }}>{distance}</span>
          </div>
          <div style={styles.infoItem}>
            <Clock size={14} />
            <span style={{ fontSize: theme.fontSize.xs }}>{time}</span>
          </div>
        </div>

        <div style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <span
              key={index}
              style={{
                ...styles.tag,
                ...(tag === 'Freeship' ? styles.freeshipTag : styles.normalTag),
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
