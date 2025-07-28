const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  const { date } = req.query;
  let filter = {};
 if (date) {
    const [year, month, day] = date.split('-').map(Number);
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    filter.date = { $gte: start, $lte: end };

    // ✅ Only log when start/end exist
    console.log('Filtering transactions from:', start.toISOString(), 'to:', end.toISOString());
  }


  const transactions = await Transaction.find(filter);
  res.json(transactions);
});


router.post('/', async (req, res) => {
  const { description, amount } = req.body;
  const transaction = new Transaction({ description, amount });
  await transaction.save();
  res.json(transaction);
});

module.exports = router;