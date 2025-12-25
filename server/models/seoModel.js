const mongoose = require('mongoose');

const seoSchema = mongoose.Schema({
    siteTitle: { type: String, required: true, default: 'LuxThrift' },
    siteDescription: { type: String, required: true, default: 'Luxury Thrift Store' },
    keywords: { type: String, default: 'luxury, thrift, vintage, fashion' },
    socialImage: { type: String }, // OG Image
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String }
}, {
    timestamps: true
});

const SEO = mongoose.model('SEO', seoSchema);

module.exports = SEO;
