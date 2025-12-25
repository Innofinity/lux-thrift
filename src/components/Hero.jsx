import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center">
            {/* Background with overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1550614000-4b9519e02099?q=80&w=2070&auto=format&fit=crop"
                    alt="Luxury Thrift"
                    className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-primary font-mono tracking-widest text-sm md:text-base mb-4">
                        EST. 2024 // GEN-Z LUXURY
                    </h2>
                    <h1 className="text-7xl md:text-9xl font-heading font-black tracking-tighter leading-none mb-6">
                        ARCHIVE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-base via-text-muted to-text-muted/50">
                            MODE
                        </span>
                    </h1>
                    <p className="max-w-md mx-auto text-text-muted text-lg md:text-xl mb-8">
                        Curated vintage for the digital age. Rare finds, sustainable luxury, and timeless style.
                    </p>
                    <button className="group relative px-8 py-4 bg-primary text-black font-bold tracking-wider overflow-hidden">
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                            SHOP LATEST DROP
                        </span>
                        <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
                    </button>
                </motion.div>
            </div>

            {/* Marquee */}
            <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden py-4 bg-primary/10 backdrop-blur-sm border-t border-primary/20">
                <div className="whitespace-nowrap animate-marquee flex space-x-8">
                    {Array(10).fill("NEW ARRIVALS // VINTAGE // RARE FINDS // SUSTAINABLE // ").map((text, i) => (
                        <span key={i} className="text-primary font-mono font-bold tracking-widest text-sm">
                            {text}
                        </span>
                    ))}
                </div>
            </div>

            <style>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </section>
    );
};

export default Hero;
