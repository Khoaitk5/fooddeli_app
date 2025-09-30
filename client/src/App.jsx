import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MobileLayout from './components/layout/MobileLayout';
import Home from './pages/Customer/Home';
import Cart from './pages/Customer/Cart';
import OrderHistory from './pages/Customer/OrderHistory';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProfileDetails from './pages/Auth/ProfileDetails';
import CustomerProfile from './pages/Customer/Profile';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/customer/*" element={<MobileLayout />}>
          <Route path="home" element={<Home />} />
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
        <Route path="*" element={<Navigate to="/customer/home" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/profile" element={<ProfileDetails />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
