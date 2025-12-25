import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import useActivityTracker from '../hooks/useActivityTracker';

const SearchOverlay = () => {
    const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useSearch();
    const { products } = useProducts();
    const { trackSearch } = useActivityTracker();
    const inputRef = useRef(null);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            // Slight delay to ensure animation starts first or element is mounted
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isSearchOpen]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        setFilteredProducts(results);

        // Track search (ideally debounced, but this works for demo)
        if (query.length > 3) {
            trackSearch(query);
        }
    }, [searchQuery, products, trackSearch]);

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <div className="fixed inset-0 z-[80] flex flex-col bg-background/95 backdrop-blur-xl">
                    {/* Header / Search Input */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="container mx-auto px-6 py-6"
                    >
                        <div className="relative flex items-center border-b border-border pb-4">
                            <Search className="text-text-muted mr-4" size={24} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for items, brands, or styles..."
                                className="w-full bg-transparent text-2xl md:text-4xl font-heading font-bold text-text-base placeholder-text-muted focus:outline-none uppercase tracking-wide"
                            />
                            <button
                                onClick={closeSearch}
                                className="ml-4 p-2 text-text-muted hover:text-text-base transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Results Area */}
                    <div className="flex-1 overflow-y-auto px-6 pb-20">
                        <div className="container mx-auto">
                            {searchQuery.trim() === '' ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-12"
                                >
                                    <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6">
                                        Trending Now
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {/* Show random 4 products as trending if available */}
                                        {products.slice(0, 4).map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="mt-8">
                                    <div className="mb-6 flex justify-between items-end">
                                        <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">
                                            {filteredProducts.length} Results Found
                                        </h3>
                                    </div>

                                    {filteredProducts.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                            {filteredProducts.map(product => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <p className="text-xl text-text-muted font-heading">
                                                No matches found for "{searchQuery}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
