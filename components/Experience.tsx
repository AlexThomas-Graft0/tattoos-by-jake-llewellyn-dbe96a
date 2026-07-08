'use client';

import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

export function Experience() {
  return (
    <section id="experience" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <h2 className="text-sm font-semibold text-blue-600 tracking-wider uppercase">Our Philosophy</h2>
              <p className="mt-3 text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                More Than Just Ink.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="prose prose-lg text-gray-600">
              <p>
                I believe a great tattoo starts with a great conversation. From our first chat to the final healing stages, I’m here to ensure your design is exactly what you imagined—executed with precision and the highest standards of hygiene.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="#portfolio" 
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                View My Portfolio
              </a>
              <a 
                href="#enquiry" 
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                Book Your Consultation
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "10+ Years", desc: "of Artistry" },
                { label: "Custom", desc: "Designs Tailored to You" },
                { label: "Sterile", desc: "Professional Environment" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-xl font-bold text-gray-900">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.desc}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/client-images/photo-1.webp"
              alt="Professional tattoo artistry in progress"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-sm rounded-lg">
              <p className="text-gray-900 font-medium italic">
                "Every tattoo is a collaborative project designed to flow with your body and stand the test of time."
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}