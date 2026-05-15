interface ContactButtonProps {
  label?: string;
  className?: string;
}

export default function ContactButton({ label = "Let's Talk", className = "" }: ContactButtonProps) {
  return (
    <button
      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
      className={`
        group relative overflow-hidden rounded-full font-bold uppercase tracking-[0.3em] transition-all duration-700
        px-8 py-4 sm:px-12 sm:py-4.5
        text-[10px] sm:text-xs
        text-black bg-white cursor-none pointer-events-auto
        hover:scale-105 active:scale-95
        shadow-[0_15px_40px_rgba(255,255,255,0.08)]
        ${className}
      `}
    >
      <span className="relative z-10">{label}</span>
      <div className="absolute inset-0 bg-[#E5E9EC] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
    </button>
  );
}
