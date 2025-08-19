const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions for a specific user (with optional date filter)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { date } = req.query;

  let filter = { userId };

  if (date) {
    const [year, month, day] = date.split('-').map(Number);
    const start = new Date(year, month - 1, day, 0, 0, 0);
    const end = new Date(year, month - 1, day, 23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  try {
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new transaction
router.post('/', async (req, res) => {
  const { userId, amount, type, category, date, description } = req.body;

  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  try {
    const transaction = new Transaction({
      userId,
      amount,
      type,
      category,
      date: date ? new Date(date) : new Date(), // ensure Date object
      description,
    });
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    console.error('Error saving transaction:', err); // 👈 log the actual error
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
