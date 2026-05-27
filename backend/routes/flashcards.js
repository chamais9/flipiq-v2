const express     = require('express');
const router      = express.Router();
const Flashcard   = require('../models/Flashcard');
const ViewHistory = require('../models/ViewHistory');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { q, category, difficulty } = req.query;
    const cards = await Flashcard.findByUser(req.user.id, { q, category, difficulty });
    res.json({ success: true, data: cards, count: cards.length });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load flashcards' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Flashcard.getCategoriesByUser(req.user.id);
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load categories' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { question, answer, category, difficulty } = req.body;
    if (!question || !answer)
      return res.status(400).json({ success: false, error: 'Question and answer are required' });

    const card = await Flashcard.create({ userId: req.user.id, question, answer, category, difficulty });
    res.status(201).json({ success: true, data: card });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create flashcard' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { question, answer, category, difficulty } = req.body;
    if (!question || !answer)
      return res.status(400).json({ success: false, error: 'Question and answer are required' });

    const card = await Flashcard.update(req.params.id, req.user.id, { question, answer, category, difficulty });
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update flashcard' });
  }
});

router.patch('/:id/reveal', async (req, res) => {
  try {
    const card = await Flashcard.incrementReveal(req.params.id, req.user.id);
    await ViewHistory.logReveal(req.user.id, req.params.id);
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update reveal' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Flashcard.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Card not found' });
    res.json({ success: true, message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete flashcard' });
  }
});

module.exports = router;
