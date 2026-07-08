'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const services = [
  {
    title: 'Custom Design',
    desc: 'Tell me your concept, and I’ll sketch a bespoke piece just for you.',
    icon: '✍️'
  },
  {
    title: 'Fine Line',
    desc: 'Delicate, precise, and sophisticated work for those who appreciate detail.',
    icon: '✨'
  },
  {
    title: 'Traditional',
    desc: 'Bold, timeless designs with clean, solid lines.',
    icon: '⚓'
  },
  {
    title: 'Geometric',
    desc: 'Precise, symmetrical patterns that create visual impact.',
    icon: '💠'
  },
  {
    title: 'Cover-Ups',
    desc: 'Don\'t live with ink you regret. Let\'s discuss a transformation.',
    icon: '🎨'
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="services" className="py-24 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Professional Artistry.<br />
              <span className="text-blue-600">Tailored to You.</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              I don’t believe in "flash" off the wall. Every tattoo is a collaborative project designed to flow with your body and stand the test of time.
            </p>
            <a 
              href="#enquiry" 
              className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Ready to start? Book your consultation.
            </a>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {services.map((service, idx) => (
              <motion.div 
                key={service.title}
                variants={itemVariants}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{service.icon}</span>
                    <span className="font-semibold text-lg">{service.title}</span>
                  </div>
                  <span className="text-gray-400">{activeIndex === idx ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {activeIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-gray-600"
                    >
                      {service.desc}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}