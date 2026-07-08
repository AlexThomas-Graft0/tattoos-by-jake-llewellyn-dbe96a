'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const CATEGORIES = ['All', 'Fine Line', 'Traditional', 'Geometric', 'Cover-ups'];

export function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolios() {
      const { data } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setItems(data);
      setLoading(false);
    }
    fetchPortfolios();
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(i => i.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">The Gallery.</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            A collection of recent work across fine line, traditional, geometric, and custom cover-up projects. See what’s possible.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layout
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 cursor-pointer"
                  >
                    <img 
                      src={item.image_url || '/client-images/photo-1.webp'} 
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <div className="text-white">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm opacity-90">{item.category}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-400">
                  No projects found in this category yet.
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="mt-16 text-center">
          <a 
            href="#enquiry" 
            className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Love this style? Let’s talk
          </a>
        </div>
      </div>
    </section>
  );
}