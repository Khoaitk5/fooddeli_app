import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import FoodCard from './FoodCard';
import RestaurantCard from './RestaurantCard';
import theme from '../../../styles/theme';

export default function SearchResults({
  searchQuery,
  onClose,
  allFoods,
  allRestaurants,
  onFoodClick,
  onRestaurantClick,
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter results based on search query
  const filteredFoods = allFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRestaurants = allRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalResults = filteredFoods.length + filteredRestaurants.length;

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      paddingBottom: '6rem',
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: theme.colors.white,
      borderBottom: `1px solid ${theme.colors.borderLight}`,
      boxShadow: theme.shadow.sm,
    },
    headerContent: {
      padding: `${theme.spacing.lg} ${theme.spacing.lg}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flex: 1,
    },
    headerTitleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    closeButton: {
      padding: theme.spacing.md,
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: theme.borderRadius.full,
      cursor: 'pointer',
      transition: `all ${theme.transition.fast}`,
    },
    closeButtonHover: {
      backgroundColor: theme.colors.backgroundLight,
    },
    headerText: {
      fontSize: theme.fontSize.xl, // increased from lg
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: '0.25rem',
    },
    headerSubtitle: {
      fontSize: theme.fontSize.base, // increased from sm
      color: theme.colors.text.secondary,
    },
    filterButton: {
      padding: theme.spacing.md,
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: theme.borderRadius.full,
      cursor: 'pointer',
      transition: `all ${theme.transition.fast}`,
    },
    filterTabs: {
      padding: `0 ${theme.spacing.lg} ${theme.spacing.md}`,
      display: 'flex',
      gap: theme.spacing.md,
      overflowX: 'auto',
    },
    tabButton: {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.full,
      fontSize: theme.fontSize.base, // increased from sm
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: `all ${theme.transition.fast}`,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    tabButtonActive: {
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
      color: theme.colors.text.white,
    },
    tabButtonInactive: {
      backgroundColor: theme.colors.backgroundLight,
      color: theme.colors.text.secondary,
    },
    resultsContainer: {
      padding: `${theme.spacing.lg} ${theme.spacing.lg}`,
    },
    noResults: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '5rem',
    },
    noResultsIcon: {
      width: '8rem',
      height: '8rem',
      backgroundColor: theme.colors.backgroundLight,
      borderRadius: theme.borderRadius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    noResultsEmoji: {
      fontSize: '4rem',
    },
    noResultsTitle: {
      fontSize: theme.fontSize.xl, // increased from lg
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    noResultsText: {
      fontSize: theme.fontSize.base, // increased from sm
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    section: {
      marginBottom: theme.spacing['2xl'],
    },
    sectionTitle: {
      marginBottom: theme.spacing.lg,
      fontSize: theme.fontSize.lg, // increased from base
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    foodList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.lg,
    },
    restaurantGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: theme.spacing.lg,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.headerTitleSection}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={styles.closeButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.backgroundLight}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <X style={{ width: '1.5rem', height: '1.5rem', color: theme.colors.text.primary }} />
              </motion.button>
              <div>
                <h2 style={styles.headerText}>Kết quả tìm kiếm</h2>
                <p style={styles.headerSubtitle}>
                  "{searchQuery}" - {totalResults} kết quả
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            style={styles.filterButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.backgroundLight}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <SlidersHorizontal style={{ width: '1.5rem', height: '1.5rem', color: theme.colors.text.primary }} />
          </motion.button>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterTabs}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('all')}
            style={{
              ...styles.tabButton,
              ...(activeFilter === 'all' ? styles.tabButtonActive : styles.tabButtonInactive)
            }}
          >
            Tất cả ({totalResults})
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('food')}
            style={{
              ...styles.tabButton,
              ...(activeFilter === 'food' ? styles.tabButtonActive : styles.tabButtonInactive)
            }}
          >
            Món ăn ({filteredFoods.length})
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter('restaurant')}
            style={{
              ...styles.tabButton,
              ...(activeFilter === 'restaurant' ? styles.tabButtonActive : styles.tabButtonInactive)
            }}
          >
            Quán ăn ({filteredRestaurants.length})
          </motion.button>
        </div>
      </div>

      {/* Results */}
      <div style={styles.resultsContainer}>
        {totalResults === 0 ? (
          <div style={styles.noResults}>
            <div style={styles.noResultsIcon}>
              <span style={styles.noResultsEmoji}>🔍</span>
            </div>
            <h3 style={styles.noResultsTitle}>Không tìm thấy kết quả</h3>
            <p style={styles.noResultsText}>
              Thử tìm kiếm với từ khóa khác hoặc<br />
              khám phá các món ăn phổ biến
            </p>
          </div>
        ) : (
          <>
            {/* Food Results */}
            {(activeFilter === 'all' || activeFilter === 'food') && filteredFoods.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Món ăn</h3>
                <div style={styles.foodList}>
                  {filteredFoods.map((food) => (
                    <FoodCard key={food.id} {...food} onClick={() => onFoodClick(food)} />
                  ))}
                </div>
              </div>
            )}

            {/* Restaurant Results */}
            {(activeFilter === 'all' || activeFilter === 'restaurant') && filteredRestaurants.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Quán ăn</h3>
                <div style={styles.restaurantGrid}>
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      {...restaurant}
                      onClick={() => onRestaurantClick(restaurant)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
