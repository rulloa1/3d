/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MotionConfig } from 'motion/react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TechMarquee from './components/TechMarquee';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-5 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>
      <div aria-hidden className="noise" />
      <Header />
      <main id="main" className="relative overflow-x-clip">
        <HeroSection />
        <TechMarquee />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </MotionConfig>
  );
}
