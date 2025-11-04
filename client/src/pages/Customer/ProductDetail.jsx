import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import theme from '@/styles/theme';
import { getProductById } from '@/api/productApi';

function BackIcon({ size = 18, color = theme.colors.text.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
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

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProductById(id);
        if (!isMounted) return;
        setProduct(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('❌ Lỗi tải chi tiết sản phẩm:', err);
        setError('Không thể tải chi tiết sản phẩm');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Đang tải...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
        {error || 'Không tìm thấy sản phẩm'}
      </div>
    );
  }

  const imageSrc = product.image_url || '/placeholder.jpg';
  const basePrice = Number(product.price) || 0;
  const formattedBasePrice = basePrice > 0 ? `${basePrice.toLocaleString('vi-VN')}đ` : 'Giá chưa cập nhật';
  const formattedTotalPrice = basePrice > 0 ? `${(basePrice * quantity).toLocaleString('vi-VN')}đ` : '—';
  const description = product.description?.trim() ? product.description : 'Món ăn chưa có mô tả.';

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
          onClick={() => navigate(-1)}
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
          aria-label="Quay lại"
        >
          <BackIcon />
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
