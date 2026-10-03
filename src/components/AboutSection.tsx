import { Code2, Github, MapPin, Palette } from 'lucide-react';
import FadeIn from './FadeIn';
import { BIO, PROFILE } from '../data/content';

const FACTS = [
  { icon: MapPin, label: 'Based in', value: `${PROFILE.location}, working with clients remotely` },
  { icon: Code2, label: 'Core stack', value: 'React, Next.js, TypeScript, Tailwind CSS' },
  { icon: Palette, label: 'Background', value: '3D & architectural visualization' },
  { icon: Github, label: 'Open source', value: '90+ public repositories on GitHub', href: PROFILE.github },
];

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <FadeIn>
          <p className="eyebrow mb-5">About me</p>
          <h2 id="about-title" className="section-title">
            Design-minded developer. <span className="gradient-text">Detail-obsessed artist.</span>
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-10">
          <FadeIn delay={0.1}>
            <div className="space-y-5 text-lg leading-relaxed text-muted">
              {BIO.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <dl className="grid gap-4 sm:grid-cols-2">
              {FACTS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="card flex gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon size={20} aria-hidden />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">{label}</dt>
                    <dd className="mt-1 text-sm text-fg">
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-4 hover:decoration-accent">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
