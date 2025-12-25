// Hook to get products from localStorage or fallback to static data
import { useState, useEffect } from 'react';
import { products as staticProducts } from '../data/products';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = () => {
            const savedProducts = localStorage.getItem('luxthrift_products');
            if (savedProducts) {
                setProducts(JSON.parse(savedProducts));
            } else {
                setProducts(staticProducts);
                localStorage.setItem('luxthrift_products', JSON.stringify(staticProducts));
            }
            setLoading(false);
        };

        loadProducts();

        // Listen for storage changes (when admin updates products)
        const handleStorageChange = () => {
            loadProducts();
        };

        window.addEventListener('storage', handleStorageChange);

        // Custom event for same-tab updates
        window.addEventListener('productsUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('productsUpdated', handleStorageChange);
        };
    }, []);

    return { products, loading };
};
