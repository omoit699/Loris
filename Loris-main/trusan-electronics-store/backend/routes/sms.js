const express = require('express');
const { authMiddleware } = require('../utils/auth');

const router = express.Router();

// Store for SMS verification codes (in memory, in production use database)
const verificationCodes = {};
const smsLog = [];

// Simulate SMS sending
function sendSMS(phoneNumber, message) {
  const smsRecord = {
    id: `sms-${Date.now()}`,
    to: phoneNumber,
    message,
    status: 'sent',
    timestamp: new Date().toISOString()
  };
  smsLog.push(smsRecord);
  console.log(`[SMS] To: ${phoneNumber}, Message: ${message}`);
  return smsRecord;
}

// Generate 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request SMS verification code for phone number
router.post('/request-verification', (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const code = generateVerificationCode();
  verificationCodes[phoneNumber] = {
    code,
    createdAt: Date.now(),
    attempts: 0,
    verified: false
  };

  const message = `Your Trusan Electronics verification code is: ${code}. Valid for 10 minutes.`;
  sendSMS(phoneNumber, message);

  res.json({ 
    message: 'Verification code sent',
    expiresIn: 600,
    phoneNumber
  });
});

// Verify SMS code
router.post('/verify-code', (req, res) => {
  const { phoneNumber, code } = req.body;
  if (!phoneNumber || !code) {
    return res.status(400).json({ message: 'Phone number and code are required' });
  }

  const verification = verificationCodes[phoneNumber];
  if (!verification) {
    return res.status(400).json({ message: 'No verification code found for this phone number' });
  }

  // Check if code expired (10 minutes)
  if (Date.now() - verification.createdAt > 600000) {
    delete verificationCodes[phoneNumber];
    return res.status(400).json({ message: 'Verification code has expired' });
  }

  // Check attempts (max 3)
  if (verification.attempts >= 3) {
    delete verificationCodes[phoneNumber];
    return res.status(400).json({ message: 'Too many failed attempts' });
  }

  if (verification.code !== code) {
    verification.attempts++;
    return res.status(400).json({ message: 'Invalid verification code' });
  }

  verification.verified = true;
  res.json({ 
    message: 'Phone number verified successfully',
    verified: true
  });
});

// Send order status update via SMS
router.post('/send-order-status', (req, res) => {
  const { phoneNumber, orderId, status, message } = req.body;
  if (!phoneNumber || !orderId || !status) {
    return res.status(400).json({ message: 'Phone number, orderId, and status are required' });
  }

  const smsMessage = `Trusan Electronics: Order ${orderId} status update - ${status}. ${message || ''}`;
  sendSMS(phoneNumber, smsMessage);

  res.json({ 
    message: 'Order status SMS sent',
    to: phoneNumber
  });
});

// Send promotional/reminder SMS
router.post('/send-reminder', (req, res) => {
  const { phoneNumber, message } = req.body;
  if (!phoneNumber || !message) {
    return res.status(400).json({ message: 'Phone number and message are required' });
  }

  sendSMS(phoneNumber, message);

  res.json({ 
    message: 'Reminder SMS sent',
    to: phoneNumber
  });
});

// Get SMS logs (admin only)
router.get('/logs', authMiddleware, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const limit = req.query.limit || 100;
  const logs = smsLog.slice(-limit);
  res.json({ logs, total: smsLog.length });
});

module.exports = router;
