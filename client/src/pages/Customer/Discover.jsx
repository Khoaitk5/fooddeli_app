import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import theme from '@/styles/theme';
import { getCompleteProducts } from '@/api/productApi';

const ASSETS = {
  heroBanner: 'https://www.figma.com/api/mcp/asset/4c70f5cf-5013-4f03-addd-ee8181559083',
  categoryFastFood: 'https://www.figma.com/api/mcp/asset/89a6894a-3681-40d5-aa1e-11e326fb0b9c',
  categoryRice: 'https://www.figma.com/api/mcp/asset/1e151a82-c56d-46cf-b266-b8f038cdb725',
  categoryNoodles: 'https://www.figma.com/api/mcp/asset/ad2e7fae-16ce-40d0-8ebf-a8efd959cd73',
  categoryDrinks: 'https://www.figma.com/api/mcp/asset/1003afc1-43d8-44d7-90e6-6030c94c20ff',
  nearbyPhucLong: 'https://www.figma.com/api/mcp/asset/0e348e40-64a9-486a-9d00-47e37dabe248',
  nearbyMaiTea: 'https://www.figma.com/api/mcp/asset/a4ba9c40-3c0f-460c-9233-b53900162a20',
  nearbyKfc: 'https://www.figma.com/api/mcp/asset/2fb1e10e-b0e1-4d68-964c-d5e08dd4cb0b',
};

const categories = [
  {
    id: 'fast-food',
    label: 'Đồ Ăn\nNhanh',
    image: ASSETS.categoryFastFood,
  },
  {
    id: 'rice',
    label: 'Cơm -\nXôi',
    image: ASSETS.categoryRice,
  },
  {
    id: 'noodles',
    label: 'Bún - Phở -\nMỳ',
    image: ASSETS.categoryNoodles,
  },
  {
    id: 'drinks',
    label: 'Trà Sữa -\nCà Phê',
    image: ASSETS.categoryDrinks,
  },
];


const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    fontFamily: theme.fontFamily.primary,
    position: 'relative',
    paddingBottom: '5.5rem',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '18rem',
    background: 'linear-gradient(180deg, #2BCDD2 0%, #ffffff 100%)',
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '420px',
    margin: '0 auto',
    padding: '1.25rem 1.5rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(12px)',
  },
  locationInfo: {
    flex: 1,
    marginLeft: '0.75rem',
    marginRight: '0.75rem',
  },
  locationLabel: {
    color: theme.colors.text.white,
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  locationValue: {
    color: theme.colors.text.white,
    fontSize: '0.95rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  searchBar: {
    backgroundColor: theme.colors.white,
    borderRadius: '20px',
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    boxShadow: '0 10px 30px rgba(43, 205, 210, 0.18)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: theme.colors.text.primary,
    backgroundColor: 'transparent',
  },
  heroCard: {
    width: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: theme.shadow.lg,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoriesRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '1rem',
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    textAlign: 'center',
    color: theme.colors.text.primary,
    fontWeight: 500,
    fontSize: '0.75rem',
    lineHeight: 1.3,
  },
  categoryImageWrapper: {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    backgroundColor: theme.colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 30px rgba(43, 205, 210, 0.18)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: theme.colors.text.primary,
  },
  arrowBtn: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalList: {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto',
    paddingBottom: '0.75rem',
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
    overflowY: 'hidden',
    touchAction: 'pan-x',
    cursor: 'grab',
  },
  card: {
    minWidth: '8.75rem',
    borderRadius: theme.borderRadius['2xl'],
    backgroundColor: theme.colors.white,
    boxShadow: '0 10px 25px rgba(17, 24, 39, 0.08)',
    overflow: 'hidden',
    flexShrink: 0,
    scrollSnapAlign: 'start',
  },
  emptyState: {
    minWidth: '8.75rem',
    borderRadius: theme.borderRadius['2xl'],
    backgroundColor: theme.colors.white,
    boxShadow: '0 10px 25px rgba(17, 24, 39, 0.06)',
    padding: '1.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.text.secondary,
    fontSize: '0.8rem',
    flexShrink: 0,
  },
  cardImage: {
    width: '100%',
    height: '7.75rem',
    objectFit: 'cover',
  },
  cardBody: {
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  cardName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: theme.colors.text.primary,
    lineHeight: 1.3,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.7rem',
    color: theme.colors.text.secondary,
  },
  tealDot: {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    backgroundColor: '#2BCDD2',
  },
};

