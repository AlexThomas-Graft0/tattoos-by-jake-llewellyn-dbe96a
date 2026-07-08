'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Award, ChevronRight } from 'lucide-react';

const stats = [
  {
    icon: Award,
    text: "10+ Years of Artistry",
    description: "Decade of refined, custom tattooing"
  },
  {
    icon: Sparkles,
    text: "Custom Designs",
    description: "Tailored exclusively to your vision"
  },
  {
    icon: Shield,
    text: "Sterile Environment",
    description: "Highest professional hygiene standards"
  }
];

const galleryImages = [
  {
    src: '/client-images/photo-1.webp',
    alt: 'Custom Tattoo Work Showcase 1',
    aspect: 'aspect-[3/4]',
    rotate: '-rotate-2 hover:rotate-0'
  },
  {
    src: '/client-images/photo-2.webp',
    alt: 'Custom Tattoo Work Showcase 2',
    aspect: 'aspect-square',
    rotate: 'rotate-3 hover:rotate-0'
  },
  {
    src: '/client-images/photo-3.webp',
    alt: 'Custom Tattoo Work Showcase 3',
    aspect: 'aspect-[4/5]',
    rotate: '-rotate-1 hover:rotate-0'
  },
  {
    src: '/client-images/photo-4.webp',
    alt: 'Custom Tattoo Work Showcase 4',
    aspect: 'aspect-[3/4]',
    rotate: 'rotate-2 hover:rotate-0'
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 16,
    },
  },
};

const imageContainerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 18,
      delay: 0.3
    }
  }
};

export function Hero() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden flex flex-col justify-between pt-24 lg:pt-32"
    >
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text / Action Area */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Elegant Location Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono uppercase tracking-widest text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                Gilfach, Bargoed Studio
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight leading-[1.05] text-white"
            >
              Your Vision, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
                Permanently Perfected.
              </span>
            </motion.h1>

            {/* Subcopy */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-zinc-400 max-w-xl leading-relaxed font-normal"
            >
              Welcome to the studio. Whether it’s your first piece or your fiftieth, I provide custom-designed tattoos in a comfortable, professional space here in Gilfach. Let’s create something that stays with you forever.
            </motion.p>

            {/* Call to Actions */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <a
                href="#enquiry"
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-950/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                Book Your Consultation
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800/80 text-zinc-200 border border-zinc-800 font-semibold px-8 py-4 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-750 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                View My Portfolio
              </a>
            </motion.div>
          </motion.div>

          {/* Right Showcase Gallery (Visual Editorial Layout) */}
          <motion.div 
            className="lg:col-span-5 relative"
            variants={imageContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-2 gap-4 relative">
              {galleryImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/80 transition-all duration-500 hover:scale-[1.03] hover:z-20 hover:shadow-2xl hover:shadow-black/60 ${img.aspect} ${img.rotate}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="eager"
                    className="w-full h-full object-cover grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-xs font-mono tracking-wider text-zinc-300">Custom Session Work</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Decorative Element */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          </motion.div>

        </div>
      </div>

      {/* Quick Stats Banner / Bottom Highlight */}
      <div className="w-full border-t border-zinc-900/80 bg-zinc-950/60 backdrop-blur-md mt-16 lg:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-zinc-900">
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-start gap-4 pt-6 md:pt-0 md:px-6 first:pt-0 md:first:pl-0"
                >
                  <div className="flex-shrink-0 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-zinc-150 tracking-tight">
                      {stat.text}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}