import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const API_URL = 'http://localhost:5000/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const cartCount = getItemCount();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍔</span>
          <span className="brand-text">CanteenApp</span>
        </Link>

        <div className="navbar-right">
          <Link to="/cart" className="cart-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {isLoggedIn ? (
            <div className="user-menu">
              <button 
                className="avatar-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {getInitials(user?.name)}
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.name}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    My Orders
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-link login-link">
                Login
              </Link>
              <Link to="/register" className="auth-link signup-link btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