function BackIcon({ size = 18, color = theme.colors.text.white }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function LocationIcon({ size = 18, color = '#2BCDD2' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SearchIcon({ size = 20, color = '#9CA3AF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ArrowRightIcon({ size = 14, color = theme.colors.text.secondary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ProductCard({ product, onSelect }) {
  const imageSrc = product.image_url || ASSETS.categoryDrinks;
  const formattedPrice = Number.isFinite(Number(product.price))
    ? `${Number(product.price).toLocaleString('vi-VN')}đ`
    : 'Giá chưa cập nhật';

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        ...styles.card,
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <img src={imageSrc} alt={product.name} style={styles.cardImage} />
      <div style={styles.cardBody}>
        <div style={styles.cardName}>{product.name}</div>
        <div style={styles.metaRow}>
          <div style={styles.tealDot} />
          <span>{product.category || 'Danh mục khác'}</span>
        </div>
        <div style={styles.metaRow}>
          <span>{formattedPrice}</span>
        </div>
      </div>
    </button>
  );
}

function CategoryItem({ item }) {
  return (
    <div style={styles.categoryItem}>
      <div style={styles.categoryImageWrapper}>
        <img src={item.image} alt={item.label} style={{ width: '2.75rem', height: '2.75rem', objectFit: 'contain' }} />
      </div>
      {item.label.split('\n').map((line, index) => (
        <span key={`${item.id}-${index}`}>{line}</span>
      ))}
    </div>
  );
}

function useDragScroll() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isPointerDown = false;
    let startX = 0;
    let scrollStart = 0;

    const handlePointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }
      isPointerDown = true;
      startX = event.clientX;
      scrollStart = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
      if (!isPointerDown) return;
      const deltaX = event.clientX - startX;
      el.scrollLeft = scrollStart - deltaX;
      if (Math.abs(deltaX) > 4) {
        event.preventDefault();
      }
    };

    const stopDragging = (event) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      el.style.cursor = 'grab';
      el.releasePointerCapture?.(event.pointerId);
    };

    el.addEventListener('pointerdown', handlePointerDown);
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerup', stopDragging);
    el.addEventListener('pointerleave', stopDragging);
    el.addEventListener('pointercancel', stopDragging);

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerup', stopDragging);
      el.removeEventListener('pointerleave', stopDragging);
      el.removeEventListener('pointercancel', stopDragging);
    };
  }, []);

  return containerRef;
}

