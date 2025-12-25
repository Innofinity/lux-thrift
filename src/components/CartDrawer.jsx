import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount
    } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border flex justify-between items-center bg-surface/50">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-primary" size={24} />
                                <h2 className="text-xl font-heading font-bold text-text-base uppercase tracking-wide">
                                    Shopping Bag <span className="text-primary">({cartCount})</span>
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-text-muted hover:text-text-base hover:bg-surface rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center">
                                        <ShoppingBag size={40} className="text-text-muted" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-heading font-bold text-text-base mb-2">Your bag is empty</p>
                                        <p className="text-text-muted font-mono text-sm max-w-[200px] mx-auto">
                                            Looks like you haven't found your perfect piece yet.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="bg-primary text-black px-8 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-white transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 glass border border-border rounded-sm group hover:border-border transition-colors">
                                        {/* Image */}
                                        <div className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-sm bg-gray-800">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-heading font-bold text-text-base uppercase text-sm leading-tight line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-text-muted hover:text-red-400 transition-colors ml-2"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-xs font-mono text-text-muted mb-2">{item.category}</p>
                                                <p className="text-primary font-bold">₹{item.price}</p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 bg-surface w-fit rounded-sm border border-border px-2 py-1 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="text-text-muted hover:text-text-base transition-colors disabled:opacity-30"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-mono text-text-base w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="text-text-muted hover:text-text-base transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-border bg-surface/50">
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-text-muted text-sm font-mono uppercase">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-text-base text-lg font-heading font-black uppercase">
                                        <span>Total</span>
                                        <span className="text-primary">₹{cartTotal}</span>
                                    </div>
                                </div>
                                <button className="w-full bg-primary text-black py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-text-base hover:text-background transition-colors flex items-center justify-center gap-2 group">
                                    Checkout Now
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-center text-xs font-mono text-gray-500 mt-4 uppercase">
                                    Free Shipping on orders over ₹5000
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
