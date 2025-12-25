import React from 'react';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import { useProducts } from '../hooks/useProducts';

const Home = () => {
    const { products, loading } = useProducts();

    if (loading) {
        return (
            <>
                <Hero />
                <div className="py-20 text-center">
                    <p className="text-gray-400 font-mono">Loading products...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO />
            <Hero />
            <ProductGrid products={products} />
        </>
    );
};

export default Home;
