const UserActivity = require('../models/userActivityModel');
const Product = require('../models/productModel');

// @desc    Track user activity
// @route   POST /api/activity
// @access  Public
const logActivity = async (req, res) => {
    try {
        const { action, productId, category, brand, metadata, guestId } = req.body;

        const activity = await UserActivity.create({
            user: req.user ? req.user._id : null,
            guestId,
            action,
            product: productId,
            category,
            brand,
            metadata
        });

        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { logActivity };
