/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <div className="relative selection:bg-[#B600A8] selection:text-white">
      <SmoothScroll />
      <div className="noise" />
      <main className="main-wrapper">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactSection />
        
        {/* Simple Footer */}
        <footer className="bg-[#0C0C0C] py-20 px-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-white/30 text-[10px] uppercase tracking-[0.3em] font-light">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span>&copy; {new Date().getFullYear()} RORY ULLOA.</span>
              <span className="text-[8px] opacity-50 font-medium">Architectural Visualizer & 3D Artist</span>
            </div>
            
            <div className="flex gap-10">
              <a href="https://www.artstation.com/roryulloa" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">ArtStation</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
