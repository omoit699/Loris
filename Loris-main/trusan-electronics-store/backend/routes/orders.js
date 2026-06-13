const express = require('express');
const { loadStore, saveStore } = require('../utils/store');
const { authMiddleware } = require('../utils/auth');

const router = express.Router();

router.post('/', authMiddleware, (req, res) => {
  const { cartItems, shipping, paymentMethod, paymentData } = req.body;
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart items are required to create an order' });
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    customerId: req.user.id,
    customerName: req.user.name,
    customerEmail: req.user.email,
    cartItems,
    shipping: shipping || {},
    paymentMethod: paymentMethod || 'cash-on-delivery',
    paymentData: paymentData || null,
    total,
    status: paymentMethod === 'mobile-money' ? 'Payment Confirmed' : 'Processing',
    createdAt: new Date().toISOString(),
    updates: [
      {
        status: paymentMethod === 'mobile-money' ? 'Payment Confirmed' : 'Processing',
        message: paymentMethod === 'mobile-money'
          ? `Mobile money payment received from ${paymentData?.phoneNumber} (${paymentData?.provider === 'mtn' ? 'MTN' : 'Airtel'})`
          : 'Order received and is being prepared',
        timestamp: new Date().toISOString()
      }
    ]
  };

  const store = loadStore();
  store.orders = store.orders || [];
  store.orders.push(order);
  saveStore(store);

  res.json({ order });
});

router.get('/user', authMiddleware, (req, res) => {
  const store = loadStore();
  const userOrders = (store.orders || []).filter(
    (order) => order.customerEmail.toLowerCase() === req.user.email.toLowerCase()
  );

  res.json(userOrders);
});

router.get('/track', (req, res) => {
  const { orderId, email } = req.query;
  if (!orderId || !email) {
    return res.status(400).json({ message: 'orderId and email are required' });
  }

  const store = loadStore();
  const order = (store.orders || []).find(
    (item) => item.id === orderId && item.customerEmail.toLowerCase() === email.toLowerCase()
  );
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json({ status: order.status, updates: order.updates });
});

router.get('/:id', authMiddleware, (req, res) => {
  const store = loadStore();
  const order = (store.orders || []).find((item) => item.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (!req.user.isAdmin && order.customerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.json({ order });
});

module.exports = router;