function ProductDetail({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const imageSrc = product.image_url || ASSETS.heroBanner;

  const basePrice = Number(product.price) || 0;
  const formattedBasePrice = basePrice > 0 ? `${basePrice.toLocaleString('vi-VN')}đ` : 'Giá chưa cập nhật';
  const formattedTotalPrice = basePrice > 0 ? `${(basePrice * quantity).toLocaleString('vi-VN')}đ` : '—';
  const description = product.description?.trim() ? product.description : 'Món ăn chưa có mô tả.';

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', height: '213px', overflow: 'hidden' }}>
        <img
          src={imageSrc}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1rem',
            width: '2.3rem',
            height: '2.3rem',
            borderRadius: '50%',
            backgroundColor: theme.colors.whiteAlpha(0.8),
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
          }}
        >
          <BackIcon color={theme.colors.text.primary} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '1.5rem', paddingBottom: '8rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0, color: theme.colors.text.primary }}>{product.name}</h1>
            <span style={{ marginTop: '0.35rem', display: 'block', color: theme.colors.text.secondary, fontSize: '0.85rem' }}>Mô tả</span>
          </div>
          <span style={{ color: '#2BCDD2', fontWeight: 700, fontSize: '1.1rem' }}>{formattedBasePrice}</span>
        </div>

        <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: theme.colors.text.primary }}>Thêm lưu ý cho quán</div>
            <div style={{
              backgroundColor: '#f2f2f2',
              borderRadius: '999px',
              padding: '0.1rem 0.65rem',
              fontSize: '0.7rem',
              color: theme.colors.text.primary,
            }}>
              Không bắt buộc
            </div>
          </div>

          <div style={{
            backgroundColor: '#f2f2f2',
            borderRadius: '999px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <InfoIcon />
            <span style={{ fontSize: '0.85rem', color: '#555555' }}>Quán sẽ cố gắng đáp ứng yêu cầu.</span>
          </div>
        </div>

        <p style={{ color: theme.colors.text.secondary, fontSize: '0.9rem', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.white,
          boxShadow: '0 -6px 30px rgba(0,0,0,0.1)',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '1rem 1.5rem 1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: '#2BCDD2', fontWeight: 700, fontSize: '1.1rem' }}>{formattedTotalPrice}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <QuantityButton onClick={handleDecrease} label="-" disabled={quantity === 1} />
            <span style={{ fontWeight: 600, fontSize: '1rem', minWidth: '1.5rem', textAlign: 'center' }}>{quantity}</span>
            <QuantityButton onClick={handleIncrease} label="+" />
          </div>
        </div>
        <button
          type="button"
          style={{
            width: '100%',
            backgroundColor: '#2BCDD2',
            color: theme.colors.white,
            fontWeight: 700,
            fontSize: '1rem',
            padding: '0.85rem',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}

function QuantityButton({ onClick, label, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '2.4rem',
        height: '2.4rem',
        borderRadius: '50%',
        border: '1px solid rgba(0,0,0,0.08)',
        backgroundColor: disabled ? '#f2f2f2' : theme.colors.white,
        color: theme.colors.text.primary,
        fontSize: '1.1rem',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}

function InfoIcon() {
  return (
    <div
      style={{
        width: '1.8rem',
        height: '1.8rem',
        borderRadius: '50%',
        backgroundColor: theme.colors.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#2BCDD2',
        fontWeight: 700,
        fontStyle: 'normal',
        boxShadow: '0 4px 12px rgba(43,205,210,0.25)',
      }}
    >
      i
    </div>
  );
}

export default function Discover() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const nearbyScrollRef = useDragScroll();
  const bestsellerScrollRef = useDragScroll();

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      setErrorMessage('');
      try {
        const response = await getCompleteProducts({ limit: 40, offset: 0 });
        if (!isMounted) return;

        if (response?.success && Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('❌ Lỗi tải sản phẩm:', err);
        setErrorMessage('Không thể tải danh sách món ăn.');
      } finally {
        if (isMounted) {
          setLoadingProducts(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const nearbyProducts = products.slice(0, 10);
  const bestSellerProducts = products.slice(10, 20).length
    ? products.slice(10, 20)
    : products.slice(0, 10);

  const renderProductList = (list) => {
    if (loadingProducts) {
      return <div style={styles.emptyState}>Đang tải...</div>;
    }

    if (errorMessage) {
      return <div style={styles.emptyState}>{errorMessage}</div>;
    }

    if (!list.length) {
      return <div style={styles.emptyState}>Chưa có món ăn phù hợp.</div>;
    }

    return list.map((product) => (
      <ProductCard key={product.product_id} product={product} onSelect={() => setSelectedProduct(product)} />
    ));
  };

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />;
  }

  return (
    <div style={styles.page}>
      <div style={styles.gradient} />
      <div style={styles.content}>
        <div style={styles.topBar}>
          <button type="button" style={styles.circleButton}>
            <BackIcon />
          </button>
          <div style={styles.locationInfo}>
            <div style={styles.locationLabel}>Giao đến:</div>
            <div style={styles.locationValue}>Trường Đại Học FPT Đà Nẵng</div>
          </div>
          <div style={{ ...styles.circleButton, backgroundColor: theme.colors.white }}>
            <LocationIcon />
          </div>
        </div>

        <div style={styles.searchBar}>
          <SearchIcon />
          <input
            style={styles.searchInput}
            placeholder="Bạn đang thèm gì nào?"
            aria-label="Tìm kiếm món ăn hoặc quán"
          />
        </div>

        <div style={styles.heroCard}>
          <img src={ASSETS.heroBanner} alt="Ưu đãi nổi bật" style={styles.heroImage} />
        </div>

        <div style={styles.categoriesRow}>
          {categories.map((item) => (
            <CategoryItem key={item.id} item={item} />
          ))}
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Gần tôi!</h2>
            <div style={styles.arrowBtn}>
              <ArrowRightIcon />
            </div>
          </div>
          <div ref={nearbyScrollRef} style={styles.horizontalList} className="scrollbar-hide">
            {renderProductList(nearbyProducts)}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Bán chạy!</h2>
            <div style={styles.arrowBtn}>
              <ArrowRightIcon />
            </div>
          </div>
          <div ref={bestsellerScrollRef} style={styles.horizontalList} className="scrollbar-hide">
            {renderProductList(bestSellerProducts)}
          </div>
        </section>
      </div>
      <Navbar />
    </div>
  );
}

