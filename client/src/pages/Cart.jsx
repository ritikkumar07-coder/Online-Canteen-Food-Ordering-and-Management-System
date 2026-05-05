import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotal, placeOrder, loading } = useCart();
  const { getToken } = useAuth();
  const [pickupTime, setPickupTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Get minimum pickup time (30 minutes from now)
  const getMinPickupTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  };

const handleCheckout = async () => {
    setError('');
    
    if (!pickupTime) {
      setError('Please select a pickup time');
      return;
    }

    const token = getToken();
    
    // Check if user is logged in
    if (!token) {
      setShowAuthPrompt(true);
      return;
    }

    try {
      const result = await placeOrder(token, pickupTime, paymentMethod, orderNotes);
      setOrderSuccess(result);
      setShowCheckout(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleAuthSuccess = async () => {
    setShowAuthPrompt(false);
    // Retry the checkout with the new token
    const token = getToken();
    if (token && pickupTime) {
      try {
        const result = await placeOrder(token, pickupTime, paymentMethod, orderNotes);
        setOrderSuccess(result);
        setShowCheckout(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const formatPrice = (price) => {
    return `₹${price}`;
  };

  if (orderSuccess) {
    return (
      <div className="cart-page">
        <div className="success-overlay">
          <div className="success-content">
            <div className="success-icon">🎉</div>
            <h2>Order Placed!</h2>
            <p className="token-number">Token #{orderSuccess.tokenNumber}</p>
            <p className="success-message">Your order is being prepared</p>
            <div className="success-details">
              <div className="detail-row">
                <span>Total Amount</span>
                <span className="amount">{formatPrice(orderSuccess.totalAmount)}</span>
              </div>
              <div className="detail-row">
                <span>Pickup Time</span>
                <span>{new Date(orderSuccess.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <button 
              className="btn btn-primary btn-lg w-full"
              onClick={() => {
                setOrderSuccess(null);
                navigate('/orders');
              }}
            >
              Track Order
            </button>
          </div>
        </div>
      </div>
    );
  }

// Auth prompt modal for guests trying to checkout
  if (showAuthPrompt) {
    return (
      <div className="cart-page">
        <div className="auth-prompt-overlay">
          <div className="auth-prompt-content">
            <div className="auth-prompt-icon">🍽️</div>
            <h2>Login to Complete Order</h2>
            <p>Please login or create an account to place your order</p>
            
            <div className="auth-prompt-actions">
              <button 
                className="btn btn-primary btn-lg btn-full"
                onClick={() => navigate('/login', { state: { from: '/cart' } })}
              >
                Login
              </button>
              <button 
                className="btn btn-outline btn-lg btn-full"
                onClick={() => navigate('/register', { state: { from: '/cart' } })}
              >
                Create Account
              </button>
            </div>
            
            <button 
              className="auth-prompt-back"
              onClick={() => setShowAuthPrompt(false)}
            >
              ← Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <span className="empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add some delicious items to get started!</p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/explore')}
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Cart</h1>

      <div className="cart-items">
        {items.map(item => (
          <div key={item.menuItemId} className="cart-item">
            <div className="item-image">
              <span className="item-emoji">
                {item.name?.toLowerCase().includes('dosa') ? '🥞' :
                 item.name?.toLowerCase().includes('biryani') ? '🍚' :
                 item.name?.toLowerCase().includes('tea') ? '🍵' :
                 item.name?.toLowerCase().includes('coffee') ? '☕' :
                 item.name?.toLowerCase().includes('lassi') ? '🥛' : '🍽️'}
              </span>
            </div>
            <div className="item-details">
              <h4 className="item-name">{item.name}</h4>
              <span className="item-price">{formatPrice(item.price)}</span>
            </div>
            <div className="item-quantity">
              <button 
                className="qty-btn"
                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
              >
                −
              </button>
              <span className="qty-value">{item.quantity}</span>
              <button 
                className="qty-btn"
                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="item-total">
              {formatPrice(item.price * item.quantity)}
            </div>
            <button 
              className="remove-btn"
              onClick={() => removeItem(item.menuItemId)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {showCheckout ? (
        <div className="checkout-section">
          <h3>Checkout</h3>
          
          <div className="form-group">
            <label>Pickup Time</label>
            <input 
              type="datetime-local"
              className="input-field"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              min={getMinPickupTime()}
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-options">
              <button 
                className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                💵 Cash
              </button>
              <button 
                className={`payment-option ${paymentMethod === 'online' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('online')}
              >
                💳 Online
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea 
              className="input-field"
              placeholder="Any special instructions..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              rows="3"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="checkout-actions">
            <button 
              className="btn btn-ghost"
              onClick={() => setShowCheckout(false)}
            >
              Back
            </button>
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : `Place Order • ${formatPrice(getTotal())}`}
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-summary">
          <div className="summary-row total">
            <span>Total</span>
            <span className="total-amount">{formatPrice(getTotal())}</span>
          </div>
          
          <button 
            className="btn btn-primary btn-lg btn-full"
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
