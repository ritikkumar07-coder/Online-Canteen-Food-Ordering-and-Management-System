import { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import CategoryPills from '../components/CategoryPills';
import './Explore.css';

const API_URL = 'http://localhost:5000/api';

const categories = ['All', 'breakfast', 'lunch', 'snacks', 'beverages'];

export default function Explore() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/menu`;
        if (activeCategory !== 'All') {
          url += `?category=${activeCategory.toLowerCase()}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [activeCategory]);

  const filteredItems = menuItems.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="explore-page">
      <header className="explore-header">
        <h1 className="explore-title">Discover Your Next Meal</h1>
        <p className="explore-subtitle">Search for your favorite dishes or explore our delicious menu categories.</p>
      </header>

      <div className="search-section">
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="categories-section">
        <CategoryPills 
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      <div className="results-info">
        <span>{filteredItems.length} items found</span>
      </div>

      <section className="food-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <p>No items found</p>
            <span>Try a different search or category</span>
          </div>
        ) : (
          <div className="food-grid">
            {filteredItems.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

