import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/constants';

const drawerWidth = 240;

const DesktopLayout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { text: 'Users', icon: '👥', path: '/admin/users' },
    { text: 'Orders', icon: '🛒', path: '/admin/orders' },
  ];

  const drawer = (
    <div style={{ paddingTop: '64px' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {menuItems.map((item) => (
          <li key={item.text} style={{ margin: 0 }}>
            <button
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'left'
              }}
            >
              <span style={{ marginRight: '16px' }}>{item.icon}</span>
              <span>{item.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#1976d2',
        color: 'white',
        padding: '16px',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center'
      }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            marginRight: '16px'
          }}
          className="mobile-menu-btn"
          onClick={handleDrawerToggle}
        >
          ☰
        </button>
        <h1 style={{ margin: 0, flexGrow: 1, fontSize: '1.25rem', fontWeight: '500' }}>
          FoodDeli - {user?.role === ROLES.ADMIN ? 'Admin' : 'Shop'}
        </h1>
        <button
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          onClick={logout}
        >
          Logout
        </button>
      </header>

      {/* Sidebar */}
      <nav style={{
        width: drawerWidth,
        background: '#f5f5f5',
        borderRight: '1px solid #ddd',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto'
      }}
      className={mobileOpen ? 'sidebar-open' : 'sidebar-closed'}
      >
        {drawer}
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000
          }}
          onClick={handleDrawerToggle}
        />
      )}

      {/* Main content */}
      <main style={{
        flexGrow: 1,
        padding: '16px',
        marginTop: '64px'
      }}
      className="main-content"
      >
        <Outlet />
      </main>

      <style>{`
        @media (min-width: 600px) {
          .mobile-menu-btn { display: none !important; }
          .sidebar-closed { display: block !important; }
          .main-content { marginLeft: ${drawerWidth}px !important; width: calc(100% - ${drawerWidth}px) !important; }
        }
        @media (max-width: 599px) {
          .sidebar-closed { display: none !important; }
          .sidebar-open { display: block !important; }
          .main-content { marginLeft: 0 !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default DesktopLayout;