const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Login or Register with email
router.post('/login', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            // If not, create new user
            user = new User({ email });
            await user.save();
        }

        // Send user data as response
        res.json({ userId: user._id, email: user.email });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
