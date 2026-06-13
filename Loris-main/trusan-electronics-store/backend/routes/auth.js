const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loadStore, saveStore } = require('../utils/store');
const { sendEmailVerification, sendEmail } = require('../utils/notifications');

const JWT_SECRET = process.env.JWT_SECRET || 'trusan_secret_2026';

// Store for email verification codes (in production, use database)
const emailVerificationCodes = {};
const phoneVerificationStatus = {};

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, JWT_SECRET, {
    expiresIn: '4h'
  });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = function createAuthRoutes(io) {
  const router = express.Router();

  router.post('/signup', async (req, res) => {
    const { name, email, password, phoneNumber, emailVerificationCode, phoneVerified } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'Name, email, password, and phone number are required' });
    }

    const normalizedEmail = email.toLowerCase();

    // Check email verification
    const verification = emailVerificationCodes[normalizedEmail];
    if (
      !emailVerificationCode ||
      !verification ||
      verification.code !== emailVerificationCode ||
      !verification.verified
    ) {
      return res.status(400).json({ message: 'Email verification required. Please verify your email first.' });
    }

    // Check phone verification
    if (!phoneVerified || !phoneVerificationStatus[phoneNumber] || !phoneVerificationStatus[phoneNumber].verified) {
      return res.status(400).json({ message: 'Phone number verification required. Please verify your phone first.' });
    }

    const store = loadStore();
    if ((store.users || []).find((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    if ((store.users || []).find((user) => user.phoneNumber === phoneNumber)) {
      return res.status(409).json({ message: 'An account with that phone number already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
      phoneNumber,
      passwordHash,
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date().toISOString(),
      isAdmin: false
    };

    store.users = store.users || [];
    store.users.push(user);
    saveStore(store);

    // Clean up verification codes
    delete emailVerificationCodes[email];
    delete phoneVerificationStatus[phoneNumber];

    const token = createToken(user);
    if (io) {
      io.emit('userSignedIn', { name: user.name, email: user.email, phoneNumber: user.phoneNumber, isAdmin: user.isAdmin });
    }

    res.json({ 
      user: { name: user.name, email: user.email, phoneNumber: user.phoneNumber, isAdmin: user.isAdmin }, 
      token 
    });
  });

  router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const store = loadStore();
    const user = (store.users || []).find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = user.passwordHash
      ? bcrypt.compareSync(password, user.passwordHash)
      : password === user.password;

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user);
    if (io) {
      io.emit('userSignedIn', { name: user.name, email: user.email, isAdmin: user.isAdmin });
    }

    res.json({ user: { name: user.name, email: user.email, isAdmin: user.isAdmin }, token });
  });

  router.get('/me', authMiddleware, (req, res) => {
    const store = loadStore();
    const user = (store.users || []).find((item) => item.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: { name: user.name, email: user.email, phoneNumber: user.phoneNumber, isAdmin: user.isAdmin } });
  });

  // Request email verification code
  router.post('/request-email-verification', async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    emailVerificationCodes[email] = {
      code,
      createdAt: Date.now(),
      attempts: 0
    };

    // Send actual email
    try {
      await sendEmailVerification(email, code);
      res.json({
        message: 'Email verification code sent',
        expiresIn: 600
      });
    } catch (error) {
      console.error('Email verification failed:', error);
      res.status(500).json({
        message: 'Failed to send verification email. Please try again.'
      });
    }
  });

  // Verify email code
  router.post('/verify-email-code', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const verification = emailVerificationCodes[email];
    if (!verification) {
      return res.status(400).json({ message: 'No verification code found for this email' });
    }

    // Check if code expired (10 minutes)
    if (Date.now() - verification.createdAt > 600000) {
      delete emailVerificationCodes[email];
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Check attempts (max 3)
    if (verification.attempts >= 3) {
      delete emailVerificationCodes[email];
      return res.status(400).json({ message: 'Too many failed attempts' });
    }

    if (verification.code !== code) {
      verification.attempts++;
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    verification.verified = true;
    res.json({ 
      message: 'Email verified successfully',
      verified: true
    });
  });

  // Update phone verification status (after SMS verification)
  router.post('/mark-phone-verified', (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    phoneVerificationStatus[phoneNumber] = {
      verified: true,
      verifiedAt: new Date().toISOString()
    };

    res.json({ 
      message: 'Phone marked as verified',
      verified: true
    });
  });

  return router;
};
