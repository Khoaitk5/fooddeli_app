import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";

// Layouts
import MobileLayout from "./components/layout/MobileLayout";
import MobileShopLayout from "./components/layout/MobileShopLayout";
import DesktopLayout from "./components/layout/DesktopLayout";
import DesktopAdminLayout from "./components/layout/DesktopAdminLayout";
import MobileAdminLayout from "./components/layout/MobileAdminLayout";

// Pages - Admin
import AdminDashboard from "./pages/Admin/Dashboard";
import Approvals from "./pages/Admin/Approvals";
import VideoReports from "./pages/Admin/VideoReports";
import Customers from "./pages/Admin/Customers";
import Shops from "./pages/Admin/Shops";
import Shippers from "./pages/Admin/Shippers";
import System from "./pages/Admin/System";
import Revenue from "./pages/Admin/Revenue";

// Pages - Customer
import Home from "./pages/Customer/Home";
import Discover from "./pages/Customer/Discover";
import Order from "./pages/Customer/Order";
import OrderTracking from "./pages/Customer/OrderTracking";
import OrderSummary from "./pages/Customer/OrderSummary";
import Cart from "./pages/Customer/Cart";
import Checkout from "./pages/Customer/Checkout";
import Payment from "./pages/Customer/Payment";
import AddCoupon from "./pages/Customer/AddCoupon";
import OrderHistory from "./pages/Customer/OrderHistory";

// Pages - Auth
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

// Pages - Shipper
//import HomePage from "./pages/Shipper/HomePage";


// 🧠 App Component
function App() {
  return (
    // ✅ AuthProvider bao toàn bộ ứng dụng
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
          <Route path="notifications" element={<div>Notifications Page</div>} />
          <Route path="profile" element={<div>Customer Profile</div>} />
        </Route>

        {/* Shipper Routes
        <Route path="/shipper/*" element={<ShipperLayout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="orders" element={<div>Shipper Orders</div>} />
          <Route path="active" element={<div>Đơn hàng đang giao</div>} />
          <Route path="profile" element={<div>Shipper Profile</div>} />
        </Route> */}

        {/* Shop Admin Routes */}
        <Route path="/shop/*" element={<MobileAdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="menu" element={<AdminDashboard />} />
          <Route path="video" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminDashboard />} />
        </Route>

        {/* Desktop Admin Routes */}
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
