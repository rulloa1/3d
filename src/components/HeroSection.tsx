import { motion } from 'motion/react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import Magnet from './Magnet';
import heroPortrait from '../assets/rory-hero.webp';
import { PROFILE } from '../data/content';

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-20 pb-16 md:pt-28">
      {/* Background depth: static CSS glows (no external assets) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-[#1a1f26] blur-[140px]" />
        <div className="absolute right-[-10%] bottom-[-20%] h-[34rem] w-[34rem] rounded-full bg-accent/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      {/* Signature oversized wordmark (decorative) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-2vw] -z-10 select-none text-center font-display font-extrabold uppercase leading-none tracking-[-0.04em] text-white/[0.045] text-[10vw] whitespace-nowrap"
      >
        Rory Ulloa
      </div>

      <div className="container-x grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
        {/* Copy */}
        <div className="order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {PROFILE.availability}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="eyebrow mb-5 hidden sm:inline-flex"
          >
            {PROFILE.name} · {PROFILE.role}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="font-display font-extrabold tracking-tight text-fg"
            style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.9rem)', lineHeight: 1.04 }}
          >
            I build fast, <span className="accent-text">responsive websites</span>{' '}
            <span className="gradient-text">for small businesses.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            New website builds, bug fixes, responsive redesigns and ongoing updates: clean, modern code with a 3D
            artist&apos;s eye for detail.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a href="#contact" className="btn btn-primary">
              Hire me <ArrowRight size={18} aria-hidden />
            </a>
            <a href="#projects" className="btn btn-ghost">
              View my work
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-col gap-3 text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-x-7"
          >
            <li>
              <a href={`mailto:${PROFILE.email}`} className="inline-flex items-center gap-2 hover:text-fg">
                <Mail size={16} aria-hidden className="text-accent" /> {PROFILE.email}
              </a>
            </li>
            <li>
              <a href={PROFILE.phoneHref} className="inline-flex items-center gap-2 hover:text-fg">
                <Phone size={16} aria-hidden className="text-accent" /> {PROFILE.phoneDisplay}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin size={16} aria-hidden className="text-accent" /> {PROFILE.location} · Remote
            </li>
          </motion.ul>
        </div>

        {/* 3D portrait */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
          className="order-1 flex justify-center lg:order-2 lg:justify-end"
        >
          <Magnet padding={120} strength={10}>
            <div className="relative">
              <div aria-hidden className="absolute inset-[8%] -z-10 rounded-full bg-gradient-to-br from-accent/35 via-accent-2/20 to-transparent blur-3xl" />
              <div aria-hidden className="absolute inset-[6%] -z-10 rounded-full border border-white/10" />
              <img
                src={heroPortrait}
                alt="3D character portrait of Rory Ulloa"
                width={500}
                height={500}
                fetchPriority="high"
                decoding="async"
                className="h-auto w-40 drop-shadow-[0_30px_50px_rgba(0,0,0,0.75)] [mask-image:linear-gradient(to_bottom,black_78%,transparent)] sm:w-64 lg:w-[28rem]"
              />
            </div>
          </Magnet>
        </motion.div>
      </div>
    </section>
  );
}
