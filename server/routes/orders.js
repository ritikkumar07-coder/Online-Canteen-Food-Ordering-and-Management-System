const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { protect, authorize } = require('../middleware/auth');

// Generate token number
const generateTokenNumber = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const count = await Order.countDocuments({
    createdAt: { $gte: today }
  });
  
  return count + 1;
};

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, pickupTime, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Calculate total and validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item ${item.menuItemId} not found` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `${menuItem.name} is currently unavailable` });
      }

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
      });
      totalAmount += menuItem.price * item.quantity;
    }

    // Validate pickup time
    const pickupDate = new Date(pickupTime);
    const now = new Date();
    if (pickupDate < now) {
      return res.status(400).json({ message: 'Pickup time must be in the future' });
    }

    // Generate token number
    const tokenNumber = await generateTokenNumber();

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      pickupTime: pickupDate,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'pending',
      tokenNumber,
      notes,
    });

    // Populate user info
    await order.populate('userId', 'name email studentId');

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get current user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    let query = { userId: req.user._id };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email studentId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email studentId phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin/staff
    if (order.userId._id.toString() !== req.user._id.toString() && 
        !['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only pending orders can be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel order that is already being prepared' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin/Staff: Get all orders
router.get('/all', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email studentId phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin/Staff: Update order status
router.put('/:id/status', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Valid status transitions
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['completed'],
      completed: [],
      cancelled: [],
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from '${order.status}' to '${status}'` 
      });
    }

    order.status = status;
    
    if (status === 'paid') {
      order.paymentStatus = 'paid';
    }

    await order.save();
    await order.populate('userId', 'name email studentId');

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get dashboard stats
router.get('/stats/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({
      createdAt: { $gte: today }
    }).populate('userId', 'name');

    const totalRevenue = todayOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const orderCount = todayOrders.length;
    const pendingCount = todayOrders.filter(o => o.status === 'pending').length;
    const readyCount = todayOrders.filter(o => o.status === 'ready').length;

    // Popular items
    const itemCounts = {};
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        if (itemCounts[item.name]) {
          itemCounts[item.name] += item.quantity;
        } else {
          itemCounts[item.name] = item.quantity;
        }
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      totalRevenue,
      orderCount,
      pendingCount,
      readyCount,
      popularItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
