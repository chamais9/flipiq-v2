const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'flipiq_jwt_secret_key_2024';

const signToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: '7d' }
);

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, university } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: 'Name, email and password are required' });

    if (password.length < 6)
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });

    const existing = await User.findByEmail(email);
    if (existing)
      return res.status(400).json({ success: false, error: 'Email already registered' });

    const id   = await User.create({ name, email, password, university });
    const user = await User.findById(id);
    const token = signToken(user);

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password required' });

    const user = await User.findByEmail(email);
    if (!user)
      return res.status(401).json({ success: false, error: 'Invalid email or password' });

    const match = await User.verifyPassword(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, error: 'Invalid email or password' });

    const { password: _, ...safeUser } = user;
    const token = signToken(user);

    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, university } = req.body;
    if (!name)
      return res.status(400).json({ success: false, error: 'Name is required' });

    const updated = await User.updateProfile(req.user.id, { name, bio, university });
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

module.exports = router;
