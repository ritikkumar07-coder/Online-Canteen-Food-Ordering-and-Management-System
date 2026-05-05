const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['breakfast', 'lunch', 'snacks', 'beverages'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number,
    default: 15,
    min: 5,
  },
}, {
  timestamps: true,
});

// Index for faster queries
menuItemSchema.index({ category: 1, isAvailable: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
