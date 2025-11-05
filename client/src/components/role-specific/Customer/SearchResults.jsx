import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchAll } from "@/api/searchApi";
import {
  Box,
  Container,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import {
  ArrowBack,
  Clear,
  Search,
  StorefrontOutlined,
  VideoLibrary,
} from "@mui/icons-material";
import ShopResultItem from "../../shared/ShopResultItem";
import VideoResultItem from "../../shared/VideoResultItem";
import SearchDebugPanel from "../../shared/SearchDebugPanel";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState(0); // 0: shops, 1: video
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]); // Danh sách shops đã được nhóm
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔍 Gọi API khi có query (tự động chạy lại nếu query thay đổi)
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!queryParam.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const res = await searchAll(queryParam);
        console.log("✅ API SearchAll Response:", res);
        if (res?.success) {
          const productsData = res.products || [];
          setProducts(productsData);
          setVideos(res.videos || []);

          // Nhóm products theo shop_id
          const groupedShops = groupProductsByShop(productsData);
          setShops(groupedShops);
        } else {
          setProducts([]);
          setVideos([]);
          setShops([]);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tìm kiếm:", err);
        setError(err);
        setProducts([]);
        setVideos([]);
        setShops([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [queryParam]);

  // 📦 Hàm nhóm products theo shop_id
  const groupProductsByShop = (products) => {
    if (!products || products.length === 0) return [];

    // Tạo map để nhóm products theo shop_id
    const shopMap = new Map();

    products.forEach((product) => {
      const shopId = product.shop_id;
      if (!shopId) return;

      if (!shopMap.has(shopId)) {
        // Tạo shop mới
        shopMap.set(shopId, {
          shop_id: shopId,
          shop_name: product.shop_name || `Cửa hàng #${shopId}`,
          shop_image: product.shop_image || null,
          avatar_url: product.avatar_url || null,
          rating: product.shop_rating || product.rating || null,
          avg_review_rating: product.avg_review_rating || null,
          review_count: product.review_count || 0,
          category: product.category || null,
          products: [],
        });
      }

      // Thêm product vào shop
      shopMap.get(shopId).products.push(product);
    });

    // Convert map thành array và sắp xếp theo số lượng products
    return Array.from(shopMap.values()).sort((a, b) => b.products.length - a.products.length);
  };

  // 📌 Khi người dùng nhấn Enter → cập nhật URL và fetch kết quả mới
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    setSearchParams({ query: searchQuery });
  };

  // 📌 Khi người dùng nhấn nút X → xóa input và kết quả
  const handleClear = () => {
    setSearchQuery("");
    setSearchParams({});
    setProducts([]);
    setVideos([]);
    setShops([]);
  };

  // 📌 Xử lý thay đổi tab
  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);
  };

  // 📌 Render Loading Skeleton
  const renderLoadingSkeleton = () => {
    if (activeTab === 0) {
      // Shops skeleton
      return (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" width={120} height={120} sx={{ borderRadius: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="30%" height={25} />
              </Box>
            </Box>
          ))}
        </Stack>
      );
    } else {
      // Video skeleton
      return (
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={6} key={i}>
              <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" height={15} />
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  // 📌 Render Empty State
  const renderEmptyState = () => {
    const messages = [
      { icon: <StorefrontOutlined sx={{ fontSize: 80, color: '#CCC' }} />, text: "Không tìm thấy quán phù hợp" },
      { icon: <VideoLibrary sx={{ fontSize: 80, color: '#CCC' }} />, text: "Không có video phù hợp" },
    ];

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        {messages[activeTab]?.icon}
        <Typography variant="h6" sx={{ mt: 2, color: '#999', fontSize: '1.4rem' }}>
          {messages[activeTab]?.text}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: '#BBB', fontSize: '1.2rem' }}>
          Thử tìm kiếm với từ khóa khác
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FAFAFA', pb: 2 }}>
      {/* ====== HEADER: SEARCH BAR ====== */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          pb: 1,
        }}
      >
        {/* Search Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: '#333' }}>
            <ArrowBack />
          </IconButton>
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F5F5F5',
              borderRadius: 3,
              px: 2,
              py: 1,
            }}
          >
            <Search sx={{ color: '#999', mr: 1 }} />
            <input
              type="text"
              placeholder="Tìm kiếm quán ăn hoặc video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '1.4rem',
                color: '#333',
                fontFamily: 'Be Vietnam Pro',
              }}
            />
            {searchQuery && (
              <IconButton size="small" onClick={handleClear}>
                <Clear sx={{ fontSize: '2rem' }} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontSize: '1.4rem',
              fontWeight: 600,
              textTransform: 'none',
              fontFamily: 'Be Vietnam Pro',
            },
            '& .Mui-selected': {
              color: '#F9704B !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#F9704B',
              height: 3,
            },
          }}
        >
          <Tab icon={<StorefrontOutlined />} iconPosition="start" label="Quán" />
          <Tab icon={<VideoLibrary />} iconPosition="start" label="Video" />
        </Tabs>
      </Box>

      {/* ====== CONTENT: KẾT QUẢ TÌM KIẾM ====== */}
      <Container maxWidth="md" sx={{ mt: 2, px: 2 }}>
        {/* Loading State */}
        {loading && renderLoadingSkeleton()}

        {/* Empty State */}
        {!loading && (
          <>
            {activeTab === 0 && shops.length === 0 && renderEmptyState()}
            {activeTab === 1 && videos.length === 0 && renderEmptyState()}
          </>
        )}

        {/* ===== QUÁN ===== */}
        {!loading && activeTab === 0 && shops.length > 0 && (
          <Box>
            {shops.map((shop) => (
              <ShopResultItem key={shop.shop_id} shop={shop} />
            ))}
          </Box>
        )}

        {/* ===== VIDEO ===== */}
        {!loading && activeTab === 1 && videos.length > 0 && (
          <Grid container spacing={2}>
            {videos.map((video) => (
              <Grid size={6} key={video.video_id}>
                <VideoResultItem video={video} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* 🐛 Debug Panel - Chỉ hiển thị trong development */}
      <SearchDebugPanel
        queryParam={queryParam}
        loading={loading}
        products={products}
        videos={videos}
        error={error}
      />
    </Box>
  );
};

export default SearchResults;
