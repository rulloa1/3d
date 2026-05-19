import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import ContactButton from './ContactButton';

function StatCounter({ value, label }: { value: string, label: string }) {
  const numericValue = parseInt(value);
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericValue;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);

  return (
    <div ref={ref} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center backdrop-blur-sm group hover:border-white/30 transition-colors duration-500 w-full sm:w-48">
      <span className="text-[2.5rem] font-black text-white mb-1 group-hover:scale-110 transition-transform duration-500">
        {count}{value.includes('+') ? '+' : ''}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-white/40 text-center uppercase">{label}</span>
    </div>
  );
}

export default function AboutSection() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const bio = "I am a 3D Architectural Visualizer based in Houston, specialized in bringing unbuilt environments to life. My work bridges the gap between technical blueprints and emotional resonance, using state-of-the-art rendering technology to create cinematic previews of future spaces. With a focus on light, texture, and soul, I help architects, developers, and designers communicate their core vision through striking visual narratives.";

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section 
      ref={container}
      id="about" 
      className="min-h-screen relative flex flex-col items-center justify-center section-padding py-32 overflow-hidden bg-black"
    >
      {/* Dynamic Background Elements - Parallax */}
      <motion.img 
        style={{ y: y1 }}
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" 
        alt="Moon"
        className="absolute top-[10%] left-[5%] w-[180px] md:w-[280px] opacity-20 pointer-events-none blur-sm grayscale hover:grayscale-0 transition-all duration-1000"
      />
      <motion.img 
        style={{ y: y2 }}
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" 
        alt="Creative Element"
        className="absolute bottom-[15%] left-[8%] w-[150px] md:w-[220px] opacity-10 pointer-events-none grayscale"
      />
      <motion.img 
        style={{ y: y3 }}
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" 
        alt="Structure Element"
        className="absolute top-[5%] right-[5%] w-[180px] md:w-[260px] opacity-15 pointer-events-none blur-xs grayscale"
      />
      <motion.img 
        style={{ y: y4 }}
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" 
        alt="Group Element"
        className="absolute bottom-[10%] right-[8%] w-[200px] md:w-[300px] opacity-10 pointer-events-none grayscale"
      />

      <div className="z-10 flex flex-col items-center max-w-5xl w-full">
        <FadeIn delay={0} y={40}>
          <div className="flex flex-col items-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.6em] text-white/30 font-bold mb-4">The Narrative</span>
            <h2 className="hero-heading font-black uppercase leading-[0.8] tracking-tighter text-center" style={{ fontSize: 'clamp(4rem, 15vw, 220px)' }}>
              ABOUT<br />ME
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
           <FadeIn delay={0.2} y={30}>
              <div className="flex flex-col gap-8">
                 <div className="w-12 h-[1px] bg-white/20" />
                 <h3 className="font-display font-bold uppercase text-2xl sm:text-3xl leading-tight tracking-tight">
                    Crafting cinematic previews of future spaces.
                 </h3>
                 <p className="font-light text-white/40 uppercase tracking-[0.2em] text-[10px] leading-relaxed">
                    Based in Houston, TX<br />
                    Works Globally
                 </p>
              </div>
           </FadeIn>

           <FadeIn delay={0.4} y={30}>
              <div className="flex flex-col gap-10">
                 <AnimatedText 
                    text={bio}
                    className="text-white/80 font-normal leading-[1.6] text-lg sm:text-xl tracking-tight"
                 />
                 
                 <div className="flex flex-wrap gap-4">
                    <ContactButton label="Let's Talk" />
                 </div>

                 {/* Animated Stat Counters */}
                 <div className="flex flex-wrap gap-6 w-full mt-8">
                    <StatCounter value="5+" label="Years Experience" />
                    <StatCounter value="50+" label="Projects Completed" />
                    <StatCounter value="3" label="Countries Served" />
                 </div>
              </div>
           </FadeIn>
        </div>
        
        {/* Expertise Bars */}
        <div className="mt-40 w-full grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-20 border-t border-white/5 pt-20">
           {[
              { label: 'Modeling', val: '01' },
              { label: 'Shading', val: '02' },
              { label: 'Lighting', val: '03' },
              { label: 'Direction', val: '04' }
           ].map((skill, i) => (
             <FadeIn key={skill.val} delay={0.6 + (i * 0.1)} y={20}>
                <div className="flex flex-col gap-4 group">
                   <span className="text-[10px] uppercase tracking-widest text-white/20 group-hover:text-white/60 transition-colors">{skill.val}</span>
                   <span className="text-sm uppercase font-bold tracking-[0.2em]">{skill.label}</span>
                   <div className="h-[1px] bg-white/5 relative overflow-hidden">
                      <motion.div 
                         initial={{ x: '-100%' }}
                         whileInView={{ x: '0%' }}
                         transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                         className="absolute inset-0 bg-white/10" 
                      />
                   </div>
                </div>
             </FadeIn>
           ))}
        </div>

      </div>
    </section>
  );
}
