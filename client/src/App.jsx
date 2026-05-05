import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      
      {/* Public pages - accessible without login */}
      <Route path="/" element={
        <AppLayout>
          <Home />
        </AppLayout>
      } />
      
      <Route path="/explore" element={
        <AppLayout>
          <Explore />
        </AppLayout>
      } />
      
      <Route path="/cart" element={
        <AppLayout>
          <Cart />
        </AppLayout>
      } />
      
      {/* Protected pages - require login */}
      <Route path="/orders" element={
        <ProtectedRoute>
          <AppLayout>
            <Orders />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout>
            <Profile />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
