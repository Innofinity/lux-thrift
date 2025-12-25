import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';

const ThemeManager = () => {
    const [formData, setFormData] = useState({
        primaryColor: '#ccff00',
        backgroundColor: '#0a0a0a',
        surfaceColor: '#141414',
        fontHeading: 'Outfit',
        fontBody: 'Inter'
    });

    useEffect(() => {
        const saved = localStorage.getItem('luxthrift_theme');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    setFormData(prev => {
                        const newTheme = { ...prev, ...parsed };
                        // Apply theme on mount
                        document.documentElement.style.setProperty('--color-primary', newTheme.primaryColor);
                        document.documentElement.style.setProperty('--color-background', newTheme.backgroundColor);
                        document.documentElement.style.setProperty('--color-surface', newTheme.surfaceColor);
                        return newTheme;
                    });
                }
            } catch (error) {
                console.error('Error parsing stored theme:', error);
                // Fallback to defaults is already handled by initial state
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('luxthrift_theme', JSON.stringify(formData));

        // Apply theme to CSS variables
        document.documentElement.style.setProperty('--color-primary', formData.primaryColor);
        document.documentElement.style.setProperty('--color-background', formData.backgroundColor);
        document.documentElement.style.setProperty('--color-surface', formData.surfaceColor);

        alert('Theme updated! Refresh the page to see full changes.');
    };

    const handleReset = () => {
        const defaults = {
            primaryColor: '#ccff00',
            backgroundColor: '#0a0a0a',
            surfaceColor: '#141414',
            fontHeading: 'Outfit',
            fontBody: 'Inter'
        };
        setFormData(defaults);
        localStorage.setItem('luxthrift_theme', JSON.stringify(defaults));
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-heading font-black text-white uppercase">
                    Theme <span className="text-primary">Customization</span>
                </h2>
                <p className="text-gray-400 font-mono text-sm mt-1">
                    Customize your store's appearance
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="glass border border-white/10 rounded-sm p-8">
                    <h3 className="text-xl font-heading font-bold text-white uppercase mb-6">Color Scheme</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Primary Color</label>
                            <div className="flex gap-4">
                                <input
                                    type="color"
                                    name="primaryColor"
                                    value={formData.primaryColor}
                                    onChange={handleInputChange}
                                    className="w-20 h-12 bg-black/50 border border-white/10 rounded-sm cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                                    className="flex-1 bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Background Color</label>
                            <div className="flex gap-4">
                                <input
                                    type="color"
                                    name="backgroundColor"
                                    value={formData.backgroundColor}
                                    onChange={handleInputChange}
                                    className="w-20 h-12 bg-black/50 border border-white/10 rounded-sm cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.backgroundColor}
                                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                    className="flex-1 bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Surface Color</label>
                            <div className="flex gap-4">
                                <input
                                    type="color"
                                    name="surfaceColor"
                                    value={formData.surfaceColor}
                                    onChange={handleInputChange}
                                    className="w-20 h-12 bg-black/50 border border-white/10 rounded-sm cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.surfaceColor}
                                    onChange={(e) => setFormData(prev => ({ ...prev, surfaceColor: e.target.value }))}
                                    className="flex-1 bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-heading font-bold text-white uppercase mb-6 mt-8">Typography</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Heading Font</label>
                            <select
                                name="fontHeading"
                                value={formData.fontHeading}
                                onChange={handleInputChange}
                                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                            >
                                <option value="Outfit">Outfit</option>
                                <option value="Inter">Inter</option>
                                <option value="Montserrat">Montserrat</option>
                                <option value="Playfair Display">Playfair Display</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Body Font</label>
                            <select
                                name="fontBody"
                                value={formData.fontBody}
                                onChange={handleInputChange}
                                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                            >
                                <option value="Inter">Inter</option>
                                <option value="Outfit">Outfit</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Open Sans">Open Sans</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-sm font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
                        >
                            <RefreshCw size={20} />
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:scale-105"
                        >
                            <Save size={20} />
                            Apply Theme
                        </button>
                    </div>
                </form>

                {/* Preview */}
                <div className="glass border border-white/10 rounded-sm p-8">
                    <h3 className="text-xl font-heading font-bold text-white uppercase mb-6">Preview</h3>

                    <div
                        className="rounded-sm p-8 border border-white/10"
                        style={{ backgroundColor: formData.backgroundColor }}
                    >
                        <h1
                            className="text-4xl font-black mb-4"
                            style={{
                                fontFamily: formData.fontHeading,
                                color: formData.primaryColor
                            }}
                        >
                            LUX THRIFT
                        </h1>
                        <p
                            className="text-gray-300 mb-6"
                            style={{ fontFamily: formData.fontBody }}
                        >
                            This is how your store will look with the selected theme. The primary color is used for accents and highlights throughout the site.
                        </p>
                        <button
                            className="px-6 py-3 rounded-sm font-bold uppercase tracking-wider transition-all hover:scale-105"
                            style={{
                                backgroundColor: formData.primaryColor,
                                color: formData.backgroundColor,
                                fontFamily: formData.fontBody
                            }}
                        >
                            Shop Now
                        </button>

                        <div
                            className="mt-6 p-6 rounded-sm"
                            style={{ backgroundColor: formData.surfaceColor }}
                        >
                            <h3
                                className="text-xl font-bold text-white mb-2"
                                style={{ fontFamily: formData.fontHeading }}
                            >
                                Product Card
                            </h3>
                            <p
                                className="text-gray-400 text-sm"
                                style={{ fontFamily: formData.fontBody }}
                            >
                                Surface color is used for cards and elevated elements
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-sm">
                        <p className="text-yellow-500 text-sm font-mono">
                            ⚠️ Note: Some changes may require a page refresh to take full effect.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeManager;
