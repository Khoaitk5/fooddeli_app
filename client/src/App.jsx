import { Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from './components/layout/MobileLayout';
import MobileShopLayout from './components/layout/MobileShopLayout';
import MobileShipperLayout from './components/layout/MobileShipperLayout';
import DesktopLayout from './components/layout/DesktopLayout';
import DesktopAdminLayout from './components/layout/DesktopAdminLayout';
import { AuthProvider } from './contexts/AuthContext';

// Admin
import AdminDashboard from './pages/Admin/Dashboard';
import Approvals from './pages/Admin/Approvals';
import VideoReports from './pages/Admin/VideoReports';
import Customers from './pages/Admin/Customers';
import Shops from './pages/Admin/Shops';
import Shippers from './pages/Admin/Shippers';
import System from './pages/Admin/System';
import Revenue from './pages/Admin/Revenue';

// Customer
import Home from './pages/Customer/Home';
import Discover from './pages/Customer/Discover';
import Order from './pages/Customer/Order';
import OrderTracking from './pages/Customer/OrderTracking';
import OrderSummary from './pages/Customer/OrderSummary';
import Cart from './pages/Customer/Cart';
import Checkout from './pages/Customer/Checkout';
import Payment from './pages/Customer/Payment';
import AddCoupon from './pages/Customer/AddCoupon';
import OrderHistory from './pages/Customer/OrderHistory';
import DeliveryManCallScreen from './pages/Customer/DeliveryManCallScreen';
import DeliveryManMessageScreen from './pages/Customer/DeliveryManMessageScreen';
import OrderPlaced from './pages/Customer/OrderPlaced';
import Notifications from './pages/Customer/Notifications';
import RestaurantDetailPage from './pages/Customer/RestaurantDetailPage';
import { UserProfile } from './pages/Customer/UserProfile';
import SearchPage from './pages/Customer/SearchPage';

// Auth
import Login from './pages/Auth/Login';
import LoginPhone from './pages/Auth/LoginPhone';
import LoginEmail from './pages/Auth/LoginEmail';
import LoginPassword from './pages/Auth/LoginPassword';
import Register from './pages/Auth/Register';
import RegisterPhone from './pages/Auth/RegisterPhone';
import RegisterEmail from './pages/Auth/RegisterEmail';
import OTP from './pages/Auth/OTP';
import ProfileRegister from "./pages/Auth/ProfileRegister";
import ShopLogin from "./pages/Auth/ShopLogin";
import AddAdress from "./pages/Auth/AddAdress";

// Shop
import ShopDashboard from './pages/Shop/Dashboard';
import MenuManagement from './pages/Shop/Menu';
import ShopVideo from './pages/Shop/Video';
import ShopOrders from './pages/Shop/Orders';
import ShopSettings from './pages/Shop/Settings';

// Shipper
import ShipperHome from './pages/Shipper/Home';
import ShipperAvailable from './pages/Shipper/AvailableOrders';
import ShipperMyRuns from './pages/Shipper/MyRuns';
import ShipperOrderDetail from './pages/Shipper/OrderDetail';
import ShipperNavigation from './pages/Shipper/Navigation';
import ShipperEarnings from './pages/Shipper/Earnings';
import ShipperHistory from './pages/Shipper/History';
import ShipperProfile from './pages/Shipper/Profile';
import ShipperSettings from './pages/Shipper/Settings';

// 🧠 App Component
function App() {
  console.log("🧠DEBUG: [App] Rendered!");
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/phone" element={<LoginPhone />} />
        <Route path="/login/email" element={<LoginEmail />} />
        <Route path="/login/password" element={<LoginPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/phone" element={<RegisterPhone />} />
        <Route path="/register/email" element={<RegisterEmail />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/shop/login" element={<ShopLogin />} />
        <Route path="/profileRegister" element={<ProfileRegister />} />
        <Route path="/address/add" element={<AddAdress />} />

        {/* Customer Routes */}
        <Route path="/customer/*" element={<MobileLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Payment />} />
          <Route path="add-coupon" element={<AddCoupon />} />
          <Route path="orders" element={<Order />} />
          <Route path="order-tracking" element={<OrderTracking />} />
          <Route path="order-summary" element={<OrderSummary />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="delivery-man-call" element={<DeliveryManCallScreen />} />
          <Route path="delivery-man-message" element={<DeliveryManMessageScreen />} />
          <Route path="order-placed" element={<OrderPlaced />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="discover" element={<Discover />} />
          <Route path="search" element={<SearchPage />} />
        </Route>

        {/* Shipper Routes */}
        <Route path="/shipper/*" element={<MobileShipperLayout />}>
          <Route path="home" element={<ShipperHome />} />
          <Route path="available" element={<ShipperAvailable />} />
          <Route path="my-runs" element={<ShipperMyRuns />} />
          <Route path="order/:id" element={<ShipperOrderDetail />} />
          <Route path="navigation" element={<ShipperNavigation />} />
          <Route path="earnings" element={<ShipperEarnings />} />
          <Route path="history" element={<ShipperHistory />} />
          <Route path="profile" element={<ShipperProfile />} />
          <Route path="settings" element={<ShipperSettings />} />
          <Route path="*" element={<Navigate to="/shipper/home" />} />
        </Route>

        {/* Shop Routes */}
        <Route path="/shop/*" element={<MobileShopLayout />}>
          <Route path="dashboard" element={<ShopDashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="video" element={<ShopVideo />} />
          <Route path="orders" element={<ShopOrders />} />
          <Route path="settings" element={<ShopSettings />} />
          <Route path="*" element={<Navigate to="/shop/dashboard" />} /> {/* Redirect */}
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={<DesktopAdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="system" element={<System />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="video-reports" element={<VideoReports />} />
          <Route path="customers" element={<Customers />} />
          <Route path="shops" element={<Shops />} />
          <Route path="shippers" element={<Shippers />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/customer/home" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
