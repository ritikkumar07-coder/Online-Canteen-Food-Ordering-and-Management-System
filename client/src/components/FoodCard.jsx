import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './FoodCard.css';

export default function FoodCard({ item }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addItem(item, 1);
    setTimeout(() => setIsAdding(false), 300);
  };

  const imageUrl = `https://source.unsplash.com/400x400/?${item.name.split(' ').join(',')}`;

  return (
    <div className="food-card">
      <div className="food-image">
        <img src={item.image || imageUrl} alt={item.name} />
        <div className="food-badges">
          <span className="veg-badge">
            <span className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}></span>
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
          <span className="prep-badge">{item.preparationTime || 15} min</span>
        </div>
      </div>
      
      <div className="food-content">
        <h4 className="food-name">{item.name}</h4>
        <p className="food-desc">{item.description}</p>
        
        <div className="food-footer">
          <span className="food-price">₹{item.price}</span>
          
          <button 
            className={`add-btn ${isAdding ? 'adding' : ''}`}
            onClick={handleAdd}
            disabled={!item.isAvailable}
          >
            {isAdding ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
