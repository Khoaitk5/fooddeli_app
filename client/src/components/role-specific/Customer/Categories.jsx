import theme from '../../../styles/theme';
import { useState } from 'react';

export default function Categories() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const categories = [
    { 
      name: 'Quán ăn', 
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3NTk5MTQ1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      bgColor: '#fff7ed'
    },
    { 
      name: 'Cà phê', 
      image: 'https://images.unsplash.com/photo-1533776992670-a72f4c28235e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXB8ZW58MXx8fHwxNzU5ODk1MDM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      bgColor: '#fefce8'
    },
    { 
      name: 'Trà sữa', 
      image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWF8ZW58MXx8fHwxNzU5OTQzMDYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      bgColor: '#fce7f3'
    },
    { 
      name: 'Món Việt', 
      image: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvfGVufDF8fHx8MTc1OTk3OTAzOXww&ixlib=rb-4.1.0&q=80&w=1080',
      bgColor: '#fee2e2'
    },
    { 
      name: 'Lẩu', 
      image: 'https://images.unsplash.com/photo-1611345157614-26d3bdd10c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3QlMjBwb3R8ZW58MXx8fHwxNzU5OTc5MDM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      bgColor: '#fef9c3'
    },
    { 
      name: 'Món Á', 
      image: 'https://images.unsplash.com/photo-1536540166989-ad5334cee5f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG5vb2RsZXN8ZW58MXx8fHwxNzU5OTI5NjkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      bgColor: '#dcfce7'
    },
    { 
      name: 'Burger', 
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXJ8ZW58MXx8fHwxNzU5OTc5MDQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      bgColor: '#fff7ed'
    },
    { 
      name: 'Pizza', 
      image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlfGVufDF8fHx8MTc1OTg5MzAzMnww&ixlib=rb-4.1.0&q=80&w=1080',
      bgColor: '#fee2e2'
    },
    { 
      name: 'Món Nhật', 
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaXxlbnwxfHx8fDE3NTk5NzkwNDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      bgColor: '#dbeafe'
    },
    { 
      name: 'Kem', 
      image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2UlMjBjcmVhbXxlbnwxfHx8fDE3NTk5NTE3NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      bgColor: '#f3e8ff'
    },
  ];

  const styles = {
    container: {
      padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
      background: 'linear-gradient(to bottom, #ffffff, #f9fafb80)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: '500',
      color: theme.colors.text.primary,
    },
    viewAllButton: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.sm,
      backgroundColor: '#fff7ed',
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.xl,
      border: 'none',
      cursor: 'pointer',
      transition: `background-color ${theme.transition.fast}`,
    },
    scrollContainer: {
      display: 'flex',
      gap: theme.spacing.xl,
      overflowX: 'auto',
      paddingBottom: theme.spacing.sm,
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },
    categoryItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing.md,
      minWidth: '5.5rem',
      cursor: 'pointer',
    },
    iconContainer: (bgColor, isHovered) => ({
      width: '5rem',
      height: '5rem',
      backgroundColor: bgColor,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: isHovered ? theme.shadow.xl : theme.shadow.lg,
      padding: '0.65rem',
      border: `2px solid ${theme.colors.white}`,
      transition: `all ${theme.transition.normal}`,
      transform: isHovered ? 'translateY(-0.5rem) scale(1.08)' : 'translateY(0) scale(1)',
    }),
    categoryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
    },
    categoryName: (isHovered) => ({
      fontSize: theme.fontSize.xs,
      textAlign: 'center',
      color: isHovered ? theme.colors.primary : theme.colors.text.primary,
      transition: `color ${theme.transition.fast}`,
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Danh mục</h2>
        <button 
          style={styles.viewAllButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#fed7aa'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#fff7ed'}
        >
          Xem tất cả
        </button>
      </div>
      
      <div 
        style={styles.scrollContainer}
        onScroll={(e) => {
          e.target.style.scrollbarWidth = 'none';
        }}
      >
        {categories.map((category, index) => (
          <div
            key={index}
            style={styles.categoryItem}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div style={styles.iconContainer(category.bgColor, hoveredIndex === index)}>
              <img
                src={category.image}
                alt={category.name}
                style={styles.categoryImage}
              />
            </div>
            <span style={styles.categoryName(hoveredIndex === index)}>
              {category.name}
            </span>
          </div>
        ))}
      </div>
      
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
