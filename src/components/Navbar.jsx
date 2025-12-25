import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, ChevronDown, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import AuthModal from './AuthModal';

const categories = {
    men: [
        { name: 'T-Shirts', path: 't-shirts' },
        { name: 'Shirts', path: 'shirts' },
        { name: 'Bottom Wear', path: 'bottom-wear' },
        { name: 'Footwear', path: 'footwear' },
        { name: 'Accessories', path: 'accessories' }
    ],
    women: [
        { name: 'Tops & Tees', path: 'tops-tees' },
        { name: 'Dresses', path: 'dresses' },
        { name: 'Co-od Sets', path: 'co-od-sets' },
        { name: 'Shoes & Sandals', path: 'shoes-sandals' },
        { name: 'Accessories', path: 'accessories' }
    ]
};

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { openSearch } = useSearch();
    const { cartCount, setIsCartOpen } = useCart();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-heading font-black tracking-tighter text-text-base">
                        LUX<span className="text-primary">THRIFT</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['Men', 'Women'].map((gender) => (
                            <div
                                key={gender}
                                className="relative group"
                                onMouseEnter={() => setActiveDropdown(gender)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    to={`/${gender.toLowerCase()}`}
                                    className="flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors uppercase tracking-widest py-2"
                                >
                                    {gender}
                                    <ChevronDown size={14} className="ml-1" />
                                </Link>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {activeDropdown === gender && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 w-48 glass border border-border rounded-sm overflow-hidden"
                                        >
                                            <div className="py-2">
                                                {categories[gender.toLowerCase()].map((cat) => (
                                                    <Link
                                                        key={cat.path}
                                                        to={`/${gender.toLowerCase()}/${cat.path}`}
                                                        className="block px-4 py-2 text-sm text-text-muted hover:text-primary hover:bg-white/5 transition-colors"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                        {['Collections', 'About', 'Journal'].map((item) => (
                            <Link
                                key={item}
                                to="#"
                                className="text-sm font-medium text-text-muted hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={openSearch}
                            className="text-text-base hover:text-primary transition-colors"
                        >
                            <Search size={20} />
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative text-text-base hover:text-primary transition-colors"
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="text-text-base hover:text-primary transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="hidden md:flex items-center gap-2 text-white hover:text-primary transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                                        <User size={16} className="text-primary" />
                                    </div>
                                    <span className="text-sm font-mono">{user?.name || user?.email || user?.phone}</span>
                                    <ChevronDown size={16} />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 glass border border-white/10 rounded-sm overflow-hidden">
                                        {isAdmin() && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-primary transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="hidden md:block text-xs font-mono text-gray-400 hover:text-primary transition-colors uppercase tracking-widest border border-white/20 px-4 py-2 rounded-sm hover:border-primary"
                            >
                                Login
                            </button>
                        )}

                        <button
                            className="md:hidden text-white hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center overflow-y-auto"
                    >
                        <button
                            className="absolute top-6 right-6 text-text-muted hover:text-text-base transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={32} />
                        </button>
                        <div className="flex flex-col space-y-6 text-center w-full px-6">
                            {['Men', 'Women'].map((gender) => (
                                <div key={gender} className="flex flex-col space-y-4">
                                    <Link
                                        to={`/${gender.toLowerCase()}`}
                                        className="text-3xl font-heading font-bold text-text-base hover:text-primary transition-colors uppercase tracking-widest"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {gender}
                                    </Link>
                                    <div className="flex flex-col space-y-2">
                                        {categories[gender.toLowerCase()].map((cat) => (
                                            <Link
                                                key={cat.path}
                                                to={`/${gender.toLowerCase()}/${cat.path}`}
                                                className="text-lg text-text-muted hover:text-primary transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {['Collections', 'About', 'Journal'].map((item) => (
                                <Link
                                    key={item}
                                    to="#"
                                    className="text-3xl font-heading font-bold text-text-base hover:text-primary transition-colors uppercase tracking-widest"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Modal */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
};

export default Navbar;
