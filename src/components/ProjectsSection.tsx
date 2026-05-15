import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import LiveProjectButton from './LiveProjectButton';
import { ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  {
    num: "01",
    category: "High-End Residential",
    name: "Modern Luxury Villa",
    description: "A comprehensive visualization of a minimal aesthetic residence, focusing on the interplay between natural light and raw concrete textures.",
    images: {
      col1_top: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      col1_bottom: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
    }
  },
  {
    num: "02",
    category: "Commercial Hub",
    name: "UDG Office Complex",
    description: "Developing a visual narrative for a corporate complex that integrates sustainable greenery with industrial core structures.",
    images: {
      col1_top: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      col1_bottom: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
    }
  },
  {
    num: "03",
    category: "Conceptual Design",
    name: "The Glass Pavilion",
    description: "An experimental study on transparency and material reflection, exploring how glass interfaces with natural landscapes in various lighting conditions.",
    images: {
      col1_top: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      col1_bottom: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
    }
  },
  {
    num: "04",
    category: "Digital Design",
    name: "Architectural Portfolio CMS",
    description: "A custom-built digital showcase for a New York-based design firm, emphasizing fluid transitions and high-resolution media management.",
    images: {
      col1_top: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
      col1_bottom: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop",
      col2: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2000&auto=format&fit=crop"
    }
  },
  {
    num: "05",
    category: "Web & Branding",
    name: "Luxe Estate Platform",
    description: "Designing a high-end real estate marketplace that combines interactive 3D floor plans with seamless booking experiences.",
    images: {
      col1_top: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
      col1_bottom: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop",
      col2: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop"
    }
  }
];

export default function ProjectsSection() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <section 
      ref={container}
      id="projects" 
      className="bg-black py-32 md:py-48"
    >
      <div className="max-w-[1800px] mx-auto px-6 sm:px-12 md:px-20 lg:px-24">
        <div className="flex flex-col items-center mb-32 md:mb-48">
           <span className="text-[10px] uppercase tracking-[0.6em] text-white/30 font-bold mb-4">Selected Works</span>
           <h2 className="hero-heading font-black uppercase tracking-tighter text-center leading-[0.8]" style={{ fontSize: 'clamp(4rem, 15vw, 220px)' }}>
              PORTFOLIO
           </h2>
        </div>

        <div className="flex flex-col gap-24 md:gap-40">
          {PROJECTS.map((project, i) => {
            const targetScale = 1 - ((PROJECTS.length - 1 - i) * 0.04);
            
            return (
              <ProjectCard 
                key={project.num}
                project={project}
                index={i}
                progress={scrollYProgress}
                range={[i * 0.3, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: any;
  index: number;
  progress: any;
  range: [number, number];
  targetScale: number;
  key?: React.Key;
}

function ProjectCard({ project, index, progress, range, targetScale }: ProjectCardProps) {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="h-screen sticky top-0 flex items-center justify-center">
      <motion.div 
        style={{ 
          scale,
          top: `calc(10vh + ${index * 32}px)`
        }}
        className="w-full h-[75vh] sm:h-[80vh] relative rounded-[32px] sm:rounded-[50px] md:rounded-[64px] border border-white/10 bg-[#0A0A0A] p-6 sm:p-10 md:p-16 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 sm:mb-16 relative z-10">
          <div className="flex items-center gap-6 sm:gap-10">
            <span className="font-display font-black leading-none text-white/5 select-none" style={{ fontSize: 'clamp(4rem, 12vw, 180px)' }}>
              {project.num}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                 <span className="bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded-full uppercase text-[9px] sm:text-[10px] tracking-[0.2em] font-bold">
                   {project.category}
                 </span>
                 <span className="bg-[#FA2E82]/20 text-[#FA2E82] border border-[#FA2E82]/30 px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold animate-pulse">
                   Live
                 </span>
              </div>
              <h3 className="hero-heading font-black uppercase text-2xl sm:text-4xl md:text-6xl tracking-tighter leading-none mb-6">
                {project.name}
              </h3>
              <p className="max-w-md text-white/60 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                {project.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex flex-col items-end text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/30">Client</span>
                <span className="text-xs uppercase font-light tracking-widest">Confidential</span>
             </div>
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors"
             >
                <ArrowUpRight size={24} />
             </motion.button>
          </div>
        </div>

        {/* Cinematic Grid */}
        <div className="flex-1 flex gap-4 sm:gap-6 md:gap-8 min-h-0 relative z-10">
          {/* Main Showcase (Large) */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="w-[60%] h-full overflow-hidden rounded-[20px] sm:rounded-[40px] border border-white/5 group"
          >
            <img 
              src={project.images.col2} 
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-8">
               <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Primary Perspective</span>
            </div>
          </motion.div>

          {/* Secondary Panes (Stacked) */}
          <div className="w-[40%] flex flex-col gap-4 sm:gap-6 md:gap-8">
            <motion.div 
               whileHover={{ scale: 0.98 }}
               className="h-[45%] overflow-hidden rounded-[20px] sm:rounded-[32px] border border-white/5 relative group"
            >
              <img 
                src={project.images.col1_top} 
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
            <motion.div 
               whileHover={{ scale: 0.98 }}
               className="flex-1 overflow-hidden rounded-[20px] sm:rounded-[32px] border border-white/5 relative group"
            >
              <img 
                src={project.images.col1_bottom} 
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
