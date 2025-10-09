import { useState } from 'react';
import { Star, Clock, MapPin, Heart, Share2, ChevronRight, ChevronLeft, Play, Volume2, Eye, UserPlus, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import theme from '../../../styles/theme';

export default function RestaurantDetail({
  name,
  image,
  rating,
  distance,
  time,
  promotion,
  tags,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('videos');
  const [isFollowing, setIsFollowing] = useState(false);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: theme.colors.white,
      display: 'flex',
      flexDirection: 'column',
    },
    headerImage: {
      position: 'relative',
    },
    headerImg: {
      width: '100%',
      height: '16rem', // increased from h-64 for better mobile visibility
      objectFit: 'cover',
    },
    backButton: {
      position: 'absolute',
      top: theme.spacing.lg,
      left: theme.spacing.lg,
      backgroundColor: theme.colors.whiteAlpha(0.9),
      backdropFilter: 'blur(8px)',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      boxShadow: theme.shadow.lg,
      border: 'none',
      cursor: 'pointer',
    },
    backIcon: {
      width: '1.5rem',
      height: '1.5rem',
    },
    promotionBadge: {
      position: 'absolute',
      bottom: theme.spacing.lg,
      left: theme.spacing.lg,
      backgroundColor: theme.colors.primary,
      color: theme.colors.text.white,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.xl,
      boxShadow: theme.shadow.lg,
    },
    scrollableContent: {
      flex: 1,
      overflowY: 'auto',
    },
    restaurantInfo: {
      padding: theme.spacing.lg,
      borderBottom: `1px solid ${theme.colors.borderLight}`,
    },
    infoHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    restaurantName: {
      marginBottom: theme.spacing.sm,
      fontSize: theme.fontSize['3xl'],  // increased from 2xl
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    tag: {
      fontSize: theme.fontSize.sm,  // increased from xs
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,  // increased padding
      backgroundColor: theme.colors.backgroundGray,
      borderRadius: theme.borderRadius.full,
      color: theme.colors.text.secondary,
    },
    actionButtons: {
      display: 'flex',
      gap: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.backgroundGray,
      borderRadius: theme.borderRadius.full,
      border: 'none',
      cursor: 'pointer',
    },
    actionIcon: {
      width: '1.5rem',  // increased from 1.25rem
      height: '1.5rem',  // increased from 1.25rem
    },
    statsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.lg,
      fontSize: theme.fontSize.base,  // increased from sm
      marginBottom: theme.spacing.lg,
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',  // increased gap
    },
    starIcon: {
      width: '1.25rem',  // increased from 1rem
      height: '1.25rem',  // increased from 1rem
      fill: '#fbbf24',
      color: '#fbbf24',
    },
    ratingText: {
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
    ratingCount: {
      color: theme.colors.text.secondary,
    },
    separator: {
      color: theme.colors.border,
    },
    locationIcon: {
      width: '1.25rem',  // increased from 1rem
      height: '1.25rem',  // increased from 1rem
      color: theme.colors.text.secondary,
    },
    timeIcon: {
      width: '1.25rem',  // increased from 1rem
      height: '1.25rem',  // increased from 1rem
      color: theme.colors.text.secondary,
    },
    followButton: {
      width: '100%',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      transition: `all ${theme.transition.fast}`,
      ...(isFollowing ? {
        backgroundColor: theme.colors.backgroundGray,
        color: theme.colors.text.primary,
        border: `2px solid ${theme.colors.border}`,
      } : {
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
        color: theme.colors.text.white,
        boxShadow: theme.shadow.lg,
      }),
    },
    followIcon: {
      width: '1.5rem',  // increased from 1.25rem
      height: '1.5rem',  // increased from 1.25rem
    },
    promoBanner: {
      padding: theme.spacing.lg,
      background: 'linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%)',
      borderBottom: `1px solid ${theme.colors.borderLight}`,
    },
    promoContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    promoLeft: {
      flex: 1,
    },
    promoHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: '0.375rem',  // increased from 0.25rem
    },
    promoBadge: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.text.white,
      fontSize: theme.fontSize.sm,  // increased from xs
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,  // increased padding
      borderRadius: theme.borderRadius.sm,
      fontWeight: '600',
    },
    promoTitle: {
      fontSize: theme.fontSize.base,  // increased from sm
      fontWeight: '500',
    },
    promoDescription: {
      fontSize: theme.fontSize.base,  // increased from sm
      color: theme.colors.text.secondary,
      fontWeight: '500',
    },
    promoArrow: {
      width: '1.5rem',  // increased from 1.25rem
      height: '1.5rem',  // increased from 1.25rem
      color: theme.colors.text.light,
    },
    tabsContainer: {
      width: '100%',
    },
    tabsList: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backgroundColor: theme.colors.white,
      borderBottom: `1px solid ${theme.colors.borderLight}`,
    },
    tabTrigger: {
      padding: theme.spacing.lg,
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      fontSize: theme.fontSize.lg,  // increased from base
      transition: `all ${theme.transition.fast}`,
      fontWeight: '500',
    },
    activeTab: {
      borderBottom: `2px solid ${theme.colors.primary}`,
      color: theme.colors.primary,
    },
    tabContent: {
      padding: theme.spacing.lg,
    },
    videosGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing.md,
    },
    videoCard: {
      position: 'relative',
      aspectRatio: '9/16',
      borderRadius: theme.borderRadius['2xl'],
      overflow: 'hidden',
      backgroundColor: theme.colors.backgroundGray,
      cursor: 'pointer',
    },
    videoThumbnail: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    videoOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%, transparent 100%)',
    },
    playButton: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playButtonInner: {
      backgroundColor: theme.colors.whiteAlpha(0.2),
      backdropFilter: 'blur(8px)',
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.full,
    },
    playIcon: {
      width: '2.5rem',  // increased from 2rem
      height: '2.5rem',  // increased from 2rem
      color: theme.colors.white,
      fill: theme.colors.white,
    },
    videoDuration: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      backgroundColor: theme.colors.blackAlpha(0.6),
      backdropFilter: 'blur(8px)',
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,  // increased padding
      borderRadius: theme.borderRadius.lg,
      color: theme.colors.white,
      fontSize: theme.fontSize.sm,  // increased from xs
      fontWeight: '500',
    },
    videoInfo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: theme.spacing.md,
      color: theme.colors.white,
    },
    videoTitle: {
      fontSize: theme.fontSize.base,  // increased from sm
      marginBottom: theme.spacing.sm,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      fontWeight: '500',
    },
    videoStats: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
      fontSize: theme.fontSize.sm,  // increased from xs
    },
    statItemSmall: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',  // increased gap
    },
    eyeIcon: {
      width: '1rem',  // increased from 0.75rem
      height: '1rem',  // increased from 0.75rem
    },
    heartIconSmall: {
      width: '1rem',  // increased from 0.75rem
      height: '1rem',  // increased from 0.75rem
    },
    menuContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing['2xl'],
    },
    menuCategory: {
      // Container for each category
    },
    categoryHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    categoryTitle: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.xl,  // increased from lg
      fontWeight: '600',
    },
    categoryDivider: {
      flex: 1,
      height: '1px',
      background: `linear-gradient(90deg, ${theme.colors.primary}30 0%, transparent 100%)`,
    },
    menuItems: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.lg,
    },
    menuItem: {
      display: 'flex',
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      borderBottom: `1px solid ${theme.colors.borderLight}`,
    },
    menuItemImage: {
      width: '7rem',  // increased from 6rem
      height: '7rem',  // increased from 6rem
      objectFit: 'cover',
      borderRadius: theme.borderRadius.xl,
      flexShrink: 0,
    },
    menuItemContent: {
      flex: 1,
    },
    menuItemTitle: {
      marginBottom: '0.375rem',
      fontSize: theme.fontSize.lg,  // increased from base
      fontWeight: '600',  // increased weight
      color: theme.colors.text.primary,
    },
    menuItemDescription: {
      fontSize: theme.fontSize.base,  // increased from sm
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.sm,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    menuItemPrice: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    price: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.lg,  // increased from base
      fontWeight: '700',  // increased weight
    },
    originalPrice: {
      fontSize: theme.fontSize.base,  // increased from sm
      color: theme.colors.text.light,
      textDecoration: 'line-through',
    },
    addButton: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.white,
      border: `2px solid ${theme.colors.primary}`,
      color: theme.colors.primary,
      width: '2.5rem',  // increased from 2rem
      height: '2.5rem',  // increased from 2rem
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: theme.fontSize.xl,  // increased from lg
      fontWeight: 'bold',
    },
    bottomBar: {
      padding: theme.spacing.lg,
      borderTop: `1px solid ${theme.colors.borderLight}`,
      backgroundColor: theme.colors.white,
      boxShadow: theme.shadow.lg,
    },
    bottomButtons: {
      display: 'flex',
      gap: theme.spacing.md,
    },
    addItemButton: {
      flex: 1,
      padding: theme.spacing.md,
      border: `2px solid ${theme.colors.primary}`,
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      cursor: 'pointer',
      fontSize: theme.fontSize.lg,  // increased from base
      fontWeight: '600',  // increased weight
      transition: `all ${theme.transition.fast}`,
    },
    orderButton: {
      flex: 1,
      padding: theme.spacing.md,
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
      color: theme.colors.text.white,
      border: 'none',
      borderRadius: theme.borderRadius.xl,
      cursor: 'pointer',
      fontSize: theme.fontSize.lg,  // increased from base
      fontWeight: '600',  // increased weight
      boxShadow: theme.shadow.lg,
      transition: `all ${theme.transition.fast}`,
    },
  };

  const videos = [
    {
      id: 1,
      thumbnail: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwc291cHxlbnwxfHx8fDE3NTk5NzAxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Phở bò đặc biệt',
      views: '12K',
      likes: '890',
      duration: '0:45',
    },
    {
      id: 2,
      thumbnail: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwY29va2luZyUyMHZpZGVvfGVufDF8fHx8MTc1OTk3OTYyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Cách nấu phở chuẩn vị',
      views: '25K',
      likes: '1.5K',
      duration: '1:20',
    },
    {
      id: 3,
      thumbnail: 'https://images.unsplash.com/photo-1715924298872-9a86b729eb96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcHJlcGFyaW5nJTIwZGlzaHxlbnwxfHx8fDE3NTk5Nzk2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Bún chả Hà Nội',
      views: '8.5K',
      likes: '620',
      duration: '0:55',
    },
    {
      id: 4,
      thumbnail: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGZvb2R8ZW58MXx8fHwxNzU5OTc5NjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Combo đặc biệt',
      views: '18K',
      likes: '1.2K',
      duration: '1:05',
    },
  ];

  const menuCategories = [
    {
      id: 1,
      name: 'Combo Tiết Kiệm',
      items: [
        {
          id: 1,
          name: 'Combo 1 Người',
          price: '89.000đ',
          originalPrice: '120.000đ',
          image: image,
          description: 'Phở + Nước ngọt + Gỏi cuốn',
        },
        {
          id: 2,
          name: 'Combo 2 Người',
          price: '169.000đ',
          originalPrice: '220.000đ',
          image: image,
          description: '2 Phở + 2 Nước ngọt + Nem rán',
        },
      ],
    },
    {
      id: 2,
      name: 'Món Chính',
      items: [
        {
          id: 3,
          name: 'Phở Bò Đặc Biệt',
          price: '75.000đ',
          image: image,
          description: 'Phở bò tái, nạm, gầu, sách',
        },
        {
          id: 4,
          name: 'Phở Gà',
          price: '65.000đ',
          image: image,
          description: 'Phở gà thơm ngon',
        },
        {
          id: 5,
          name: 'Bún Chả Hà Nội',
          price: '70.000đ',
          image: image,
          description: 'Bún chả truyền thống',
        },
      ],
    },
    {
      id: 3,
      name: 'Món Phụ',
      items: [
        {
          id: 6,
          name: 'Gỏi Cuốn',
          price: '35.000đ',
          image: image,
          description: '3 cuốn tươi ngon',
        },
        {
          id: 7,
          name: 'Nem Rán',
          price: '40.000đ',
          image: image,
          description: '5 nem giòn rụm',
        },
      ],
    },
    {
      id: 4,
      name: 'Đồ Uống',
      items: [
        {
          id: 8,
          name: 'Nước Ngọt',
          price: '15.000đ',
          image: image,
          description: 'Coca, Pepsi, 7Up',
        },
        {
          id: 9,
          name: 'Trà Đá',
          price: '10.000đ',
          image: image,
          description: 'Trà đá tự nhiên',
        },
      ],
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header Image */}
      <div style={styles.headerImage}>
        <img
          src={image}
          alt={name}
          style={styles.headerImg}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={styles.backButton}
        >
          <ChevronLeft style={styles.backIcon} />
        </motion.button>
        
        {promotion && (
          <div style={styles.promotionBadge}>{promotion}</div>
        )}
      </div>

      {/* Scrollable Content */}
      <div style={styles.scrollableContent}>
        {/* Restaurant Info */}
        <div style={styles.restaurantInfo}>
          <div style={styles.infoHeader}>
            <div style={{ flex: 1 }}>
              <h1 style={styles.restaurantName}>{name}</h1>
              <div style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    style={styles.tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={styles.actionButtons}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={styles.actionButton}
              >
                <Heart style={styles.actionIcon} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={styles.actionButton}
              >
                <Share2 style={styles.actionIcon} />
              </motion.button>
            </div>
          </div>

          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <Star style={styles.starIcon} />
              <span style={styles.ratingText}>{rating}</span>
              <span style={styles.ratingCount}>(999+)</span>
            </div>
            <span style={styles.separator}>•</span>
            <div style={styles.statItem}>
              <MapPin style={styles.locationIcon} />
              <span>{distance}</span>
            </div>
            <span style={styles.separator}>•</span>
            <div style={styles.statItem}>
              <Clock style={styles.timeIcon} />
              <span>{time}</span>
            </div>
          </div>

          {/* Follow Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFollowing(!isFollowing)}
            style={styles.followButton}
          >
            <AnimatePresence mode="wait">
              {isFollowing ? (
                <motion.div
                  key="following"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}
                >
                  <UserCheck style={styles.followIcon} />
                  <span>Đã theo dõi</span>
                </motion.div>
              ) : (
                <motion.div
                  key="follow"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}
                >
                  <UserPlus style={styles.followIcon} />
                  <span>Theo dõi cửa hàng</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Promo Banner */}
        <div style={styles.promoBanner}>
          <div style={styles.promoContent}>
            <div style={styles.promoLeft}>
              <div style={styles.promoHeader}>
                <span style={styles.promoBadge}>KHUYẾN MÃI</span>
                <span style={styles.promoTitle}>Ưu đãi đặc biệt</span>
              </div>
              <p style={styles.promoDescription}>Giảm đến 50% cho đơn từ 99K</p>
            </div>
            <ChevronRight style={styles.promoArrow} />
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabsList}>
            <button
              style={{
                ...styles.tabTrigger,
                ...(activeTab === 'videos' ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab('videos')}
            >
              Video
            </button>
            <button
              style={{
                ...styles.tabTrigger,
                ...(activeTab === 'menu' ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab('menu')}
            >
              Thực đơn
            </button>
          </div>

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div style={styles.tabContent}>
              <div style={styles.videosGrid}>
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={styles.videoCard}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={styles.videoThumbnail}
                    />
                    
                    {/* Gradient overlay */}
                    <div style={styles.videoOverlay} />
                    
                    {/* Play button */}
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      style={styles.playButton}
                    >
                      <div style={styles.playButtonInner}>
                        <Play style={styles.playIcon} />
                      </div>
                    </motion.div>

                    {/* Duration */}
                    <div style={styles.videoDuration}>
                      {video.duration}
                    </div>

                    {/* Video info */}
                    <div style={styles.videoInfo}>
                      <p style={styles.videoTitle}>{video.title}</p>
                      <div style={styles.videoStats}>
                        <div style={styles.statItemSmall}>
                          <Eye style={styles.eyeIcon} />
                          <span>{video.views}</span>
                        </div>
                        <div style={styles.statItemSmall}>
                          <Heart style={styles.heartIconSmall} />
                          <span>{video.likes}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div style={styles.tabContent}>
              <div style={styles.menuContainer}>
                {menuCategories.map((category) => (
                  <div key={category.id} style={styles.menuCategory}>
                    <div style={styles.categoryHeader}>
                      <h2 style={styles.categoryTitle}>{category.name}</h2>
                      <div style={styles.categoryDivider} />
                    </div>
                    
                    <div style={styles.menuItems}>
                      {category.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          style={styles.menuItem}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={styles.menuItemImage}
                          />
                          <div style={styles.menuItemContent}>
                            <h3 style={styles.menuItemTitle}>{item.name}</h3>
                            <p style={styles.menuItemDescription}>
                              {item.description}
                            </p>
                            <div style={styles.menuItemPrice}>
                              <span style={styles.price}>{item.price}</span>
                              {item.originalPrice && (
                                <span style={styles.originalPrice}>
                                  {item.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={styles.addButton}
                          >
                            +
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomButtons}>
          <button style={styles.addItemButton}>
            Thêm món
          </button>
          <button style={styles.orderButton}>
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
}
