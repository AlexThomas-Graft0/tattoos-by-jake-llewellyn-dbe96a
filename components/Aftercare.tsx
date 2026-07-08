'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  body: string;
  image_url: string | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export function Aftercare() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);

  useEffect(() => {
    async function fetchBlogArticles() {
      try {
        const { data, error } = await supabase
          .from('blog')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(2);

        if (!error && data) {
          setBlogPosts(data as BlogPost[]);
        }
      } catch (err) {
        console.error('Error fetching blog articles:', err);
      } finally {
        setIsLoadingBlog(false);
      }
    }
    fetchBlogArticles();
  }, []);

  const steps = [
    {
      number: '01',
      title: 'The First Hours',
      description: 'Leave your protective bandage or wrap on for 2–4 hours. Keep it completely clean and strictly away from environmental contaminants.',
      tip: 'Do not re-bandage unless specifically instructed.',
    },
    {
      number: '02',
      title: 'Cleaning',
      description: 'Wash gently with clean hands using lukewarm water and a mild, fragrance-free liquid soap. Pat dry with a clean paper towel.',
      tip: 'Never scrub or use abrasive cloths.',
    },
    {
      number: '03',
      title: 'Hydration',
      description: 'Apply a very thin layer of recommended aftercare balm or ointment. Your skin needs to breathe to heal efficiently.',
      tip: 'Less is more. Avoid heavy petroleum jelly.',
    },
    {
      number: '04',
      title: 'The "Don\'ts"',
      description: 'No swimming, no long baths, no sunbeds or direct sun exposure, no picking at flaking skin, and absolutely no scratching.',
      tip: 'Wear loose clothing to prevent friction.',
    },
  ];

  const faqs = [
    {
      question: 'How long until I can exercise?',
      answer: 'Generally, avoid heavy sweating, friction, and gym environments for 7–10 days. Bacteria in gym equipment poses a high risk to healing skin.',
    },
    {
      question: 'When should I get a touch-up?',
      answer: 'Wait at least 4 weeks for all layers of the skin to fully settle. If any areas healed lighter, touch-ups can be scheduled after this period.',
    },
    {
      question: 'Is flaking and peeling normal?',
      answer: 'Yes, completely normal. Around day 3–7, your tattoo will begin to peel like sunburn. Do not peel or scratch it; let the skin shed naturally.',
    },
    {
      question: 'What soap should I use?',
      answer: 'Any mild, liquid, fragrance-free, antibacterial or sensitive-skin soap works perfectly. Avoid bar soaps as they can harbor bacteria.',
    },
  ];

  return (
    <section id="aftercare" className="relative bg-zinc-950 text-zinc-100 py-24 lg:py-32 overflow-hidden border-t border-zinc-900">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-24">
          <span className="text-xs font-mono tracking-widest text-blue-500 uppercase block mb-3">
            Longevity & Healing
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Healing Your Ink.
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed">
            Your tattoo is a work of art, but it’s also a healing wound. Follow these steps to ensure your tattoo heals vibrant and clean.
          </p>
        </div>

        {/* Step-by-Step Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-4xl font-extrabold text-zinc-800 group-hover:text-blue-500/20 font-mono transition-colors duration-300">
                    {step.number}
                  </span>
                  {index === 3 && (
                    <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded bg-red-950/40 text-red-400 border border-red-900/50">
                      Critical
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-800/60 mt-auto">
                <span className="text-xs font-mono text-zinc-500 block">
                  PRO TIP: <span className="text-zinc-300">{step.tip}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Split: FAQS & Dynamic Blog Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: FAQs & Support CTA */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Frequently Asked Questions
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base">
                Crucial answers for maintaining solid lines and saturated color.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border-b border-zinc-800/80 pb-4 transition-colors duration-200"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left py-3 focus:outline-none group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base sm:text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors duration-200">
                        {faq.question}
                      </span>
                      <span className="ml-4 flex-shrink-0 text-zinc-500 group-hover:text-blue-400 transition-colors duration-200">
                        {isOpen ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                          </svg>
                        )}
                      </span>
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Consultation CTA */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-900/40 border border-zinc-800 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-1">
                  Have a specific concern?
                </h4>
                <p className="text-sm text-zinc-400">
                  If you notice unexpected redness, persistent swelling, or have questions, reach out immediately.
                </p>
              </div>
              <a 
                href="#enquiry" 
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                Get In Touch
              </a>
            </div>
          </div>

          {/* Right Column: Premium Studio Visual & Blog Integration */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] border border-zinc-800 group">
              <img 
                src="/client-images/photo-5.webp" 
                alt="Sterile professional tattoo environment in Gilfach" 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded bg-blue-600/80 text-white mb-3">
                  Studio Standards
                </span>
                <p className="text-lg sm:text-xl font-bold text-white mb-1">
                  Sterile, Professional Space
                </p>
                <p className="text-xs sm:text-sm text-zinc-300">
                  Located in Gilfach, Bargoed. Setting the highest hygiene standards for your safety.
                </p>
              </div>
            </div>

            {/* Dynamic Blog Section (if data present) */}
            {!isLoadingBlog && blogPosts.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-mono tracking-wider text-zinc-400 uppercase">
                    From the Studio Blog
                  </h4>
                </div>
                <div className="space-y-3">
                  {blogPosts.map((post) => (
                    <div 
                      key={post.id}
                      className="bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 transition-all duration-200 flex gap-4 items-center"
                    >
                      {post.image_url && (
                        <img 
                          src={post.image_url} 
                          alt={post.title} 
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-zinc-800"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-white truncate hover:text-blue-400 transition-colors duration-150">
                          {post.title}
                        </h5>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                          {post.body.replace(/[#*`]/g, '')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}