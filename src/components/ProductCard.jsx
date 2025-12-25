import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import useActivityTracker from '../hooks/useActivityTracker';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { trackAddToCart, trackProductView } = useActivityTracker();
    const [isAdded, setIsAdded] = React.useState(false);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
        trackAddToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleView = () => {
        trackProductView(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative cursor-pointer"
            onClick={handleView}
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                        onClick={handleAddToCart}
                        className={`${isAdded ? 'bg-green-500' : 'bg-primary'
                            } text-black p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110`}
                    >
                        {isAdded ? <Check size={24} /> : <Plus size={24} />}
                    </button>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                    <span className="bg-black/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-2 py-1">
                        {product.category}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-start">
                <div className="flex-1 pr-4">
                    <h3 className="text-text-base font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    {product.description && (
                        <p className="text-text-muted text-sm mt-2 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                    <p className="text-text-muted text-sm mt-1">{product.condition}</p>
                </div>
                <span className="text-primary font-mono font-bold text-lg flex-shrink-0">
                    ₹{product.price}
                </span>
            </div>
        </motion.div>
    );
};

export default ProductCard;
