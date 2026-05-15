import FadeIn from './FadeIn';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const SERVICES = [
  {
    num: "01",
    name: "CGI & Photorealism",
    description: "Creating high-fidelity architectural renderings that capture the subtle play of light and shadow on physical materials.",
    tags: ["High-End", "Precision", "Cinema"]
  },
  {
    num: "02",
    name: "Architectural Walkthroughs",
    description: "Immersive 3D animation that guides viewers through a spatial journey, revealing the soul of a project before it exists.",
    tags: ["Motion", "Immersion", "UHD"]
  },
  {
    num: "03",
    name: "Strategic Visual Consulting",
    description: "Partnering with design teams to refine their vision through iterative 3D modeling and lighting studies.",
    tags: ["Strategy", "Design", "Consult"]
  },
  {
    num: "04",
    name: "Web Design & Digital Craft",
    description: "Designing high-end, responsive digital experiences that mirror the precision and aesthetic of architectural spaces.",
    tags: ["UI/UX", "Minimal", "Web"]
  },
  {
    num: "05",
    name: "Product Visualization",
    description: "Showcasing textures and details with macroscopic precision, ideal for custom furniture and high-end fixtures.",
    tags: ["Macro", "Detail", "Texture"]
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#0D0D0D] px-6 sm:px-12 md:px-20 lg:px-24 py-32 md:py-48 relative overflow-hidden">
      {/* Structural Grid Background */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 opacity-[0.03] pointer-events-none">
         {Array.from({ length: 8 }).map((_, i) => (
           <div key={i} className="border-r border-white h-full" />
         ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24 md:mb-40">
           <FadeIn delay={0} y={40}>
              <div className="flex flex-col">
                 <span className="text-[10px] uppercase tracking-[0.6em] text-white/30 font-bold mb-4">Core Expertise</span>
                 <h2 className="hero-heading font-black uppercase leading-[0.85] tracking-tighter" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
                    SERVICES
                 </h2>
              </div>
           </FadeIn>
           
           <FadeIn delay={0.2} y={20}>
              <p className="max-w-xs text-white/40 uppercase tracking-widest text-[10px] leading-relaxed font-light">
                 Specializing in high-end projects that require a surgical eye for detail and a cinematic approach to light.
              </p>
           </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          {SERVICES.map((service, i) => (
            <motion.div 
               key={service.num}
               whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
               className="bg-[#0A0A0A] p-10 sm:p-14 md:p-16 flex flex-col gap-10 group transition-colors duration-500"
            >
               <div className="flex justify-between items-start">
                  <span className="font-display font-black text-6xl opacity-10 group-hover:opacity-100 group-hover:text-[#ec4899] transition-all duration-700 leading-none">
                     {service.num}
                  </span>
                  <motion.div 
                     whileHover={{ rotate: 45, scale: 1.1 }}
                     className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:border-white transition-all duration-500"
                  >
                     <ArrowUpRight size={20} />
                  </motion.div>
               </div>

               <div className="flex flex-col gap-6">
                  <h3 className="font-display font-bold uppercase text-2xl tracking-tighter group-hover:translate-x-2 transition-transform duration-500">
                     {service.name}
                  </h3>
                  <p className="font-light text-white/40 leading-relaxed text-sm max-w-sm group-hover:text-white/60 transition-colors duration-500">
                     {service.description}
                  </p>
               </div>

               <div className="flex flex-wrap gap-2 mt-auto pt-6">
                  {service.tags.map(tag => (
                    <span key={tag} className="text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full bg-white/5 text-white/40 border border-white/5 group-hover:border-white/10 group-hover:text-white/70 transition-all duration-500">
                       {tag}
                    </span>
                  ))}
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
