import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const API_URL = 'http://localhost:5000/api';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.menuItemId === menuItem._id);
      if (existing) {
        return prev.map(item =>
          item.menuItemId === menuItem._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        image: menuItem.image,
        category: menuItem.category,
      }];
    });
  };

  const removeItem = (menuItemId) => {
    setItems(prev => prev.filter(item => item.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const placeOrder = async (token, pickupTime, paymentMethod, notes) => {
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      }));

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          pickupTime,
          paymentMethod,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      clearCart();
      return data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      placeOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
