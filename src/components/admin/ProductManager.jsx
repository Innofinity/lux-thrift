import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        discountPercentage: '',
        image: '',
        description: '',
        category: '',
        gender: 'Men',
        condition: 'Good',
        slug: '',
        metaTitle: '',
        metaDescription: '',
        keywords: ''
    });

    // Load products from localStorage on mount
    useEffect(() => {
        const savedProducts = localStorage.getItem('luxthrift_products');
        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        } else {
            // Import initial products from data file
            import('../../data/products').then(module => {
                setProducts(module.products);
                localStorage.setItem('luxthrift_products', JSON.stringify(module.products));
            });
        }
    }, []);

    // Save products to localStorage whenever they change
    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem('luxthrift_products', JSON.stringify(products));
        }
    }, [products]);

    const categories = {
        Men: ['T-Shirts', 'Shirts', 'Bottom Wear', 'Footwear', 'Accessories'],
        Women: ['Tops & Tees', 'Dresses', 'Co-od Sets', 'Shoes & Sandals', 'Accessories']
    };

    const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Vintage'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { ...prev, [name]: value };

            // Calculate final price if original price or discount changes
            if (name === 'originalPrice' || name === 'discountPercentage') {
                const original = parseFloat(name === 'originalPrice' ? value : prev.originalPrice);
                const discount = parseFloat(name === 'discountPercentage' ? value : prev.discountPercentage);

                if (!isNaN(original) && !isNaN(discount)) {
                    updates.price = (original - (original * discount / 100)).toFixed(2);
                } else if (!isNaN(original)) {
                    // If no discount, price = original
                    updates.price = original;
                }
            }
            // Recalculate discount if price changes directly
            else if (name === 'price') {
                const price = parseFloat(value);
                const original = parseFloat(prev.originalPrice);
                if (!isNaN(price) && !isNaN(original) && original > 0) {
                    updates.discountPercentage = (((original - price) / original) * 100).toFixed(0);
                }
            }

            return updates;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId !== null) {
            // Update existing product
            setProducts(prev => prev.map(p =>
                p.id === editingId ? { ...formData, id: editingId } : p
            ));
            setEditingId(null);
        } else {
            // Add new product
            const newProduct = {
                ...formData,
                id: Date.now(),
                price: parseFloat(formData.price),
                originalPrice: parseFloat(formData.originalPrice),
                discountPercentage: parseFloat(formData.discountPercentage),
                slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                keywords: formData.keywords
            };
            setProducts(prev => [...prev, newProduct]);
            setIsAddingNew(false);
        }

        // Reset form
        setFormData({
            name: '',
            price: '',
            originalPrice: '',
            discountPercentage: '',
            image: '',
            description: '',
            category: '',
            gender: 'Men',
            condition: 'Good',
            slug: '',
            metaTitle: '',
            metaDescription: '',
            keywords: ''
        });
    };

    const handleEdit = (product) => {
        setFormData(product);
        setEditingId(product.id);
        setIsAddingNew(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleCancel = () => {
        setIsAddingNew(false);
        setEditingId(null);
        setFormData({
            name: '',
            price: '',
            originalPrice: '',
            discountPercentage: '',
            image: '',
            description: '',
            category: '',
            gender: 'Men',
            condition: 'Good',
            slug: '',
            metaTitle: '',
            metaDescription: '',
            keywords: ''
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-heading font-black text-white uppercase">
                        Product <span className="text-primary">Inventory</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mt-1">
                        {products.length} total products
                    </p>
                </div>
                {!isAddingNew && (
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:scale-105"
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            <AnimatePresence>
                {isAddingNew && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass border border-white/10 rounded-sm p-8 mb-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-heading font-bold text-white uppercase">
                                {editingId ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="e.g., Vintage Prada Bag"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-4 uppercase border-b border-white/10 pb-2">
                                    Pricing & Discount
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">
                                            Original Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            value={formData.originalPrice}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                            placeholder="5000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">
                                            Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="discountPercentage"
                                            value={formData.discountPercentage}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                            className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                            placeholder="10"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-primary mb-2 uppercase">
                                            Final Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full bg-primary/10 border border-primary/30 rounded-sm px-4 py-3 text-primary font-bold focus:border-primary focus:outline-none transition-colors"
                                            placeholder="4500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                    Image URL *
                                </label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors resize-none"
                                    placeholder="Describe the product, materials, condition details, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                    Gender *
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                >
                                    <option value="">Select Category</option>
                                    {categories[formData.gender].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                    Condition *
                                </label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                >
                                    {conditions.map(cond => (
                                        <option key={cond} value={cond}>{cond}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2 border-t border-white/10 pt-6 mt-2">
                                <h4 className="text-lg font-heading font-bold text-white uppercase mb-4">SEO Settings</h4>
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">URL Slug</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="my-product-name" />
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Keywords</label>
                                <input type="text" name="keywords" value={formData.keywords} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="keyword1, keyword2" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Meta Title</label>
                                <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="SEO Title" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Meta Description</label>
                                <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows="2" className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors resize-none" placeholder="SEO Description..." />
                            </div>

                            <div className="md:col-span-2 flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 border border-white/20 text-white rounded-sm font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:scale-105"
                                >
                                    <Save size={20} />
                                    {editingId ? 'Update' : 'Save'} Product
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Products Table */}
            <div className="glass border border-white/10 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left px-6 py-4 text-sm font-mono text-gray-400 uppercase">Image</th>
                                <th className="text-left px-6 py-4 text-sm font-mono text-gray-400 uppercase">Name</th>
                                <th className="text-left px-6 py-4 text-sm font-mono text-gray-400 uppercase">Description</th>
                                <th className="text-left px-6 py-4 text-sm font-mono text-gray-400 uppercase">Price</th>
                                <th className="text-left px-6 py-4 text-sm font-mono text-gray-400 uppercase">Gender</th>
                                <th className="text-left px-6 py-4 text-sm font-mono text-gray-400 uppercase">Category</th>
                                <th className="text-left px-6 py-4 text-sm font-mono text-gray-400 uppercase">Condition</th>
                                <th className="text-left px-6 py-4 text-sm font-mono text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">{product.name}</td>
                                    <td className="px-6 py-4 text-gray-300 text-sm max-w-xs truncate">
                                        {product.description || 'No description'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-primary font-bold">₹{product.price}</span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-gray-500 line-through">₹{product.originalPrice}</span>
                                                    {product.discountPercentage > 0 && (
                                                        <span className="text-red-400">-{product.discountPercentage}%</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{product.gender}</td>
                                    <td className="px-6 py-4 text-gray-300">{product.category}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-mono rounded-full">
                                            {product.condition}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 font-mono">No products yet. Add your first product!</p>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="glass border border-white/10 rounded-sm p-6">
                    <p className="text-sm font-mono text-gray-400 uppercase mb-2">Total Products</p>
                    <p className="text-4xl font-heading font-black text-white">{products.length}</p>
                </div>
                <div className="glass border border-white/10 rounded-sm p-6">
                    <p className="text-sm font-mono text-gray-400 uppercase mb-2">Men's Items</p>
                    <p className="text-4xl font-heading font-black text-white">
                        {products.filter(p => p.gender === 'Men').length}
                    </p>
                </div>
                <div className="glass border border-white/10 rounded-sm p-6">
                    <p className="text-sm font-mono text-gray-400 uppercase mb-2">Women's Items</p>
                    <p className="text-4xl font-heading font-black text-white">
                        {products.filter(p => p.gender === 'Women').length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductManager;
