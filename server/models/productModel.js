const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercentage: { type: Number, default: 0 },
    size: { type: String, required: true },
    condition: { type: String, required: true },
    category: { type: String, required: true }, // 'men' or 'women'
    subCategory: { type: String, required: true }, // 't-shirts', 'dresses', etc.
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    slug: { type: String, unique: true, sparse: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
