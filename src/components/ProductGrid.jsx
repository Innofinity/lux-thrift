import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, title = "Latest Drops" }) => {
    return (
        <section className="py-20 px-6 bg-background">
            <div className="container mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-4xl md:text-6xl font-heading font-black text-text-base uppercase">
                        {title}
                    </h2>
                    <button className="hidden md:block text-sm font-mono text-primary border-b border-primary pb-1 hover:text-text-base hover:border-text-base transition-colors">
                        VIEW ALL COLLECTIONS
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <button className="text-sm font-mono text-primary border-b border-primary pb-1">
                        VIEW ALL COLLECTIONS
                    </button>
                </div>
            </div>
            <style>{`
        .text-stroke {
          -webkit-text-stroke: 1px rgb(var(--color-text-base));
        }
      `}</style>
        </section>
    );
};

export default ProductGrid;
