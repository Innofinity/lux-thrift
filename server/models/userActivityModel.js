const mongoose = require('mongoose');

const userActivitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    guestId: {
        type: String, // For tracking non-logged in users
        required: false
    },
    action: {
        type: String,
        required: true,
        enum: ['view_product', 'add_to_cart', 'search', 'purchase', 'view_category']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    },
    category: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;
