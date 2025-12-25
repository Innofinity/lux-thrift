import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BannerManager = () => {
    const [banners, setBanners] = useState([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: '',
        buttonText: '',
        buttonLink: '',
        isActive: true
    });

    useEffect(() => {
        const savedBanners = localStorage.getItem('luxthrift_banners');
        if (savedBanners) {
            setBanners(JSON.parse(savedBanners));
        } else {
            const defaultBanners = [
                {
                    id: 1,
                    title: 'Luxury Thrift',
                    subtitle: 'Curated vintage pieces for the modern wardrobe',
                    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
                    buttonText: 'Shop Now',
                    buttonLink: '/men',
                    isActive: true
                }
            ];
            setBanners(defaultBanners);
            localStorage.setItem('luxthrift_banners', JSON.stringify(defaultBanners));
        }
    }, []);

    useEffect(() => {
        if (banners.length > 0) {
            localStorage.setItem('luxthrift_banners', JSON.stringify(banners));
        }
    }, [banners]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId !== null) {
            setBanners(prev => prev.map(b => b.id === editingId ? { ...formData, id: editingId } : b));
            setEditingId(null);
        } else {
            const newBanner = { ...formData, id: Date.now() };
            setBanners(prev => [...prev, newBanner]);
            setIsAddingNew(false);
        }
        setFormData({ title: '', subtitle: '', image: '', buttonText: '', buttonLink: '', isActive: true });
    };

    const handleEdit = (banner) => {
        setFormData(banner);
        setEditingId(banner.id);
        setIsAddingNew(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            setBanners(prev => prev.filter(b => b.id !== id));
        }
    };

    const handleCancel = () => {
        setIsAddingNew(false);
        setEditingId(null);
        setFormData({ title: '', subtitle: '', image: '', buttonText: '', buttonLink: '', isActive: true });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-heading font-black text-white uppercase">
                        Banner <span className="text-primary">Management</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mt-1">
                        {banners.length} total banners
                    </p>
                </div>
                {!isAddingNew && (
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:scale-105"
                    >
                        <Plus size={20} />
                        Add Banner
                    </button>
                )}
            </div>

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
                                {editingId ? 'Edit Banner' : 'Add New Banner'}
                            </h3>
                            <button onClick={handleCancel} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Luxury Thrift"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Subtitle *</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Curated vintage pieces"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Image URL *</label>
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

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Button Text</label>
                                <input
                                    type="text"
                                    name="buttonText"
                                    value={formData.buttonText}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Shop Now"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Button Link</label>
                                <input
                                    type="text"
                                    name="buttonLink"
                                    value={formData.buttonLink}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="/men"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 bg-black/50 border border-white/10 rounded-sm text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-mono text-gray-400 uppercase">Active</span>
                                </label>
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
                                    {editingId ? 'Update' : 'Save'} Banner
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner) => (
                    <div key={banner.id} className="glass border border-white/10 rounded-sm overflow-hidden group">
                        <div className="relative aspect-video">
                            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                <h3 className="text-2xl font-heading font-black text-white">{banner.title}</h3>
                                <p className="text-gray-300 text-sm mt-1">{banner.subtitle}</p>
                                {banner.buttonText && (
                                    <span className="text-primary text-sm font-mono mt-2">→ {banner.buttonText}</span>
                                )}
                            </div>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-mono rounded-full ${banner.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {banner.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(banner)}
                                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(banner.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {banners.length === 0 && (
                <div className="text-center py-12 glass border border-white/10 rounded-sm">
                    <p className="text-gray-400 font-mono">No banners yet. Add your first banner!</p>
                </div>
            )}
        </div>
    );
};

export default BannerManager;
