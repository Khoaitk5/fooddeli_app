import { Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from './components/layout/MobileLayout';
import Feed from './pages/Customer/Feed';
import Cart from './pages/Customer/Cart';
import OrderHistory from './pages/Customer/OrderHistory';
import Login from './pages/Auth/Login';
import LoginPhone from './pages/Auth/LoginPhone';
import LoginEmail from './pages/Auth/LoginEmail';
import Register from './pages/Auth/Register';
import RegisterPhone from './pages/Auth/RegisterPhone';
import RegisterEmail from './pages/Auth/RegisterEmail';
import OTP from './pages/Auth/OTP';
import LoginPassword from './pages/Auth/LoginPassword';

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/phone" element={<LoginPhone />} />
        <Route path="/login/email" element={<LoginEmail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/phone" element={<RegisterPhone />} />
        <Route path="/register/email" element={<RegisterEmail />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/login/password" element={<LoginPassword />} />
        <Route path="/customer/*" element={<MobileLayout />}>
          <Route path="home" element={<Feed />} />
          <Route path="feed" element={<Feed />} />
          <Route path="discover" element={<div>Discover Page</div>} />
          <Route path="notifications" element={<div>Notifications Page</div>} />
          <Route path="profile" element={<div>Customer Profile</div>} />
        </Route>
        <Route path="/shipper/*" element={<MobileLayout />}>
          <Route path="orders" element={<div>Shipper Orders</div>} />
          <Route path="map" element={<div>Shipper Map</div>} />
          <Route path="notification" element={<div>Shipper Notifications</div>} />
          <Route path="profile" element={<div>Shipper Profile</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/customer/feed" />} />
      </Routes>
  );
}

export default App;
