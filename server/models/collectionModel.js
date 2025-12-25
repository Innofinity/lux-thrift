const mongoose = require('mongoose');

const collectionSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
