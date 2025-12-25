import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductGrid from '../components/ProductGrid';
import { useProducts } from '../hooks/useProducts';

const CategoryPage = () => {
    const { gender, category } = useParams();
    const { products, loading } = useProducts();

    const filteredProducts = products.filter(product => {
        const genderMatch = product.gender.toLowerCase() === gender.toLowerCase();
        if (!category) return genderMatch;
        // Handle URL friendly category names (e.g., "t-shirts" -> "T-Shirts")
        // This is a simple check, might need more robust normalization
        return genderMatch && product.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === category.toLowerCase();
    });

    const title = category ? `${gender}'s ${category.replace(/-/g, ' ')}` : `${gender}'s Collection`;

    if (loading) {
        return (
            <div className="pt-20 py-20 text-center">
                <p className="text-gray-400 font-mono">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="pt-20">
            <SEO
                title={title}
                description={`Shop the best ${title} at LuxThrift. curated luxury vintage fashion.`}
            />
            <ProductGrid products={filteredProducts} title={title} />
        </div>
    );
};

export default CategoryPage;
