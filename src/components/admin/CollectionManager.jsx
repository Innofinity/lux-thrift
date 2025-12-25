import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CollectionManager = () => {
    const [collections, setCollections] = useState([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        slug: ''
    });

    useEffect(() => {
        const saved = localStorage.getItem('luxthrift_collections');
        if (saved) {
            setCollections(JSON.parse(saved));
        } else {
            const defaults = [
                {
                    id: 1,
                    name: 'Archive Pieces',
                    description: 'Rare vintage finds from iconic designers',
                    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
                    slug: 'archive-pieces'
                }
            ];
            setCollections(defaults);
            localStorage.setItem('luxthrift_collections', JSON.stringify(defaults));
        }
    }, []);

    useEffect(() => {
        if (collections.length > 0) {
            localStorage.setItem('luxthrift_collections', JSON.stringify(collections));
        }
    }, [collections]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'name' && { slug: value.toLowerCase().replace(/\s+/g, '-') })
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId !== null) {
            setCollections(prev => prev.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
            setEditingId(null);
        } else {
            setCollections(prev => [...prev, { ...formData, id: Date.now() }]);
            setIsAddingNew(false);
        }
        setFormData({ name: '', description: '', image: '', slug: '' });
    };

    const handleEdit = (collection) => {
        setFormData(collection);
        setEditingId(collection.id);
        setIsAddingNew(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this collection?')) {
            setCollections(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleCancel = () => {
        setIsAddingNew(false);
        setEditingId(null);
        setFormData({ name: '', description: '', image: '', slug: '' });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-heading font-black text-white uppercase">
                        Collection <span className="text-primary">Management</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mt-1">{collections.length} collections</p>
                </div>
                {!isAddingNew && (
                    <button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:scale-105">
                        <Plus size={20} />
                        Add Collection
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isAddingNew && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass border border-white/10 rounded-sm p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-heading font-bold text-white uppercase">{editingId ? 'Edit' : 'Add'} Collection</h3>
                            <button onClick={handleCancel} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="Archive Pieces" />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Slug *</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="archive-pieces" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors resize-none" placeholder="Describe this collection..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Image URL *</label>
                                <input type="url" name="image" value={formData.image} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="https://..." />
                            </div>
                            <div className="md:col-span-2 flex gap-4 justify-end">
                                <button type="button" onClick={handleCancel} className="px-6 py-3 border border-white/20 text-white rounded-sm font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:scale-105"><Save size={20} />{editingId ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {collections.map((collection) => (
                    <div key={collection.id} className="glass border border-white/10 rounded-sm overflow-hidden group">
                        <div className="relative aspect-square">
                            <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-heading font-bold text-white">{collection.name}</h3>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{collection.description}</p>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => handleEdit(collection)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={18} /></button>
                                <button onClick={() => handleDelete(collection.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {collections.length === 0 && (
                <div className="text-center py-12 glass border border-white/10 rounded-sm">
                    <p className="text-gray-400 font-mono">No collections yet. Add your first collection!</p>
                </div>
            )}
        </div>
    );
};

export default CollectionManager;
