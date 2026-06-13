const express = require('express');
const { loadStore, saveStore } = require('../utils/store');
const { authMiddleware } = require('../utils/auth');

const router = express.Router();

// Submit feedback for an order
router.post('/', authMiddleware, (req, res) => {
  const { orderId, rating, comment, deliveryRating, productQuality, customerService } = req.body;
  
  if (!orderId || !rating) {
    return res.status(400).json({ message: 'Order ID and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const store = loadStore();
  const order = (store.orders || []).find(o => o.id === orderId);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (!req.user.isAdmin && order.customerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
    return res.status(403).json({ message: 'You are not authorized to submit feedback for this order' });
  }

  // Check if feedback already exists
  if (order.feedback) {
    return res.status(400).json({ message: 'Feedback already submitted for this order' });
  }

  const feedback = {
    id: `feedback-${Date.now()}`,
    orderId,
    customerId: req.user.id,
    customerEmail: req.user.email,
    customerName: req.user.name,
    rating,
    comment: comment || '',
    deliveryRating: deliveryRating || 0,
    productQuality: productQuality || 0,
    customerService: customerService || 0,
    createdAt: new Date().toISOString()
  };

  order.feedback = feedback;
  
  store.feedback = store.feedback || [];
  store.feedback.push(feedback);
  
  saveStore(store);

  res.json({ 
    message: 'Feedback submitted successfully',
    feedback
  });
});

// Get feedback for an order
router.get('/order/:orderId', (req, res) => {
  const store = loadStore();
  const order = (store.orders || []).find(o => o.id === req.params.orderId);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json({ 
    feedback: order.feedback || null,
    orderId: req.params.orderId
  });
});

// Get all feedback for user
router.get('/user/all', authMiddleware, (req, res) => {
  const store = loadStore();
  const userFeedback = (store.feedback || []).filter(
    f => f.customerId === req.user.id
  );

  res.json({ 
    feedback: userFeedback,
    total: userFeedback.length
  });
});

// Get all feedback (admin only)
router.get('/admin/all', authMiddleware, (req, res) => {
  const store = loadStore();
  const user = (store.users || []).find(u => u.id === req.user.id);

  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const allFeedback = store.feedback || [];
  const stats = {
    total: allFeedback.length,
    averageRating: allFeedback.length > 0 
      ? (allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length).toFixed(2)
      : 0,
    averageDelivery: allFeedback.length > 0
      ? (allFeedback.reduce((sum, f) => sum + (f.deliveryRating || 0), 0) / allFeedback.length).toFixed(2)
      : 0,
    averageQuality: allFeedback.length > 0
      ? (allFeedback.reduce((sum, f) => sum + (f.productQuality || 0), 0) / allFeedback.length).toFixed(2)
      : 0,
    averageService: allFeedback.length > 0
      ? (allFeedback.reduce((sum, f) => sum + (f.customerService || 0), 0) / allFeedback.length).toFixed(2)
      : 0
  };

  res.json({ 
    feedback: allFeedback,
    stats
  });
});

// Delete feedback (admin only)
router.delete('/:feedbackId', authMiddleware, (req, res) => {
  const store = loadStore();
  const user = (store.users || []).find(u => u.id === req.user.id);

  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  store.feedback = (store.feedback || []).filter(f => f.id !== req.params.feedbackId);
  saveStore(store);

  res.json({ message: 'Feedback deleted successfully' });
});

module.exports = router;
