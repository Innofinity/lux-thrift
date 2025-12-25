const UserActivity = require('../models/userActivityModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Get CRM insights for admin
// @route   GET /api/crm/insights
// @access  Private/Admin
const getCRMInsights = async (req, res) => {
    try {
        // 1. Get Top Viewed Products
        const topProducts = await UserActivity.aggregate([
            { $match: { action: 'view_product', product: { $ne: null } } },
            { $group: { _id: '$product', views: { $sum: 1 } } },
            { $sort: { views: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' }
        ]);

        // 2. Get Trending Categories
        const trendingCategories = await UserActivity.aggregate([
            { $match: { category: { $ne: null } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // 3. User Engagement (Latest activities)
        const recentActivities = await UserActivity.find()
            .populate('user', 'name email')
            .populate('product', 'name price image')
            .sort({ createdAt: -1 })
            .limit(10);

        // 4. Recommendation Suggester (logic-based)
        // For a simple demo: suggest products to users based on their most viewed category
        const userPreferences = await UserActivity.aggregate([
            { $match: { user: { $ne: null }, category: { $ne: null } } },
            { $group: { _id: { user: '$user', category: '$category' }, count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            topProducts,
            trendingCategories,
            recentActivities,
            userPreferences
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recommendations for a specific user
// @route   GET /api/crm/recommendations/:userId
const getUserRecommendations = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find user's most viewed category or brand
        const preferences = await UserActivity.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    favoriteCategory: { $first: '$category' },
                    favoriteBrand: { $first: '$brand' }
                }
            }
        ]);

        if (!preferences.length) {
            return res.json([]);
        }

        const { favoriteCategory, favoriteBrand } = preferences[0];

        // Suggest products matching these filters
        const suggestions = await Product.find({
            $or: [
                { category: favoriteCategory },
                { brand: favoriteBrand }
            ]
        }).limit(4);

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCRMInsights, getUserRecommendations };
