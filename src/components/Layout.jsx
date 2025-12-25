import React from 'react';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black overflow-x-hidden">
            <Navbar />
            <CartDrawer />
            <SearchOverlay />
            <main className="pt-20">
                {children}
            </main>
            <footer className="bg-surface py-12 mt-20 border-t border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-500 text-sm">
                        © 2024 LUXTHRIFT. EST. 2024.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
