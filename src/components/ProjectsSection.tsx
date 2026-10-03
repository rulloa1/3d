import { ArrowUpRight, Github } from 'lucide-react';
import FadeIn from './FadeIn';
import { PROFILE, PROJECTS } from '../data/content';

export default function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="section-y relative">
      <div className="container-x">
        <FadeIn>
          <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-5">Selected work</p>
              <h2 id="projects-title" className="section-title">
                Real sites, <span className="gradient-text">real code.</span>
              </h2>
            </div>
            <p className="max-w-md text-muted">
              A few builds from my public GitHub: small-business sites, landing pages, a full-stack booking app and a
              developer tool.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {PROJECTS.map((p, i) => (
            <FadeIn key={p.title} delay={0.05 * (i % 2)}>
              <article className="card group flex h-full flex-col overflow-hidden transition-colors duration-300 hover:border-white/20">
                <a
                  href={p.live ?? p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[16/10] overflow-hidden border-b border-line bg-surface-2"
                  aria-label={`${p.title}: open ${p.live ? 'live site' : 'source on GitHub'}`}
                >
                  <img
                    src={p.image}
                    alt={p.imageAlt}
                    width={960}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-fg backdrop-blur">
                    {p.kind}
                  </span>
                </a>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="font-display text-xl font-bold text-fg sm:text-2xl">{p.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{p.description}</p>

                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
                    {p.tech.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap gap-3 pt-7">
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-10 px-5">
                        Live site <ArrowUpRight size={16} aria-hidden />
                      </a>
                    )}
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost min-h-10 px-5">
                      <Github size={16} aria-hidden /> View code
                    </a>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-14 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <Github size={18} aria-hidden /> More on GitHub
            </a>
            <a href={PROFILE.artstation} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              3D work on ArtStation <ArrowUpRight size={18} aria-hidden />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
