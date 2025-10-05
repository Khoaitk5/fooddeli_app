import { Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from './components/layout/MobileLayout';
import MobileAdminLayout from './components/layout/MobileAdminLayout';
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
import Login from './pages/Auth/Login';
import LoginPhone from './pages/Auth/LoginPhone';
import LoginEmail from './pages/Auth/LoginEmail';
import LoginPassword from './pages/Auth/LoginPassword';
import Register from './pages/Auth/Register';
import RegisterPhone from './pages/Auth/RegisterPhone';
import RegisterEmail from './pages/Auth/RegisterEmail';
import OTP from './pages/Auth/OTP';
import ProfileRegister from "./pages/Auth/ProfileRegister";
import Dashboard from './pages/Admin/Dashboard';
import ShopLogin from './pages/Auth/ShopLogin';

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/phone" element={<LoginPhone />} />
        <Route path="/login/email" element={<LoginEmail />} />
        <Route path="/login/password" element={<LoginPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/phone" element={<RegisterPhone />} />
        <Route path="/register/email" element={<RegisterEmail />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/shop/login" element={<ShopLogin />} />
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
        <Route path="/shipper/*" element={<MobileLayout />}>
          <Route path="orders" element={<div>Shipper Orders</div>} />
          <Route path="map" element={<div>Shipper Map</div>} />
          <Route path="notification" element={<div>Shipper Notifications</div>} />
          <Route path="profile" element={<div>Shipper Profile</div>} />
        </Route>
        <Route path="/shop/*" element={<MobileAdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="menu" element={<Dashboard />} />
          <Route path="video" element={<Dashboard />} />
          <Route path="orders" element={<Dashboard />} />
        </Route>
        <Route path="/admin/*" element={<Navigate to="/shop/dashboard" replace />} />
         <Route path="/profileRegister" element={<ProfileRegister />} />
         <Route path="*" element={<Navigate to="/customer/home" />} />
      </Routes>
  );
}

export default App;
