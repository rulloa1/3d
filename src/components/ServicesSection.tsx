import { Box, Bug, Gauge, Hammer, MonitorSmartphone, RefreshCw } from 'lucide-react';
import FadeIn from './FadeIn';
import { SERVICES } from '../data/content';

const ICONS = [Hammer, Bug, MonitorSmartphone, RefreshCw, Gauge, Box];

export default function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y relative bg-surface/40">
      <div className="container-x">
        <FadeIn>
          <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-5">Services</p>
              <h2 id="services-title" className="section-title">
                How I can <span className="gradient-text">help.</span>
              </h2>
            </div>
            <p className="max-w-md text-muted">
              From a quick fix to a full build, I keep projects scoped, communicate clearly and deliver work you can
              easily maintain.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <article key={s.title} className="group flex flex-col gap-5 bg-surface p-7 transition-colors duration-300 hover:bg-surface-2 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-accent transition-colors group-hover:border-accent/50">
                    <Icon size={22} aria-hidden />
                  </span>
                  <span aria-hidden className="font-display text-3xl font-extrabold text-white/10 transition-colors group-hover:text-accent/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-fg">{s.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.description}</p>
                </div>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {s.points.map((pt) => (
                    <li key={pt} className="chip">
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
