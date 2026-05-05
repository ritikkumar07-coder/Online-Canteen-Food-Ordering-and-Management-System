import './CategoryPills.css';

export default function CategoryPills({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="category-pills">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-pill ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
