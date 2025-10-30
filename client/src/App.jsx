import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Layouts
import MobileLayout from "./components/layout/MobileLayout";
import MobileShopLayout from "./components/layout/MobileShopLayout";
import MobileShipperLayout from "./components/layout/MobileShipperLayout";
import DesktopLayout from "./components/layout/DesktopLayout";
import DesktopAdminLayout from "./components/layout/DesktopAdminLayout";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { ShopProvider } from "./contexts/ShopContext";

// Shared Components
import SplashScreen from "./components/shared/SplashScreen";

// ====================== ADMIN ======================
import AdminDashboard from "./pages/Admin/Dashboard";
import Approvals from "./pages/Admin/Approvals";
import VideoReports from "./pages/Admin/VideoReports";
import Customers from "./pages/Admin/Customers";
import Shops from "./pages/Admin/Shops";
import Shippers from "./pages/Admin/Shippers";
import System from "./pages/Admin/System";
import Revenue from "./pages/Admin/Revenue";
import AdminWalletPage from "./pages/Admin/AdminWalletPage";

// ====================== CUSTOMER ======================
import Home from "./pages/Customer/Home";
import Discover from "./pages/Customer/Discover";
import Order from "./pages/Customer/Order";
import OrderTracking from "./pages/Customer/OrderTracking";
import { CartPage as Cart } from "./pages/Customer/Cart";
import Checkout from "./pages/Customer/Checkout";
import ConfirmOrder from "./pages/Customer/ConfirmOrder";
import AddCoupon from "./pages/Customer/AddCoupon";
import OrderHistory from "./pages/Customer/OrderHistory";
import DeliveryManCallScreen from "./pages/Customer/DeliveryManCallScreen";
import DeliveryManMessageScreen from "./pages/Customer/DeliveryManMessageScreen";
import OrderPlaced from "./pages/Customer/OrderPlaced";
import Notifications from "./pages/Customer/Notifications";
import RestaurantDetail from "./components/role-specific/Customer/RestaurantDetail";
import { UserProfile } from "./pages/Customer/UserProfile";
import SearchPage from "./pages/Customer/SearchPage";
import SearchResults from "./components/role-specific/Customer/SearchResults";
import FoodFilters from "./pages/Customer/FoodFilters";
import ShipperRegistration from "./pages/Customer/ShipperRegistration";
import ShopRegistration from "./pages/Customer/ShopRegistration";

// ====================== AUTH ======================
import Login from "./pages/Auth/Login";
import LoginPhone from "./pages/Auth/LoginPhone";
import LoginEmail from "./pages/Auth/LoginEmail";
import LoginPassword from "./pages/Auth/LoginPassword";
import Register from "./pages/Auth/Register";
import RegisterPhone from "./pages/Auth/RegisterPhone";
import RegisterEmail from "./pages/Auth/RegisterEmail";
import OTP from "./pages/Auth/OTP";
import ProfileRegister from "./pages/Auth/ProfileRegister";
import ShopLogin from "./pages/Auth/ShopLogin";
import AddAdress from "./pages/Auth/AddAdress";

// ====================== SHOP ======================
import ShopDashboard from "./pages/Shop/Dashboard";
import MenuManagement from "./pages/Shop/Menu";
import ShopVideo from "./pages/Shop/Video";
import ShopOrders from "./pages/Shop/Orders";
import ShopSettings from "./pages/Shop/Settings";
import ShopWalletPage from "./pages/Shop/ShopWalletPage";

// ====================== SHIPPER ======================
import ShipperHome from "./pages/Shipper/Home";
import ShipperActiveOrder from "./pages/Shipper/ActiveOrder";
import ShipperDelivering from "./pages/Shipper/Delivering";
import ShipperHistory from "./pages/Shipper/History";
import ShipperProfile from "./pages/Shipper/Profile";
import EditProfile from "./pages/Shipper/EditProfile";
import ShipperWallet from "./pages/Shipper/Wallet";
import ShipperSettings from "./pages/Shipper/Settings";
import ShipperEarnings from "./pages/Shipper/Earnings";

// ====================== TEST ======================
import UploadImageTest from "./pages/Test/UploadImageTest";


// 🧠 App Component
function App() {
  console.log("🧠DEBUG: [App] Rendered!");
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => setShowSplash(false);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <AuthProvider>
      <Routes>
        {/* ========== AUTH ========== */}
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

        {/* ========== CUSTOMER ========== */}
        <Route path="/customer/*" element={<MobileLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="confirm-order" element={<ConfirmOrder />} />
          <Route path="add-coupon" element={<AddCoupon />} />
          <Route path="orders" element={<Order />} />
          <Route path="order-tracking" element={<OrderTracking />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="delivery-man-call" element={<DeliveryManCallScreen />} />
          <Route path="delivery-man-message" element={<DeliveryManMessageScreen />} />
          <Route path="order-placed" element={<OrderPlaced />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="restaurant-details" element={<RestaurantDetail />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="search-results" element={<SearchResults />} />
          <Route path="filters" element={<FoodFilters />} />
          <Route path="register-shipper" element={<ShipperRegistration />} />
          <Route path="register-shop" element={<ShopRegistration />} />
        </Route>

        {/* ========== SHIPPER ========== */}
        <Route path="/shipper/*" element={<MobileShipperLayout />}>
          <Route path="home" element={<ShipperHome />} />
          <Route path="available" element={<ShipperActiveOrder />} />
          <Route path="delivering" element={<ShipperDelivering />} />
          <Route path="history" element={<ShipperHistory />} />
          <Route path="profile" element={<ShipperProfile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="wallet" element={<ShipperWallet />} />
          <Route path="settings" element={<ShipperSettings />} />
          <Route path="earnings" element={<ShipperEarnings />} />
          <Route path="*" element={<Navigate to="/shipper/home" />} />
        </Route>

        {/* ========== SHOP ========== */}
        <Route
          path="/shop/*"
          element={
            <ShopProvider>
              <MobileShopLayout />
            </ShopProvider>
          }
        >
          <Route path="dashboard" element={<ShopDashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="video" element={<ShopVideo />} />
          <Route path="orders" element={<ShopOrders />} />
          <Route path="wallet" element={<ShopWalletPage />} />
          <Route path="settings" element={<ShopSettings />} />
          <Route path="*" element={<Navigate to="/shop/dashboard" />} />
        </Route>

        {/* ========== ADMIN ========== */}
        <Route path="/admin/*" element={<DesktopAdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="system" element={<System />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="video-reports" element={<VideoReports />} />
          <Route path="customers" element={<Customers />} />
          <Route path="shops" element={<Shops />} />
          <Route path="shippers" element={<Shippers />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="wallet" element={<AdminWalletPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Route>

        {/* ========== TEST ========== */}
        <Route path="/test/upload" element={<UploadImageTest />} />

        {/* ========== DEFAULT REDIRECT ========== */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
