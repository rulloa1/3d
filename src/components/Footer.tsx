import { NAV_LINKS, PROFILE } from '../data/content';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink py-12">
      <div className="container-x grid gap-8 md:grid-cols-[1.2fr_1fr_1.4fr] md:items-start">
        <div>
          <p className="font-display text-lg font-bold text-fg">{PROFILE.name}</p>
          <p className="text-sm text-subtle">
            {PROFILE.role} · {PROFILE.location}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-fg">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <li>
            <a href={`mailto:${PROFILE.email}`} className="hover:text-fg">
              {PROFILE.email}
            </a>
          </li>
          <li>
            <a href={PROFILE.phoneHref} className="hover:text-fg">
              {PROFILE.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
              GitHub
            </a>
          </li>
          <li>
            <a href={PROFILE.artstation} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
              ArtStation
            </a>
          </li>
        </ul>
      </div>
      <p className="container-x mt-10 text-xs text-subtle">
        &copy; {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
      </p>
    </footer>
  );
}
