import { TECH_STRIP } from '../data/content';

/** Infinite, CSS-only tech strip. Pauses on hover; stops for reduced-motion users. */
export default function TechMarquee() {
  const items = [...TECH_STRIP, ...TECH_STRIP];
  return (
    <section aria-label="Technologies I work with" className="marquee relative overflow-hidden border-y border-white/5 bg-surface/60 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink to-transparent" />
      <ul className="marquee-track flex w-max items-center gap-10">
        {items.map((t, i) => (
          <li
            key={`${t}-${i}`}
            aria-hidden={i >= TECH_STRIP.length}
            className="flex items-center gap-10 whitespace-nowrap font-display text-lg font-bold text-white/60 md:text-xl"
          >
            {t}
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent/70" />
          </li>
        ))}
      </ul>
    </section>
  );
}
