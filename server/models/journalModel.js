const mongoose = require('mongoose');

const journalSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;
