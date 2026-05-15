import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import FadeIn from './FadeIn';
import Magnet from './Magnet';
import ContactButton from './ContactButton';
import heroPortrait from './rory-hero.png';

export default function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navLinks = ["About", "Services", "Projects", "Contact"];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col pt-0 px-6 md:px-10 overflow-x-clip bg-[#080808]">
      {/* Background Depth Layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1A1F26] blur-[150px]" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#15181E] blur-[150px]" 
        />
        {/* Subtle Noise Grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay" />
      </div>

      {/* Sticky Navbar */}
      <AnimatePresence>
        {isScrolled && (
          <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 w-full z-[100] px-6 md:px-10 py-5 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center"
          >
            <a href="#" className="flex items-center justify-center w-10 h-10 border-2 border-white/20 rounded-lg font-display font-black text-xl tracking-tighter hover:scale-105 hover:border-white transition-all text-white">
              RU
            </a>
            <div className="flex gap-8 md:gap-12">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-[#D7E2EA]/40 font-medium uppercase tracking-[0.25em] text-[9px] md:text-xs hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Navbar (Initial) */}
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between items-end pt-8 md:pt-12 w-full z-50 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-md group-hover:bg-white group-hover:border-white transition-all duration-500 overflow-hidden relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-20 bg-[conic-gradient(from_0deg,transparent,white,transparent)]"
              />
              <span className="font-display font-black text-2xl tracking-tighter text-white uppercase group-hover:scale-110 transition-transform">RU</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 leading-none">Rory</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FA2E82] leading-none mt-1">Ulloa</span>
            </div>
          </div>
          <div className="flex gap-8 md:gap-14">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[#D7E2EA]/40 font-medium uppercase tracking-[0.2em] text-[10px] md:text-sm hover:text-white transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>
        </nav>
      </FadeIn>

      {/* Hero Heading Layer */}
      <div className="w-full flex-1 flex flex-col justify-center items-center relative z-0">
        <div className="relative w-full flex flex-col items-center">
            <div className="relative group">
              {/* Subtle Glowing Background - Layers */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.4, 0.15],
                  rotate: [0, 90, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-[-20%] inset-y-[-50%] bg-[#D7E2EA]/10 blur-[130px] -z-10 rounded-full"
              />
              <motion.div 
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.1, 0.3, 0.1],
                  rotate: [0, -90, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute inset-x-[-10%] inset-y-[-40%] bg-[#FA2E82]/5 blur-[100px] -z-10 rounded-full"
              />
              <h1 className="hero-heading font-black uppercase tracking-[-0.03em] leading-[0.8] text-center text-[18vw] sm:text-[17vw] md:text-[18vw] lg:text-[19vw] bg-clip-text text-transparent bg-gradient-to-t from-white via-white to-white/70">
                RORY ULLOA
              </h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 1.2, duration: 2 }}
                className="absolute inset-0 flex justify-center items-center pointer-events-none select-none blur-[60px]"
              >
                 <h1 className="hero-heading font-black uppercase tracking-[-0.03em] leading-[0.8] text-center text-[18vw] sm:text-[17vw] md:text-[18vw] lg:text-[19vw]">
                  RORY ULLOA
                </h1>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col items-center mt-6"
            >
              <p className="text-[#D7E2EA]/80 font-medium uppercase tracking-[0.6em] text-[8px] sm:text-[10px] md:text-xs lg:text-sm">
                Architectural Visualizer & 3D Artist
              </p>
            </motion.div>
        </div>

        {/* Hero Portrait */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 sm:bottom-[-2%]">
          <FadeIn delay={0.8} y={60} duration={1.5}>
            <Magnet 
              padding={250} 
              strength={4}
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="relative"
              >
                <img 
                  src={heroPortrait} 
                  alt="Rory Ulloa"
                  className="w-[320px] sm:w-[420px] md:w-[540px] lg:w-[680px] xl:w-[740px] h-auto object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.9)] transition-all duration-1000"
                  onError={(e) => {
                    e.currentTarget.src = "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png";
                  }}
                />
              </motion.div>
            </Magnet>
          </FadeIn>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 pointer-events-auto cursor-pointer group"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.5em] text-[#D7E2EA]/60 font-bold mb-1 group-hover:text-white transition-colors">Explore Work</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.div>
      </motion.div>

      {/* Bottom Text Content */}
      <div className="flex justify-between items-end pb-10 sm:pb-12 md:pb-16 z-20 max-w-7xl mx-auto w-full">
        <FadeIn delay={1.5} y={20}>
          <p className="text-[#D7E2EA]/80 font-light uppercase tracking-widest leading-relaxed max-w-[150px] sm:max-w-[200px] md:max-w-[240px]" style={{ fontSize: 'clamp(0.65rem, 0.9vw, 1rem)' }}>
            Based in Texas. Designing hyper-realistic architectural worlds.
          </p>
        </FadeIn>
        
        <FadeIn delay={1.8} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
