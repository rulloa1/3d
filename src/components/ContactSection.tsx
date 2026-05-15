import React, { useState } from 'react';
import FadeIn from './FadeIn';
import { motion } from 'motion/react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:RoryUlloa@gmail.com?subject=Inquiry from ${formData.name}&body=${formData.message}%0D%0A%0D%0AFrom: ${formData.name} (${formData.email})`;
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 md:px-10 py-32 relative overflow-hidden">
      <div className="max-w-6xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
          {/* Left Column: Direct Info */}
          <div className="flex flex-col justify-between py-4">
            <FadeIn delay={0.2} x={-30}>
              <div className="flex flex-col gap-6">
                 <span className="text-[10px] uppercase tracking-[0.6em] text-white/30 font-bold">The Bridge</span>
                 <h2 className="hero-heading font-black uppercase leading-[0.85] tracking-tighter" style={{ fontSize: 'clamp(3.5rem, 10vw, 150px)' }}>
                    LET&apos;S<br />TALK
                 </h2>
                 <p className="text-white/40 font-light mt-8 max-w-sm leading-relaxed text-lg sm:text-xl">
                    Ready to transform your architectural concepts into immersive 3D realities? Let&apos;s start a conversation.
                 </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4} y={30}>
              <div className="flex flex-col gap-8 mt-16 lg:mt-0">
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Enquiries</span>
                    <a href="mailto:RoryUlloa@gmail.com" className="text-white font-display font-medium text-2xl md:text-3xl hover:opacity-70 transition-opacity">
                      RoryUlloa@gmail.com
                    </a>
                 </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Location</span>
                    <span className="text-white/60 font-medium text-lg uppercase tracking-wider">
                      Houston, Texas
                    </span>
                 </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Form */}
          <div className="relative">
            <FadeIn delay={0.6} x={30}>
               <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                  <div className="flex flex-col gap-4 group">
                     <label htmlFor="name" className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold group-focus-within:text-white transition-colors">Name</label>
                     <input 
                        type="text" 
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your Name"
                        className="bg-transparent border-b border-white/10 py-5 text-white focus:outline-none focus:border-white transition-colors duration-500 placeholder:text-white/5 uppercase tracking-widest text-xs"
                     />
                  </div>

                  <div className="flex flex-col gap-4 group">
                     <label htmlFor="email" className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold group-focus-within:text-white transition-colors">Email</label>
                     <input 
                        type="email" 
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Your Email"
                        className="bg-transparent border-b border-white/10 py-5 text-white focus:outline-none focus:border-white transition-colors duration-500 placeholder:text-white/5 uppercase tracking-widest text-xs"
                     />
                  </div>

                  <div className="flex flex-col gap-4 group">
                     <label htmlFor="message" className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold group-focus-within:text-white transition-colors">Project Details</label>
                     <textarea 
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell me about your project..."
                        className="bg-transparent border-b border-white/10 py-5 text-white focus:outline-none focus:border-white transition-colors duration-500 placeholder:text-white/5 resize-none uppercase tracking-widest text-xs"
                     />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 50px rgba(250, 46, 130, 0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="mt-6 w-full py-6 rounded-full bg-gradient-to-r from-[#FA2E82] to-[#B600A8] text-white font-black uppercase tracking-[0.5em] text-[10px] sm:text-xs transition-all duration-500 shadow-[0_10px_40px_rgba(250,46,130,0.15)]"
                  >
                    Send Inquiry
                  </motion.button>
               </form>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/[0.02] blur-[150px] pointer-events-none" />
    </section>
  );
}
