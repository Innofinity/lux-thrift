import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

export const SearchProvider = ({ children }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery(''); // Optional: clear query on close
    };

    const value = {
        isSearchOpen,
        openSearch,
        closeSearch,
        searchQuery,
        setSearchQuery
    };

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
