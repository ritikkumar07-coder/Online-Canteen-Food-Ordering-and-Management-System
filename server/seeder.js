const mongoose = require('mongoose');
const connectDB = require('./config/db');
const MenuItem = require('./models/MenuItem');

connectDB();

const menuItems = [
  {
    name: 'Veg Sandwich',
    price: 40,
    category: 'snacks',
    description: 'A classic sandwich with fresh vegetables.',
    isVeg: true,
  },
  {
    name: 'Grilled Cheese Sandwich',
    price: 60,
    category: 'snacks',
    description: 'A warm and cheesy grilled sandwich.',
    isVeg: true,
  },
  {
    name: 'Samosa',
    price: 20,
    category: 'snacks',
    description: 'Crispy pastry filled with spiced potatoes.',
    isVeg: true,
  },
  {
    name: 'Paneer Roll',
    price: 70,
    category: 'snacks',
    description: 'A delicious roll with a paneer filling.',
    isVeg: true,
  },
  {
    name: 'French Fries',
    price: 80,
    category: 'snacks',
    description: 'Classic crispy french fries.',
    isVeg: true,
  },
  {
    name: 'Maggi',
    price: 40,
    category: 'snacks',
    description: 'A favorite instant noodle dish.',
    isVeg: true,
  },
  {
    name: 'Veg Noodles',
    price: 80,
    category: 'snacks',
    description: 'Stir-fried noodles with vegetables.',
    isVeg: true,
  },
  {
    name: 'Fried Rice',
    price: 90,
    category: 'snacks',
    description: 'Flavorful fried rice with vegetables.',
    isVeg: true,
  },
  {
    name: 'Pasta',
    price: 100,
    category: 'snacks',
    description: 'Pasta in a savory sauce.',
    isVeg: true,
  },
  {
    name: 'Veg Thali',
    price: 120,
    category: 'lunch',
    description: 'A complete meal with a variety of veg dishes.',
    isVeg: true,
  },
  {
    name: 'Rajma Chawal',
    price: 90,
    category: 'lunch',
    description: 'A classic North Indian dish of kidney beans and rice.',
    isVeg: true,
  },
  {
    name: 'Chole Bhature',
    price: 100,
    category: 'lunch',
    description: 'Spicy chickpeas with fluffy fried bread.',
    isVeg: true,
  },
  {
    name: 'Paneer Butter Masala + Naan',
    price: 130,
    category: 'lunch',
    description: 'Creamy paneer curry with soft naan bread.',
    isVeg: true,
  },
  {
    name: 'Egg Curry + Rice',
    price: 110,
    category: 'lunch',
    description: 'A flavorful egg curry served with rice.',
    isVeg: false,
  },
  {
    name: 'Tea',
    price: 10,
    category: 'beverages',
    description: 'A warm cup of tea.',
    isVeg: true,
  },
  {
    name: 'Coffee',
    price: 20,
    category: 'beverages',
    description: 'A classic cup of coffee.',
    isVeg: true,
  },
  {
    name: 'Cold Coffee',
    price: 50,
    category: 'beverages',
    description: 'A refreshing cold coffee.',
    isVeg: true,
  },
  {
    name: 'Fresh Juice',
    price: 60,
    category: 'beverages',
    description: 'A glass of fresh fruit juice.',
    isVeg: true,
  },
  {
    name: 'Soft Drinks',
    price: 40,
    category: 'beverages',
    description: 'A variety of soft drinks.',
    isVeg: true,
  },
  {
    name: 'Gulab Jamun',
    price: 30,
    category: 'snacks',
    description: 'A sweet and syrupy dessert.',
    isVeg: true,
  },
  {
    name: 'Ice Cream',
    price: 50,
    category: 'snacks',
    description: 'A scoop of delicious ice cream.',
    isVeg: true,
  },
  {
    name: 'Brownie',
    price: 70,
    category: 'snacks',
    description: 'A rich chocolate brownie.',
    isVeg: true,
  },
];

const importData = async () => {
  try {
    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuItems);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await MenuItem.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
