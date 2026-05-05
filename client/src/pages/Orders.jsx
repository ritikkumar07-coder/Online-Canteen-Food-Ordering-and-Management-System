import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderTracker from '../components/OrderTracker';
import './Orders.css';

const API_URL = 'http://localhost:5000/api';

export default function Orders() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'var(--color-warning)',
      confirmed: 'var(--color-accent)',
      preparing: 'var(--color-accent)',
      ready: 'var(--color-green-live)',
      completed: 'var(--color-green-live)',
      cancelled: 'var(--color-danger)',
    };
    return colors[status] || 'var(--color-text-muted)';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="orders-page">
      <h1 className="page-title">My Orders</h1>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h2>No orders yet</h2>
          <p>Your order history will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div 
              key={order._id} 
              className={`order-card ${selectedOrder?._id === order._id ? 'expanded' : ''}`}
              onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
            >
              <div className="order-header">
                <div className="order-info">
                  <span className="token-badge">#{order.tokenNumber}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <span 
                  className="order-status"
                  style={{ color: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-items-preview">
                {order.items.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="item-tag">
                    {item.quantity}× {item.name}
                  </span>
                ))}
                {order.items.length > 3 && (
                  <span className="more-items">+{order.items.length - 3} more</span>
                )}
              </div>

              <div className="order-footer">
                <span className="order-total">₹{order.totalAmount}</span>
                <span className="pickup-time">
                  📍 Pickup: {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {selectedOrder?._id === order._id && order.status !== 'cancelled' && order.status !== 'completed' && (
                <div className="order-tracker-section">
                  <OrderTracker status={order.status} />
                </div>
              )}

              {selectedOrder?._id === order._id && (
                <div className="order-details">
                  <h4>Order Details</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="detail-item">
                      <span>{item.quantity}× {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="detail-item total">
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
