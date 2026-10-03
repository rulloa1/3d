import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, PROFILE } from '../data/content';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'border-b border-white/5 bg-ink/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="group flex items-center gap-3" aria-label={`${PROFILE.name}, back to top`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 font-display text-sm font-extrabold tracking-tight text-fg transition-colors group-hover:border-accent group-hover:text-accent">
            {PROFILE.initials}
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-fg">{PROFILE.name}</span>
            <span className="text-xs text-subtle">{PROFILE.role}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium text-muted transition-colors hover:text-fg">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#contact" className="btn btn-primary hidden min-h-10 px-5 sm:inline-flex">
            Hire me
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <ul className="container-x flex flex-col py-4">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg py-3 text-lg font-medium text-fg/90 hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                  Hire me
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
