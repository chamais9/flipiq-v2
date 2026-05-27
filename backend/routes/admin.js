const express     = require('express');
const router      = express.Router();
const User        = require('../models/User');
const Flashcard   = require('../models/Flashcard');
const ViewHistory = require('../models/ViewHistory');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/users', async (req, res) => {
  try {
    const users = await User.getAllWithCardCount();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load users' });
  }
});

router.get('/users/:id/cards', async (req, res) => {
  try {
    const cards = await Flashcard.findAllByUser(req.params.id);
    res.json({ success: true, data: cards });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load user cards' });
  }
});

router.get('/activity', async (req, res) => {
  try {
    const activity = await ViewHistory.getRecentActivity(50);
    res.json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load activity' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, error: 'Cannot delete admin' });

    await User.delete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

module.exports = router;
