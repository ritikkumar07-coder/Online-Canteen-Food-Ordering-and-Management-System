import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FoodCard from '../components/FoodCard';
import CategoryPills from '../components/CategoryPills';
import './Home.css';

const API_URL = 'http://localhost:5000/api';

const categories = ['All', 'Meals', 'Salads', 'Snacks', 'Drinks', 'Desserts'];

// Sample menu data for demo
const sampleMenuItems = [
  { _id: '1', name: 'Masala Dosa', description: 'Crispy rice crepe with potato filling', category: 'lunch', price: 60, image: '', rating: 4.5, prepTime: 15, isAvailable: true },
  { _id: '2', name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', category: 'lunch', price: 150, image: '', rating: 4.8, prepTime: 20, isAvailable: true },
  { _id: '3', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', category: 'lunch', price: 120, image: '', rating: 4.6, prepTime: 18, isAvailable: true },
  { _id: '4', name: 'Vegetable Salad', description: 'Fresh mixed vegetables', category: 'salads', price: 45, image: '', rating: 4.2, prepTime: 5, isAvailable: true },
  { _id: '5', name: 'Greek Salad', description: 'Cucumber, tomato, feta cheese', category: 'salads', price: 80, image: '', rating: 4.4, prepTime: 5, isAvailable: true },
  { _id: '6', name: 'Samosa', description: 'Crispy pastry with potatoes', category: 'snacks', price: 25, image: '', rating: 4.3, prepTime: 5, isAvailable: true },
  { _id: '7', name: 'Pakora', description: 'Crispy vegetable fritters', category: 'snacks', price: 30, image: '', rating: 4.5, prepTime: 8, isAvailable: true },
  { _id: '8', name: 'Masala Chai', description: 'Spiced Indian tea', category: 'beverages', price: 20, image: '', rating: 4.7, prepTime: 3, isAvailable: true },
  { _id: '9', name: 'Cold Coffee', description: 'Iced coffee with cream', category: 'beverages', price: 60, image: '', rating: 4.6, prepTime: 5, isAvailable: true },
  { _id: '10', name: 'Gulab Jamun', description: 'Sweet milk balls', category: 'desserts', price: 40, image: '', rating: 4.9, prepTime: 5, isAvailable: true },
  { _id: '11', name: 'Ice Cream', description: 'Vanilla or chocolate', category: 'desserts', price: 50, image: '', rating: 4.8, prepTime: 3, isAvailable: true },
  { _id: '12', name: 'Idli Sambar', description: 'Steamed rice cakes with lentil stew', category: 'meals', price: 45, image: '', rating: 4.4, prepTime: 10, isAvailable: true },
];

export default function Home() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_URL}/menu`);
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      } else {
        // Use sample data if API fails
        setMenuItems(sampleMenuItems);
      }
    } catch (error) {
      // Use sample data when backend not available
      setMenuItems(sampleMenuItems);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => {
        const cat = item.category?.toLowerCase();
        if (activeCategory === 'Meals') return cat === 'lunch' || cat === 'breakfast';
        if (activeCategory === 'Drinks') return cat === 'beverages';
        return cat === activeCategory.toLowerCase();
      });

  const featuredItem = filteredItems[0];

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <div className="delivery-badge">
            <span className="live-dot" />
            <span>15 min delivery</span>
          </div>
          <h1 className="hero-title">
            Good {getTimeOfDay()}, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="hero-subtitle">Ready to order your favorite meal?</p>
        </div>
      </section>

      {/* Stats Row */}
      <section className="stats-row">
        <div className="stat-card">
          <span className="stat-value">24</span>
          <span className="stat-label">Today's Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">₹185</span>
          <span className="stat-label">Avg. Order Value</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">4.8★</span>
          <span className="stat-label">Avg. Rating</span>
        </div>
      </section>

      {/* Live Kitchen Activity */}
      <section className="live-activity">
        <span className="live-indicator">
          <span className="pulse-dot" />
          Kitchen is live
        </span>
      </section>

      {/* Category Pills */}
      <section className="categories-section">
        <CategoryPills 
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </section>

      {/* Food Grid */}
      <section className="food-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">🍽️</span>
            <p>No items in this category</p>
          </div>
        ) : (
          <>
            {featuredItem && activeCategory === 'All' && (
              <div className="featured-section">
                <h3 className="section-title">Chef's Special 🔥</h3>
                <FoodCard item={featuredItem} featured />
              </div>
            )}
            
            <div className="food-grid">
              {filteredItems.slice(activeCategory === 'All' ? 1 : 0).map(item => (
                <FoodCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
