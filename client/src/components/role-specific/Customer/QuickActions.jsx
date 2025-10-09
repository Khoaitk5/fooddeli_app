import { Utensils, ShoppingCart, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function QuickActions() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const actions = [
    { 
      icon: Utensils, 
      label: 'Food Delivery', 
      gradient: 'linear-gradient(to bottom right, #ff5c39, #ff7657)',
      shadowColor: 'rgba(255, 193, 7, 0.3)'
    },
    { 
      icon: ShoppingCart, 
      label: 'Mart', 
      gradient: 'linear-gradient(to bottom right, #3dc07e, #5fd89a)',
      shadowColor: 'rgba(40, 167, 69, 0.3)'
    },
    { 
      icon: Package, 
      label: 'Pick-Up', 
      gradient: 'linear-gradient(to bottom right, #6e4aff, #9575ff)',
      shadowColor: 'rgba(102, 16, 242, 0.3)'
    },
  ];

  const styles = {
    container: {
      padding: '1rem 1rem 1.25rem 1rem',
      backgroundColor: '#ffffff',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
    },
    actionItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    iconContainer: (gradient, shadowColor, isHovered) => ({
      background: gradient,
      padding: '1.25rem',
      borderRadius: '1.5rem',
      marginBottom: '0.75rem',
      boxShadow: isHovered 
        ? `0 20px 25px -5px ${shadowColor}, 0 10px 10px -5px ${shadowColor}`
        : `0 10px 15px -3px ${shadowColor}, 0 4px 6px -2px ${shadowColor}`,
      transition: 'all 0.2s ease-in-out',
      transform: isHovered ? 'translateY(-5px) scale(1.05)' : 'translateY(0) scale(1)',
    }),
    icon: {
      width: '2rem',
      height: '2rem',
      color: '#ffffff',
    },
    label: {
      fontSize: '0.875rem',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.95 }}
            style={styles.actionItem}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div style={styles.iconContainer(action.gradient, action.shadowColor, hoveredIndex === index)}>
              <action.icon style={styles.icon} />
            </div>
            <span style={styles.label}>{action.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
