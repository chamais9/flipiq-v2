const express     = require('express');
const router      = express.Router();
const ViewHistory = require('../models/ViewHistory');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/submit', async (req, res) => {
  try {
    const { score, total, category } = req.body;
    if (score === undefined || !total)
      return res.status(400).json({ success: false, error: 'Score and total are required' });

    await ViewHistory.saveQuizScore(req.user.id, { score, total, category });
    res.status(201).json({ success: true, message: 'Score saved' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save score' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await ViewHistory.getQuizHistory(req.user.id);
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load history' });
  }
});

router.get('/today', async (req, res) => {
  try {
    const count = await ViewHistory.getTodayReveals(req.user.id);
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load today stats' });
  }
});

module.exports = router;
