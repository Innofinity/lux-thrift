import React, { useState, useEffect } from 'react';
import { Save, Globe, Share2, Search } from 'lucide-react';

const SEOManager = () => {
    const [settings, setSettings] = useState({
        siteTitle: 'LuxThrift',
        siteDescription: 'Premium Luxury Thrift Store',
        keywords: 'luxury, thrift, vintage, fashion, sustainable',
        socialImage: '',
        facebook: '',
        instagram: '',
        twitter: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('luxthrift_seo_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('luxthrift_seo_settings', JSON.stringify(settings));
            setIsSaving(false);
            alert('SEO Settings Saved Successfully!');
        }, 800);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-heading font-black text-white uppercase">
                        SEO <span className="text-primary">Settings</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mt-1">
                        Manage global search engine optimization and social sharing
                    </p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-50"
                >
                    <Save size={20} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General SEO */}
                <div className="glass border border-white/10 rounded-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className="text-primary" size={24} />
                        <h3 className="text-xl font-heading font-bold text-white uppercase">
                            Global Metadata
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                Site Title
                            </label>
                            <input
                                type="text"
                                name="siteTitle"
                                value={settings.siteTitle}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                placeholder="LuxThrift - Premium Vintage"
                            />
                            <p className="text-xs text-gray-500 mt-1">Appears in browser tab and search results.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                Meta Description
                            </label>
                            <textarea
                                name="siteDescription"
                                value={settings.siteDescription}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors resize-none"
                                placeholder="Discover curated luxury vintage pieces..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                Global Keywords
                            </label>
                            <input
                                type="text"
                                name="keywords"
                                value={settings.keywords}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                placeholder="fashion, vintage, luxury, thrift"
                            />
                            <p className="text-xs text-gray-500 mt-1">Comma separated keywords.</p>
                        </div>
                    </div>
                </div>

                {/* Social & Sharing */}
                <div className="glass border border-white/10 rounded-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Share2 className="text-primary" size={24} />
                        <h3 className="text-xl font-heading font-bold text-white uppercase">
                            Social Media & OG Tags
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                Social Share Image (OG:Image)
                            </label>
                            <input
                                type="url"
                                name="socialImage"
                                value={settings.socialImage}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                Facebook URL
                            </label>
                            <input
                                type="url"
                                name="facebook"
                                value={settings.facebook}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                placeholder="https://facebook.com/fluxthrift"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                Instagram URL
                            </label>
                            <input
                                type="url"
                                name="instagram"
                                value={settings.instagram}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                placeholder="https://instagram.com/fluxthrift"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                Twitter/X URL
                            </label>
                            <input
                                type="url"
                                name="twitter"
                                value={settings.twitter}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                placeholder="https://twitter.com/fluxthrift"
                            />
                        </div>
                    </div>
                </div>

                {/* Preview Card */}
                <div className="lg:col-span-2 glass border border-white/10 rounded-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Search className="text-primary" size={24} />
                        <h3 className="text-xl font-heading font-bold text-white uppercase">
                            Search Result Preview
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-md max-w-2xl">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-600 truncate">https://luxthrift.com</span>
                            <h4 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium truncate">
                                {settings.siteTitle || 'LuxThrift - Premium Luxury Thrift Store'}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {settings.siteDescription || 'Discover curated luxury vintage pieces from top brands...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SEOManager;
