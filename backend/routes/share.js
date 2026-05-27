const express    = require('express');
const router     = express.Router();
const Share      = require('../models/Share');
const Flashcard  = require('../models/Flashcard');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', async (req, res) => {
  try {
    const { category } = req.body;
    if (!category)
      return res.status(400).json({ success: false, error: 'Category is required' });

    const shareCode = await Share.create(req.user.id, category);
    res.status(201).json({ success: true, shareCode });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create share code' });
  }
});

router.get('/my', async (req, res) => {
  try {
    const decks = await Share.findByUser(req.user.id);
    res.json({ success: true, data: decks });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load shared decks' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const deck = await Share.findByCode(req.params.code);
    if (!deck)
      return res.status(404).json({ success: false, error: 'Share code not found' });

    const cards = await Flashcard.findByUser(deck.userId, { category: deck.category });
    res.json({ success: true, deck, cards });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load shared deck' });
  }
});

router.post('/:code/import', async (req, res) => {
  try {
    const deck = await Share.findByCode(req.params.code);
    if (!deck)
      return res.status(404).json({ success: false, error: 'Share code not found' });

    if (deck.userId === req.user.id)
      return res.status(400).json({ success: false, error: 'Cannot import your own deck' });

    const sourceCards = await Flashcard.findByUser(deck.userId, { category: deck.category });

    await Promise.all(
      sourceCards.map(card =>
        Flashcard.create({
          userId:     req.user.id,
          question:   card.question,
          answer:     card.answer,
          category:   `${deck.category} (from ${deck.ownerName})`,
          difficulty: card.difficulty
        })
      )
    );

    res.status(201).json({ success: true, message: `Imported ${sourceCards.length} cards successfully` });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to import deck' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Share.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Share not found' });
    res.json({ success: true, message: 'Share removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to remove share' });
  }
});

module.exports = router;
