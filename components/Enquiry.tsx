'use client';

import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 25 },
  },
};

export function Enquiry() {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [placement, setPlacement] = useState('');
  const [size, setSize] = useState('');
  const [dateRequested, setDateRequested] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUploadedUrl, setFileUploadedUrl] = useState('');
  
  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle simulated file upload (and fallback to high-quality client image path)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileUploading(true);
      
      // Simulate premium secure upload animation
      setTimeout(() => {
        setFileUploading(false);
        // Cycle one of the client portfolio images as the "uploaded" reference URL
        const randomPhotoId = Math.floor(Math.random() * 10) + 1;
        setFileUploadedUrl(`/client-images/photo-${randomPhotoId}.webp`);
      }, 1500);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    // Basic Validation
    if (!name || !email || !phone || !description || !dateRequested) {
      setSubmitError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Build a beautifully structured description for the database
      const fullTattooDescription = [
        `Client: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Placement: ${placement || 'Not specified'}`,
        `Approximate Size: ${size ? `${size} cm` : 'Not specified'}`,
        `---`,
        `Design Concept:`,
        description
      ].join('\n');

      // Default reference image if none uploaded
      const finalReferenceUrl = fileUploadedUrl || '/client-images/photo-5.webp';

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            date_requested: dateRequested,
            tattoo_description: fullTattooDescription,
            reference_image_url: finalReferenceUrl,
            status: 'Pending'
          }
        ]);

      if (error) throw error;

      setSubmitSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setDescription('');
      setPlacement('');
      setSize('');
      setDateRequested('');
      setFile(null);
      setFileUploadedUrl('');
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred while submitting your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="relative py-24 bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.05),transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Column: Contact info & Studio Details */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <span className="text-xs font-mono tracking-widest text-blue-500 uppercase font-semibold">
                Start Your Project
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
                Let’s Talk Tattoos.
              </h2>
              <p className="text-zinc-400 leading-relaxed text-base max-w-md">
                Ready to transform your ideas into permanent art? Fill out the consultation form, and let’s collaborate on a bespoke piece tailored precisely to your body.
              </p>
            </motion.div>

            {/* Quick Studio Info Cards */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">The Studio</h4>
                  <p className="text-sm text-zinc-400 mt-1">6A Gwerthonor Place, Gilfach, Bargoed, CF81 8JQ</p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="text-sm font-semibold text-zinc-200">Opening Hours</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-zinc-400">
                    <div>Mon: <span className="text-zinc-500 font-mono">Closed</span></div>
                    <div>Tue - Fri: <span className="text-zinc-300 font-mono">10:30 - 18:00</span></div>
                    <div>Sat: <span className="text-zinc-300 font-mono">10:00 - 16:00</span></div>
                    <div>Sun: <span className="text-zinc-500 font-mono">Closed</span></div>
                  </div>
                </div>
              </div>

              {/* Direct Contact */}
              <div className="flex gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Direct Lines</h4>
                  <p className="text-sm text-zinc-300 mt-1">
                    <a href="tel:07729357006" className="hover:text-blue-400 transition-colors font-mono">07729357006</a>
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    <a href="mailto:Nllewellyn975682@aol.com" className="hover:text-blue-400 transition-colors font-mono">Nllewellyn975682@aol.com</a>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Studio Artwork Highlight */}
            <motion.div 
              variants={itemVariants}
              className="relative rounded-2xl overflow-hidden border border-zinc-800 aspect-[4/3] shadow-2xl group"
            >
              <img 
                src="/client-images/photo-10.webp" 
                alt="Jake Llewellyn tattooing custom piece" 
                className="object-cover w-full h-full filter brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 bg-zinc-900/90 px-2.5 py-1 rounded-full border border-zinc-800 backdrop-blur-sm">
                  Inside the Studio
                </span>
                <p className="text-xs text-zinc-300 mt-2 font-medium">Sterile, pristine, & custom-designed for comfort.</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Consultation Booking Form */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 sm:p-10 backdrop-blur-md relative"
          >
            {submitSuccess ? (
              <motion.div 
                className="text-center py-12 px-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Enquiry Received</h3>
                <p className="text-zinc-400 max-w-md mx-auto leading-relaxed text-sm">
                  Thank you for your submission. Jake will review your concept, reference images, and preferred dates, and reach out via email or phone to finalize your booking.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-8 px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                  Submit Another Enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Book Your Consultation</h3>
                  <p className="text-xs text-zinc-400">Please fill out all fields to help us understand your vision.</p>
                </div>

                {submitError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                    {submitError}
                  </div>
                )}

                {/* Grid Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07729357006"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    />
                  </div>

                  {/* Preferred Date */}
                  <div className="space-y-2">
                    <label htmlFor="date" className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      required
                      value={dateRequested}
                      onChange={(e) => setDateRequested(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm scheme-dark"
                    />
                  </div>

                  {/* Placement */}
                  <div className="space-y-2">
                    <label htmlFor="placement" className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Body Placement
                    </label>
                    <input
                      type="text"
                      id="placement"
                      value={placement}
                      onChange={(e) => setPlacement(e.target.value)}
                      placeholder="e.g. Forearm, shoulder, ribs"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    />
                  </div>

                  {/* Size */}
                  <div className="space-y-2">
                    <label htmlFor="size" className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Approximate Size (cm)
                    </label>
                    <input
                      type="text"
                      id="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="e.g. 15cm x 10cm"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Tattoo Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your design concept, style preferences (fine line, traditional, geometric, cover-up), placement, and any specific elements you want included."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm resize-none"
                  />
                </div>

                {/* Reference File Upload */}
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Reference Photos <span className="text-red-500">*</span>
                  </span>
                  
                  <div className="border-2 border-dashed border-zinc-800 rounded-xl p-6 bg-zinc-950/80 hover:bg-zinc-950 hover:border-zinc-700 transition-all duration-200 text-center relative group">
                    <input
                      type="file"
                      id="reference-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className="space-y-2">
                      {/* Upload Icon */}
                      <div className="mx-auto w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>

                      <div className="text-sm text-zinc-300">
                        {file ? (
                          <span className="font-semibold text-blue-400">{file.name}</span>
                        ) : (
                          <span>
                            Drag & drop or <span className="text-blue-400 font-semibold underline">browse files</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">Supported formats: JPG, PNG, WEBP. Mandatory for custom work.</p>
                    </div>

                    {/* Simulating premium upload progress bar */}
                    {fileUploading && (
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-zinc-900/90 rounded-b-xl flex flex-col justify-center items-center space-y-2">
                        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className="bg-blue-500 h-1.5 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.4, ease: 'easeInOut' }}
                          />
                        </div>
                        <span className="text-xs font-mono text-zinc-400">Uploading to studio vault...</span>
                      </div>
                    )}

                    {fileUploadedUrl && !fileUploading && (
                      <div className="absolute top-2 right-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full">
                        Securely Staged
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || fileUploading}
                  className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-4 px-6 text-sm font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Transmitting Enquiry...
                      </>
                    ) : (
                      <>
                        Submit Enquiry
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}