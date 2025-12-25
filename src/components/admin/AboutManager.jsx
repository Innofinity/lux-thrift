import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const AboutManager = () => {
    const [formData, setFormData] = useState({
        title: 'About Us',
        subtitle: 'Our Story',
        content: '',
        mission: '',
        image: ''
    });

    useEffect(() => {
        const saved = localStorage.getItem('luxthrift_about');
        if (saved) {
            setFormData(JSON.parse(saved));
        } else {
            const defaults = {
                title: 'About Us',
                subtitle: 'Curating Luxury, One Piece at a Time',
                content: 'Welcome to LuxThrift, where vintage meets modern luxury. We carefully curate pre-loved designer pieces to bring you sustainable fashion without compromising on style.',
                mission: 'Our mission is to make luxury fashion accessible while promoting sustainable shopping practices.',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'
            };
            setFormData(defaults);
            localStorage.setItem('luxthrift_about', JSON.stringify(defaults));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('luxthrift_about', JSON.stringify(formData));
        alert('About page updated successfully!');
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-heading font-black text-white uppercase">
                    About <span className="text-primary">Page</span>
                </h2>
                <p className="text-gray-400 font-mono text-sm mt-1">
                    Manage your about page content
                </p>
            </div>

            <form onSubmit={handleSubmit} className="glass border border-white/10 rounded-sm p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                            placeholder="About Us"
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
                            placeholder="Our Story"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Hero Image URL *</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Main Content *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                            rows="6"
                            className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors resize-none"
                            placeholder="Tell your story..."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Mission Statement</label>
                        <textarea
                            name="mission"
                            value={formData.mission}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors resize-none"
                            placeholder="Your mission..."
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:scale-105"
                        >
                            <Save size={20} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>

            {/* Preview */}
            <div className="mt-8 glass border border-white/10 rounded-sm overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <h3 className="text-lg font-heading font-bold text-white uppercase">Preview</h3>
                </div>
                <div className="relative aspect-video">
                    <img src={formData.image} alt="About" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                        <h2 className="text-4xl font-heading font-black text-white">{formData.title}</h2>
                        <p className="text-primary text-lg mt-2">{formData.subtitle}</p>
                    </div>
                </div>
                <div className="p-8">
                    <p className="text-gray-300 leading-relaxed">{formData.content}</p>
                    {formData.mission && (
                        <div className="mt-6 p-6 glass border border-white/10 rounded-sm">
                            <h4 className="text-sm font-mono text-primary uppercase mb-2">Our Mission</h4>
                            <p className="text-gray-300">{formData.mission}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutManager;
