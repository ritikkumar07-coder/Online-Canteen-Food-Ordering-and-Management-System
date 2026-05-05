const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending',
  },
  pickupTime: {
    type: Date,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cash'],
    default: 'cash',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  tokenNumber: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ tokenNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
