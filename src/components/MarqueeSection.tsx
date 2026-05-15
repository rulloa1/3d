import { useEffect, useState, useRef } from 'react';

const IMAGES_ROW_1 = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
];

const IMAGES_ROW_2 = [
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

export default function MarqueeSection() {
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const scrollOffset = (window.scrollY - top + window.innerHeight) * 0.3;
      setOffset(scrollOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-40 sm:py-56 md:py-64 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-10">
         <div className="w-[1px] h-20 bg-white" />
         <span className="text-[10px] uppercase font-bold tracking-[0.4em] rotate-180 vertical-text origin-center">Showcase</span>
      </div>

      <div className="flex flex-col gap-8 md:gap-12 pt-20">
        {/* Row 1 - Right */}
        <div 
          className="flex gap-6 md:gap-10 whitespace-nowrap"
          style={{ 
            transform: `translateX(${offset - 200}px)`, 
            willChange: 'transform' 
          }}
        >
          {[...IMAGES_ROW_1, ...IMAGES_ROW_1, ...IMAGES_ROW_1].map((src, i) => (
            <div key={i} className="group relative overflow-hidden rounded-[32px] sm:rounded-[48px] border border-white/5 bg-white/5">
              <img
                src={src}
                alt="3D Visualization Work"
                className="w-[480px] h-[320px] sm:w-[600px] sm:h-[400px] md:w-[720px] md:h-[480px] object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Row 2 - Left */}
        <div 
          className="flex gap-6 md:gap-10 whitespace-nowrap"
          style={{ 
            transform: `translateX(${- (offset - 200)}px)`, 
            willChange: 'transform' 
          }}
        >
          {[...IMAGES_ROW_2, ...IMAGES_ROW_2, ...IMAGES_ROW_2].map((src, i) => (
            <div key={i} className="group relative overflow-hidden rounded-[32px] sm:rounded-[48px] border border-white/5 bg-white/5">
              <img
                src={src}
                alt="3D Architectural Result"
                className="w-[480px] h-[320px] sm:w-[600px] sm:h-[400px] md:w-[720px] md:h-[480px] object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
