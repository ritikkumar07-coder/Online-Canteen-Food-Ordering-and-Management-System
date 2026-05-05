const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/menu/categories
// @desc    Get menu categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/menu
// @desc    Create a menu item
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, category, price, image, isAvailable, preparationTime } = req.body;

    const menuItem = await MenuItem.create({
      name,
      description,
      category,
      price,
      image,
      isAvailable,
      preparationTime,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update a menu item
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, category, price, image, isAvailable, preparationTime } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (category) menuItem.category = category;
    if (price !== undefined) menuItem.price = price;
    if (image) menuItem.image = image;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;
    if (preparationTime !== undefined) menuItem.preparationTime = preparationTime;

    await menuItem.save();

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/menu/:id/availability
// @desc    Toggle item availability
// @access  Private (Admin)
router.put('/:id/availability', protect, authorize('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await menuItem.deleteOne();
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed menu items (for testing)
router.post('/seed', async (req, res) => {
  try {
    const menuItems = [
      // Breakfast
      { name: 'Masala Dosa', description: 'Crispy rice and lentil crepe with potato filling', category: 'breakfast', price: 60, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee3476?w=400', preparationTime: 15 },
      { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil stew', category: 'breakfast', price: 45, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', preparationTime: 10 },
      { name: 'Puri Bhaji', description: 'Fried bread with spiced potato curry', category: 'breakfast', price: 50, image: 'https://images.unsplash.com/photo-1626828449673-1e4f4a51egate?w=400', preparationTime: 12 },
      { name: 'Poha', description: 'Flattened rice with peanuts and veggies', category: 'breakfast', price: 40, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', preparationTime: 8 },
      { name: 'Paratha', description: 'Layered flatbread with butter', category: 'breakfast', price: 55, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', preparationTime: 10 },
      
      // Lunch
      { name: 'Veg Thali', description: 'Rice, dal, vegetables, roti, curd', category: 'lunch', price: 120, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', preparationTime: 20 },
      { name: 'Veg Biryani', description: 'Fragrant rice with spices and vegetables', category: 'lunch', price: 100, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', preparationTime: 18 },
      { name: 'Rajma Chawal', description: 'Kidney bean curry with rice', category: 'lunch', price: 90, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', preparationTime: 15 },
      { name: 'Paneer Butter Masala', description: 'Cottage cheese in creamy tomato gravy', category: 'lunch', price: 140, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', preparationTime: 15 },
      { name: 'Dal Tadka', description: 'Tempered lentil curry', category: 'lunch', price: 70, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', preparationTime: 12 },
      
      // Snacks
      { name: 'Samosa', description: 'Crispy pastry with spiced potatoes', category: 'snacks', price: 25, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', preparationTime: 5 },
      { name: ' Pakora', description: 'Vegetable fritters', category: 'snacks', price: 30, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', preparationTime: 8 },
      { name: 'Bhelpuri', description: 'Puffed rice with chutneys', category: 'snacks', price: 35, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', preparationTime: 5 },
      { name: 'Maggi', description: 'Instant noodles', category: 'snacks', price: 50, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', preparationTime: 5 },
      { name: 'Sandwich', description: 'Vegetable or cheese sandwich', category: 'snacks', price: 45, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', preparationTime: 5 },
      
      // Beverages
      { name: 'Masala Chai', description: 'Spiced Indian tea', category: 'beverages', price: 20, image: 'https://images.unsplash.com/photo-1571933342098-8a4f5a56d859?w=400', preparationTime: 3 },
      { name: 'Coffee', description: 'Hot brewed coffee', category: 'beverages', price: 25, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', preparationTime: 3 },
      { name: 'Cold Coffee', description: 'Iced coffee with cream', category: 'beverages', price: 60, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', preparationTime: 5 },
      { name: 'Lassi', description: 'Sweet yogurt drink', category: 'beverages', price: 35, image: 'https://images.unsplash.com/photo-1527661592475-9c2c8f7a8a3c?w=400', preparationTime: 3 },
      { name: 'Water Bottle', description: 'Mineral water 500ml', category: 'beverages', price: 20, image: 'https://images.unsplash.com/photo-1560023907-5f339617ea75?w=400', preparationTime: 1 },
    ];

    await MenuItem.deleteMany({});
    const created = await MenuItem.insertMany(menuItems);
    res.json({ message: `Seeded ${created.length} menu items` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
