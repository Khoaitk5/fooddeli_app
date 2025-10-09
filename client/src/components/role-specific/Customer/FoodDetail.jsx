import { useState } from 'react';
import theme from '../../../styles/theme';

export default function FoodDetail({
  name,
  image,
  price,
  originalPrice,
  rating,
  restaurant,
  distance,
  promotion,
  onClose,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { id: '1', name: 'Thêm phô mai', price: '+10.000đ' },
    { id: '2', name: 'Thêm thịt', price: '+20.000đ' },
    { id: '3', name: 'Size lớn', price: '+15.000đ' },
  ];

  const toppings = [
    { id: '1', name: 'Trứng', price: '+5.000đ' },
    { id: '2', name: 'Rau thêm', price: '+5.000đ' },
    { id: '3', name: 'Nước chấm thêm', price: '+3.000đ' },
  ];

  const toggleOption = (optionId) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: theme.colors.background,
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '16rem',
      objectFit: 'cover',
    },
    closeButton: {
      position: 'absolute',
      top: theme.spacing.lg,
      left: theme.spacing.lg,
      background: theme.colors.whiteAlpha(0.9),
      backdropFilter: 'blur(8px)',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      border: 'none',
      cursor: 'pointer',
      boxShadow: theme.shadow.lg,
    },
    promotionBadge: {
      position: 'absolute',
      bottom: theme.spacing.lg,
      left: theme.spacing.lg,
      background: theme.colors.primary,
      color: theme.colors.text.white,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.xl,
      boxShadow: theme.shadow.lg,
    },
    content: {
      flex: 1,
      overflowY: 'auto',
    },
    infoSection: {
      padding: theme.spacing.lg,
      borderBottom: `1px solid ${theme.colors.borderLight}`,
    },
    title: {
      marginBottom: theme.spacing.sm,
    },
    restaurantInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.lg,
      marginTop: theme.spacing.sm,
      fontSize: theme.fontSize.sm,
      color: theme.colors.text.secondary,
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    priceSection: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    price: {
      fontSize: theme.fontSize.xl,
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: '600',
    },
    originalPrice: {
      fontSize: theme.fontSize.base,
      color: theme.colors.text.light,
      textDecoration: 'line-through',
    },
    section: {
      padding: theme.spacing.lg,
      borderBottom: `1px solid ${theme.colors.borderLight}`,
    },
    sectionTitle: {
      marginBottom: theme.spacing.lg,
    },
    optionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.md,
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      background: theme.colors.backgroundLight,
      borderRadius: theme.borderRadius.lg,
      cursor: 'pointer',
      transition: `all ${theme.transition.fast}`,
    },
    optionSelected: {
      background: '#fff5f3',
      border: `2px solid ${theme.colors.primary}`,
    },
    optionName: {
      fontSize: theme.fontSize.base,
    },
    optionPrice: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text.secondary,
    },
    footer: {
      padding: theme.spacing.lg,
      borderTop: `1px solid ${theme.colors.borderLight}`,
      background: theme.colors.background,
      boxShadow: theme.shadow['2xl'],
    },
    quantityControl: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    quantityLabel: {
      fontSize: theme.fontSize.base,
      flex: 1,
    },
    quantityButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    quantityButton: {
      width: '2.5rem',
      height: '2.5rem',
      border: `2px solid ${theme.colors.primary}`,
      background: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: `all ${theme.transition.fast}`,
    },
    quantityValue: {
      fontSize: theme.fontSize.lg,
      minWidth: '2rem',
      textAlign: 'center',
    },
    addButton: {
      width: '100%',
      padding: theme.spacing.lg,
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
      color: theme.colors.text.white,
      border: 'none',
      borderRadius: theme.borderRadius.xl,
      fontSize: theme.fontSize.base,
      cursor: 'pointer',
      boxShadow: theme.shadow.lg,
      transition: `all ${theme.transition.fast}`,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src={image} alt={name} style={styles.image} />
        <button style={styles.closeButton} onClick={onClose}>
          <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {promotion && (
          <div style={styles.promotionBadge}>{promotion}</div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.infoSection}>
          <h1 style={styles.title}>{name}</h1>
          
          <div style={styles.restaurantInfo}>
            <div style={styles.infoItem}>
              <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
              <span>{restaurant}</span>
            </div>
            {rating && (
              <div style={styles.infoItem}>
                <svg style={{ width: '1rem', height: '1rem', fill: '#fbbf24' }} viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{rating}</span>
              </div>
            )}
            <div style={styles.infoItem}>
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{distance}</span>
            </div>
          </div>

          <div style={styles.priceSection}>
            <span style={styles.price}>{price}</span>
            {originalPrice && (
              <span style={styles.originalPrice}>{originalPrice}</span>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Tùy chọn thêm</h3>
          <div style={styles.optionsList}>
            {options.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              return (
                <div
                  key={option.id}
                  style={{
                    ...styles.option,
                    ...(isSelected && styles.optionSelected),
                  }}
                  onClick={() => toggleOption(option.id)}
                >
                  <span style={styles.optionName}>{option.name}</span>
                  <span style={styles.optionPrice}>{option.price}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Topping</h3>
          <div style={styles.optionsList}>
            {toppings.map((topping) => {
              const isSelected = selectedOptions.includes(topping.id);
              return (
                <div
                  key={topping.id}
                  style={{
                    ...styles.option,
                    ...(isSelected && styles.optionSelected),
                  }}
                  onClick={() => toggleOption(topping.id)}
                >
                  <span style={styles.optionName}>{topping.name}</span>
                  <span style={styles.optionPrice}>{topping.price}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.quantityControl}>
          <span style={styles.quantityLabel}>Số lượng</span>
          <div style={styles.quantityButtons}>
            <button
              style={styles.quantityButton}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span style={styles.quantityValue}>{quantity}</span>
            <button
              style={styles.quantityButton}
              onClick={() => setQuantity(quantity + 1)}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        <button style={styles.addButton}>
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}
