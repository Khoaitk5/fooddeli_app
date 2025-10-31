import { useState } from 'react';
import { useNavigate } from 'react-router-dom';// mới thêm
import Header from '@/components/role-specific/Customer/Header';
import BannerCarousel from '@/components/role-specific/Customer/BannerCarousel';
import Categories from '@/components/role-specific/Customer/Categories';
import RestaurantCard from '@/components/role-specific/Customer/RestaurantCard';
import RestaurantDetail from '@/components/role-specific/Customer/RestaurantDetail';
import FoodCard from '@/components/role-specific/Customer/FoodCard';
import FoodDetail from '@/components/role-specific/Customer/FoodDetail';
import SearchResults from '@/components/role-specific/Customer/SearchResults';
import Navbar from '@/components/shared/Navbar';
import theme from '@/styles/theme';

export default function App() {
  const navigate = useNavigate();// mới thêm 
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const restaurants = [
    {
      id: 1,
      name: 'Phở Hà Nội - Truyền Thống',
      image: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwc291cHxlbnwxfHx8fDE3NTk5NzAxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      distance: '1.2 km',
      time: '15-25 phút',
      promotion: 'Giảm 30K',
      tags: ['Phở', 'Món Việt', 'Freeship'],
    },
    {
      id: 2,
      name: 'Trà Sữa TocoToco - Premium',
      image: 'https://images.unsplash.com/photo-1670468642364-6cacadfb7bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBkcmlua3xlbnwxfHx8fDE3NTk5MDE2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      distance: '0.8 km',
      time: '10-20 phút',
      promotion: 'Mua 1 tặng 1',
      tags: ['Trà sữa', 'Đồ uống'],
    },
    {
      id: 3,
      name: 'The Coffee House',
      image: 'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjYWZlfGVufDF8fHx8MTc1OTk3Njk5MXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      distance: '2.1 km',
      time: '20-30 phút',
      tags: ['Cà phê', 'Đồ uống', 'Freeship'],
    },
    {
      id: 4,
      name: 'Burger King - Chi nhánh Quận 5',
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXN0JTIwZm9vZCUyMGJ1cmdlcnxlbnwxfHx8fDE3NTk5NzE2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      distance: '1.5 km',
      time: '25-35 phút',
      promotion: 'Giảm 50K',
      tags: ['Burger', 'Fast Food'],
    },
    {
      id: 5,
      name: 'Pizza 4Ps - Nguyễn Văn Cừ',
      image: 'https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5OTYzNjk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      distance: '2.5 km',
      time: '30-40 phút',
      tags: ['Pizza', 'Ý', 'Freeship'],
    },
    {
      id: 6,
      name: 'Sushi Hokkaido Sachi',
      image: 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGphcGFuZXNlJTIwZm9vZHxlbnwxfHx8fDE3NTk4OTQ4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      distance: '1.8 km',
      time: '20-30 phút',
      promotion: 'Giảm 20%',
      tags: ['Sushi', 'Nhật Bản'],
    },
    {
      id: 7,
      name: 'Quán Ăn Đường Phố - Món Việt',
      image: 'https://images.unsplash.com/photo-1734069951523-0a0c216cd394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHN0cmVldCUyMGZvb2R8ZW58MXx8fHwxNzU5OTA0NDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.5,
      distance: '0.5 km',
      time: '10-15 phút',
      promotion: 'Freeship 0đ',
      tags: ['Món Việt', 'Đường phố'],
    },
    {
      id: 8,
      name: 'Nhà Hàng Món Huế - Cơm Hến',
      image: 'https://images.unsplash.com/photo-1735816415191-a7a4c5c100ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5OTQ0MjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      distance: '3.2 km',
      time: '35-45 phút',
      tags: ['Món Huế', 'Món Việt', 'Freeship'],
    },
  ];

  const foods = [
    {
      id: 1,
      name: 'Bánh Mì Thịt Nướng',
      image: 'https://images.unsplash.com/photo-1715924298872-9a86b729eb96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5oJTIwbWklMjBzYW5kd2ljaHxlbnwxfHx8fDE3NTk5NzAxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: '25.000đ',
      originalPrice: '35.000đ',
      rating: 4.8,
      restaurant: 'Bánh Mì Hòa Mã',
      distance: '0.5 km',
      promotion: '-30%',
    },
    {
      id: 2,
      name: 'Phở Bò Tái',
      image: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBib3dsfGVufDF8fHx8MTc1OTk3OTYyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      price: '45.000đ',
      rating: 4.9,
      restaurant: 'Phở Hà Nội',
      distance: '1.2 km',
    },
    {
      id: 3,
      name: 'Bún Chả Hà Nội',
      image: 'https://images.unsplash.com/photo-1715168438603-4dc3452f2f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidW4lMjBjaGElMjB2aWV0bmFtZXNlfGVufDF8fHx8MTc1OTk3OTYyMXww&ixlib=rb-4.1.0&q=80&w=1080',
      price: '50.000đ',
      originalPrice: '65.000đ',
      rating: 4.7,
      restaurant: 'Bún Chả 34',
      distance: '2.1 km',
      promotion: 'Giảm 15K',
    },
    {
      id: 4,
      name: 'Cơm Tấm Sườn Bì',
      image: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb20lMjB0YW0lMjByaWNlfGVufDF8fHx8MTc1OTk3OTYyMXww&ixlib=rb-4.1.0&q=80&w=1080',
      price: '40.000đ',
      rating: 4.6,
      restaurant: 'Cơm Tấm Mợ Tư',
      distance: '0.8 km',
    },
    {
      id: 5,
      name: 'Gỏi Cuốn Tôm Thịt',
      image: 'https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xsc3xlbnwxfHx8fDE3NTk5NzQxNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: '30.000đ',
      rating: 4.8,
      restaurant: 'Nem Nướng Nha Trang',
      distance: '1.5 km',
    },
    {
      id: 6,
      name: 'Gà Rán Giòn',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGNoaWNrZW58ZW58MXx8fHwxNzU5OTMxNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: '55.000đ',
      originalPrice: '75.000đ',
      rating: 4.7,
      restaurant: 'Texas Chicken',
      distance: '2.3 km',
      promotion: 'Giảm 20K',
    },
    {
      id: 7,
      name: 'Trà Sữa Trân Châu',
      image: 'https://images.unsplash.com/photo-1670468642364-6cacadfb7bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBkcmlua3xlbnwxfHx8fDE3NTk5MDE2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: '35.000đ',
      rating: 4.9,
      restaurant: 'TocoToco',
      distance: '0.8 km',
    },
    {
      id: 8,
      name: 'Bún Bò Huế',
      image: 'https://images.unsplash.com/photo-1679310289744-ac822d59cb0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwbm9vZGxlc3xlbnwxfHx8fDE3NTk5Nzk2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: '48.000đ',
      rating: 4.8,
      restaurant: 'Món Huế',
      distance: '3.2 km',
    },
  ];

  const deals = [
    {
      id: 1,
      name: 'Phở 24 - Deal Sốc',
      image: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwc291cHxlbnwxfHx8fDE3NTk5NzAxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      distance: '1.5 km',
      time: '20-30 phút',
      promotion: 'Giảm 50%',
      tags: ['Freeship'],
    },
    {
      id: 2,
      name: 'Gong Cha - Flash Sale',
      image: 'https://images.unsplash.com/photo-1670468642364-6cacadfb7bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBkcmlua3xlbnwxfHx8fDE3NTk5MDE2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      distance: '0.9 km',
      time: '15-20 phút',
      promotion: '1+1',
      tags: ['Hot Deal'],
    },
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)',
    },
    content: {
      paddingBottom: '6rem',
    },
    section: {
      padding: `${theme.spacing['2xl']} ${theme.spacing.lg}`,
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    iconBox: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius['2xl'],
      boxShadow: theme.shadow.lg,
    },
    sectionInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text.secondary,
    },
    viewAllButton: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      background: '#fff5f3',
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.xl,
      border: 'none',
      cursor: 'pointer',
      transition: `all ${theme.transition.fast}`,
    },
    foodGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: theme.spacing.md,
    },
    restaurantGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: theme.spacing.lg,
    },
    dealsContainer: {
      display: 'flex',
      gap: theme.spacing.xl,
      overflowX: 'auto',
      paddingBottom: theme.spacing.md,
    },
    dealCard: {
      minWidth: '280px',  // reduced from 300px for better mobile fit
    },
  };

  // If search is active, show search results
   return (
    <div style={styles.container}>
      <Header
        onSearch={(term) => {
          if (term.trim()) {
            navigate(`/customer/search-results?query=${encodeURIComponent(term)}`);
          }
        }}
      />

      <div style={styles.content}>
        <BannerCarousel />
        <Categories />

        {/* Popular Foods Section */}
        <div
          style={{
            ...styles.section,
            background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255, 92, 57, 0.05) 100%)',
          }}
        >
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>
              <div
                style={{
                  ...styles.iconBox,
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                }}
              >
                <svg
                  style={{ width: '1.5rem', height: '1.5rem', color: theme.colors.text.white }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
              </div>
              <div style={styles.sectionInfo}>
                <h2>Món Ăn Phổ Biến</h2>
                <p style={styles.subtitle}>Được yêu thích nhất</p>
              </div>
            </div>
            <button style={styles.viewAllButton}>Xem tất cả</button>
          </div>

          <div style={styles.foodGrid}>
            {foods.map((food) => (
              <FoodCard key={food.id} {...food} onClick={() => setSelectedFood(food)} />
            ))}
          </div>
        </div>

        {/* Deals Section */}
        <div
          style={{
            ...styles.section,
            background: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 50%, #fefce8 100%)',
          }}
        >
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>
              <div
                style={{
                  ...styles.iconBox,
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                }}
              >
                <svg
                  style={{ width: '1.5rem', height: '1.5rem', color: theme.colors.text.white }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div style={styles.sectionInfo}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  Deal Hời Hôm Nay
                  <span
                    style={{
                      fontSize: theme.fontSize.sm,
                      background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                      color: theme.colors.text.white,
                      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                      borderRadius: theme.borderRadius.full,
                      boxShadow: theme.shadow.lg,
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  >
                    HOT
                  </span>
                </h2>
                <p style={styles.subtitle}>Ưu đãi có thời hạn</p>
              </div>
            </div>
          </div>

          <div style={styles.dealsContainer}>
            {deals.map((deal) => (
              <div key={deal.id} style={styles.dealCard}>
                <RestaurantCard {...deal} onClick={() => setSelectedRestaurant(deal)} />
              </div>
            ))}
          </div>
        </div>

        {/* Main Restaurants Section */}
        <div
          style={{
            ...styles.section,
            background: 'linear-gradient(to bottom, #ffffff 0%, rgba(168, 85, 247, 0.05) 100%)',
          }}
        >
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>
              <div
                style={{
                  ...styles.iconBox,
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                }}
              >
                <svg
                  style={{ width: '1.5rem', height: '1.5rem', color: theme.colors.text.white }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div style={styles.sectionInfo}>
                <h2>Gợi ý cho bạn</h2>
                <p style={styles.subtitle}>Dựa trên sở thích của bạn</p>
              </div>
            </div>
            <button style={styles.viewAllButton}>Xem tất cả</button>
          </div>

          <div style={styles.restaurantGrid}>
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                {...restaurant}
                onClick={() => setSelectedRestaurant(restaurant)}
              />
            ))}
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
}