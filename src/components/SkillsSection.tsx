import { Boxes, Code, Layers, Rocket, Server, Wrench } from 'lucide-react';
import FadeIn from './FadeIn';
import { SKILL_GROUPS } from '../data/content';

const ICONS = [Code, Layers, Boxes, Server, Wrench, Rocket];

export default function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="section-y relative bg-surface/40">
      <div className="container-x">
        <FadeIn>
          <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-5">Skills</p>
              <h2 id="skills-title" className="section-title">
                The toolkit <span className="gradient-text">behind the work.</span>
              </h2>
            </div>
            <p className="max-w-md text-muted">
              Drawn from the stacks across my public projects, from simple static landing pages to full-stack booking
              apps.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((group, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <FadeIn key={group.title} delay={0.05 * i}>
                <article className="card group flex h-full flex-col p-7 transition-colors duration-300 hover:border-white/20">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent-2/10 text-accent">
                      <Icon size={22} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-fg">{group.title}</h3>
                      <p className="text-sm text-subtle">{group.blurb}</p>
                    </div>
                  </div>
                  <ul className="flex flex-wrap gap-2" aria-label={`${group.title} skills`}>
                    {group.skills.map((s) => (
                      <li key={s} className="chip transition-colors group-hover:border-white/15 group-hover:text-fg/90">
                        {s}
                      </li>
                    ))}
                  </ul>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
