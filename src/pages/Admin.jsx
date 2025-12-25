import React, { useState, useEffect } from 'react';
import { Package, Palette, Image as ImageIcon, BookOpen, Info, Grid, Settings, LogOut, Home, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProductManager from '../components/admin/ProductManager';
import ThemeManager from '../components/admin/ThemeManager';
import BannerManager from '../components/admin/BannerManager';
import JournalManager from '../components/admin/JournalManager';
import AboutManager from '../components/admin/AboutManager';
import CollectionManager from '../components/admin/CollectionManager';
import SEOManager from '../components/admin/SEOManager';
import CRMManager from '../components/admin/CRMManager';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('products');
    const { logout } = useAuth();

    const tabs = [
        { id: 'products', name: 'Inventory', icon: Package },
        { id: 'crm', name: 'CRM & Insights', icon: Users },
        { id: 'banners', name: 'Banners', icon: ImageIcon },
        { id: 'collections', name: 'Collections', icon: Grid },
        { id: 'journal', name: 'Journal', icon: BookOpen },
        { id: 'about', name: 'About', icon: Info },
        { id: 'theme', name: 'Theme', icon: Palette },
        { id: 'seo', name: 'SEO', icon: Search },
    ];

    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-heading font-black text-white uppercase mb-2">
                            Content <span className="text-primary">Manager</span>
                        </h1>
                        <p className="text-gray-400 font-mono text-sm">
                            Manage all aspects of your luxury thrift store
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-sm text-sm font-mono uppercase tracking-wider text-gray-300 hover:text-white hover:border-white transition-all"
                        >
                            <Home size={16} />
                            Store
                        </Link>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-sm text-sm font-mono uppercase tracking-wider text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="glass border border-white/10 rounded-sm mb-8 overflow-x-auto">
                    <div className="flex">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-mono text-sm uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="animate-fadeIn">
                    {activeTab === 'products' && <ProductManager />}
                    {activeTab === 'crm' && <CRMManager />}
                    {activeTab === 'banners' && <BannerManager />}
                    {activeTab === 'collections' && <CollectionManager />}
                    {activeTab === 'journal' && <JournalManager />}
                    {activeTab === 'about' && <AboutManager />}
                    {activeTab === 'theme' && <ThemeManager />}
                    {activeTab === 'seo' && <SEOManager />}
                </div>
            </div>
        </div>
    );
};

export default Admin;
