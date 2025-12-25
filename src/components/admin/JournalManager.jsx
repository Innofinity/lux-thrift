import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JournalManager = () => {
    const [posts, setPosts] = useState([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        slug: '',
        metaTitle: '',
        metaDescription: '',
        keywords: ''
    });

    useEffect(() => {
        const saved = localStorage.getItem('luxthrift_journal');
        if (saved) {
            setPosts(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (posts.length > 0) {
            localStorage.setItem('luxthrift_journal', JSON.stringify(posts));
        }
    }, [posts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId !== null) {
            setPosts(prev => prev.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
            setEditingId(null);
        } else {
            setPosts(prev => [...prev, { ...formData, id: Date.now() }]);
            setIsAddingNew(false);
        }
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            image: '',
            author: '',
            date: new Date().toISOString().split('T')[0],
            slug: '',
            metaTitle: '',
            metaDescription: '',
            keywords: ''
        });
    };

    const handleEdit = (post) => {
        setFormData(post);
        setEditingId(post.id);
        setIsAddingNew(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this post?')) {
            setPosts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleCancel = () => {
        setIsAddingNew(false);
        setEditingId(null);
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            image: '',
            author: '',
            date: new Date().toISOString().split('T')[0],
            slug: '',
            metaTitle: '',
            metaDescription: '',
            keywords: ''
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-heading font-black text-white uppercase">
                        Journal <span className="text-primary">Posts</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mt-1">{posts.length} posts</p>
                </div>
                {!isAddingNew && (
                    <button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:scale-105">
                        <Plus size={20} />
                        Add Post
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isAddingNew && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass border border-white/10 rounded-sm p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-heading font-bold text-white uppercase">{editingId ? 'Edit' : 'Add'} Post</h3>
                            <button onClick={handleCancel} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="Post title" />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Author *</label>
                                <input type="text" name="author" value={formData.author} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="Author name" />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Date *</label>
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Image URL *</label>
                                <input type="url" name="image" value={formData.image} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="https://..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Excerpt</label>
                                <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows="2" className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors resize-none" placeholder="Short description..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Content *</label>
                                <textarea name="content" value={formData.content} onChange={handleInputChange} required rows="6" className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors resize-none" placeholder="Full post content..." />
                            </div>

                            <div className="md:col-span-2 border-t border-white/10 pt-6 mt-2">
                                <h4 className="text-lg font-heading font-bold text-white uppercase mb-4">SEO Settings</h4>
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">URL Slug</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="my-journal-post" />
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
                                <button type="button" onClick={handleCancel} className="px-6 py-3 border border-white/20 text-white rounded-sm font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:scale-105"><Save size={20} />{editingId ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="glass border border-white/10 rounded-sm p-6 flex gap-6">
                        <img src={post.image} alt={post.title} className="w-32 h-32 object-cover rounded-sm flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-xl font-heading font-bold text-white">{post.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{post.excerpt}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs font-mono text-gray-500">
                                <span>{post.author}</span>
                                <span>•</span>
                                <span>{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 items-start">
                            <button onClick={() => handleEdit(post)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-12 glass border border-white/10 rounded-sm">
                    <p className="text-gray-400 font-mono">No journal posts yet. Add your first post!</p>
                </div>
            )}
        </div>
    );
};

export default JournalManager;
