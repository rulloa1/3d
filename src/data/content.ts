/**
 * Single source of truth for portfolio copy, links and skills.
 *
 * CONTENT RULE: everything here is either already in this repo, provided by
 * Rory directly, or evidenced by his public GitHub repositories
 * (https://github.com/rulloa1). Anything still missing is marked `TODO(rory)`
 * so it can be filled in with real information. Please do not invent facts.
 */
import washdentImg from '../assets/projects/washdent.webp';
import mrcImg from '../assets/projects/mrc.webp';
import renesImg from '../assets/projects/renes.webp';
import chandlerImg from '../assets/projects/chandler.webp';
import smokeshopImg from '../assets/projects/smokeshop.webp';
import crmImg from '../assets/projects/crm.webp';

export const PROFILE = {
  name: 'Rory Ulloa',
  initials: 'RU',
  role: 'Web Developer & 3D Artist',
  location: 'Houston, TX',
  availability: 'Available for remote freelance projects',
  email: 'rory@theroyeffect.com',
  phoneDisplay: '(346) 462-3734',
  phoneHref: 'tel:+13464623734',
  github: 'https://github.com/rulloa1',
  artstation: 'https://www.artstation.com/roryulloa',
  // TODO(rory): add LinkedIn / Upwork / Fiverr / Contra profile URLs if you have them.
  // TODO(rory): add a downloadable resume (e.g. public/resume.pdf) if you want one linked.
} as const;

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Work', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
] as const;

/**
 * Bio assembled only from evidence (location, 3D background, and the kinds of
 * sites in his public repos). TODO(rory): personalise this in your own words.
 */
export const BIO = [
  "I'm Rory Ulloa, a Houston-based web developer and 3D artist. I build fast, responsive websites for small businesses: contractors and remodelers, a dental practice, outdoor-maintenance and lawn-care companies, smoke shops and design studios.",
  'My background in 3D and architectural visualization means I sweat the visual details (light, spacing, typography) while keeping the code clean, accessible and easy to update. Whether you need a new site, a stubborn bug fixed, a layout that finally works on phones, or ongoing updates, I can help.',
];

export interface SkillGroup {
  title: string;
  blurb: string;
  skills: string[];
}

/** Grouped skills. See PR description for which items come from repo evidence vs. standard additions. */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Languages',
    blurb: 'The core of every build.',
    skills: ['TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Python', 'SQL'],
  },
  {
    title: 'Frontend',
    blurb: 'Modern, component-driven UIs.',
    skills: [
      'React',
      'Next.js',
      'Vite',
      'Astro',
      'React Router',
      'TanStack Query',
      'React Hook Form',
      'Zod',
      'shadcn/ui',
      'Radix UI',
      'Recharts',
      'Leaflet maps',
    ],
  },
  {
    title: 'Styling, Motion & 3D',
    blurb: 'Polished visuals that still load fast.',
    skills: [
      'Tailwind CSS',
      'Framer Motion',
      'GSAP',
      'Lenis smooth scroll',
      'Three.js',
      'React Three Fiber',
      '3D visualization & rendering',
    ],
  },
  {
    title: 'Backend, Data & APIs',
    blurb: 'Forms, bookings, logins and data.',
    skills: [
      'Node.js',
      'Express',
      'tRPC',
      'REST APIs',
      'Supabase',
      'Firebase',
      'PostgreSQL',
      'Drizzle ORM',
      'Prisma',
      'Cloudflare D1 & Workers',
      'Stripe payments',
      'OpenAI API',
      'n8n automation',
    ],
  },
  {
    title: 'Tools & Platforms',
    blurb: 'Ship, test and deploy with confidence.',
    skills: [
      'Git & GitHub',
      'GitHub Pages',
      'Vercel',
      'Netlify',
      'Cloudflare Pages',
      'Docker',
      'ESLint & Prettier',
      'Vitest',
      'Testing Library',
      'Playwright',
      'AI-assisted development',
    ],
  },
  {
    title: 'Services & Practices',
    blurb: 'What clients actually hire me for.',
    skills: [
      'Small-business websites',
      'Landing pages',
      'Lead-generation & marketing sites',
      'Booking systems & admin dashboards',
      'Responsive / mobile-first design',
      'Bug fixing & troubleshooting',
      'Website maintenance & updates',
      'Cross-browser testing',
      'Performance optimization',
      'SEO basics',
      'Accessibility (WCAG basics)',
      'Clear client communication',
    ],
  },
];

/** Short list shown in the scrolling tech strip. */
export const TECH_STRIP = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Vite',
  'Node.js',
  'Supabase',
  'Three.js',
  'Framer Motion',
  'GSAP',
  'Cloudflare',
  'Vercel',
  'Netlify',
  'GitHub Pages',
];

export interface Project {
  title: string;
  kind: string;
  description: string;
  tech: string[];
  image: string;
  imageAlt: string;
  repo: string;
  /** Only set when the live URL was verified to load. */
  live?: string;
}

/** Real projects from Rory's public GitHub repos. Descriptions are drawn from each repo's README/description. */
export const PROJECTS: Project[] = [
  {
    title: 'Washington Dental: Website Redesign',
    kind: 'Concept redesign',
    description:
      'A modern, warm-editorial homepage concept for a long-running Houston dental practice, replacing a 2011-era splash page. Includes sticky click-to-call navigation, a 12-service grid, a first-visit guide, testimonials and bilingual touches.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
    image: washdentImg,
    imageAlt: 'Washington Dental redesign homepage with a cream background and serif headline',
    repo: 'https://github.com/rulloa1/washdent-redesign',
  },
  {
    title: "Rene's Outdoor Maintenance",
    kind: 'Full-stack booking site',
    description:
      'A booking and admin portal for a Houston-area outdoor services business: Home, Services and Booking pages plus owner and admin dashboards, with type-safe APIs and a serverless database.',
    tech: ['React', 'TypeScript', 'tRPC', 'Drizzle ORM', 'Cloudflare D1', 'Tailwind CSS'],
    image: renesImg,
    imageAlt: "Rene's Outdoor Maintenance homepage with bold black and neon-green design",
    repo: 'https://github.com/rulloa1/renesoutdoormaintenance',
  },
  {
    title: 'MRC Construction',
    kind: 'Landing page',
    description:
      'A luxury bathroom-remodeling landing page for a Houston contractor, with cinematic hero visuals, scroll-driven animation and a prominent click-to-call button.',
    tech: ['HTML', 'Tailwind CSS', 'GSAP', 'ScrollTrigger'],
    image: mrcImg,
    imageAlt: 'MRC Construction landing page hero with logo and the tagline "Turning old bathrooms into beautiful spaces"',
    repo: 'https://github.com/rulloa1/mrc-construction',
  },
  {
    title: 'Michael Chandler Design',
    kind: 'Portfolio website',
    description:
      'A premium portfolio for luxury home design and construction, with project narratives, an interactive design gallery and Supabase-backed gallery management.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
    image: chandlerImg,
    imageAlt: 'Michael Chandler Design homepage with an elegant serif name on a dark background',
    repo: 'https://github.com/rulloa1/my-tipler-dream-fixed',
    live: 'https://rulloa1.github.io/my-tipler-dream-fixed/',
  },
  {
    title: 'Smokeshop Growth',
    kind: 'Marketing website',
    description:
      'A growth-marketing and portfolio site selling web design to smoke and vape shops: bold conversion-focused hero, pricing, portfolio and a lead pipeline backed by serverless functions.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Cloudflare Functions'],
    image: smokeshopImg,
    imageAlt: 'Smokeshop Growth homepage reading "Websites that move product"',
    repo: 'https://github.com/rulloa1/smokeshop-growth-website',
  },
  {
    title: 'CRM Website Generator',
    kind: 'Developer tool',
    description:
      'A zero-dependency Node.js static site generator that turns a JSON config into a complete, responsive business website (Home, About, Services and Contact) in seconds.',
    tech: ['Node.js', 'JavaScript', 'HTML', 'CSS'],
    image: crmImg,
    imageAlt: 'Example website generated by the CRM Website Generator with a blue hero section',
    repo: 'https://github.com/rulloa1/crm-website-generator',
  },
];

export interface Service {
  title: string;
  description: string;
  points: string[];
}

// TODO(rory): add starting prices / typical turnaround if you want them shown.
export const SERVICES: Service[] = [
  {
    title: 'Website Builds',
    description: 'New landing pages and small-business sites designed, built and launched.',
    points: ['Custom design', 'Contact & booking forms', 'Deployed and live'],
  },
  {
    title: 'Bug Fixes',
    description: 'Broken layouts, forms, scripts or builds tracked down and fixed properly.',
    points: ['Fast diagnosis', 'Root-cause fixes', 'Clear write-up'],
  },
  {
    title: 'Responsive Redesigns',
    description: 'Make an existing site look great and work smoothly on every screen size.',
    points: ['Mobile-first layouts', 'Cross-browser tested', 'Modern refresh'],
  },
  {
    title: 'Updates & Maintenance',
    description: 'Content changes, new pages, dependency updates and ongoing care.',
    points: ['Quick turnaround', 'Content updates', 'Ongoing support'],
  },
  {
    title: 'Speed, SEO & Accessibility',
    description: 'Tune-ups that make your site faster, easier to find and usable by everyone.',
    points: ['Performance fixes', 'Meta tags & structure', 'Accessibility basics'],
  },
  {
    title: '3D Visualization',
    description: 'Architectural renders, walkthroughs and product visuals that bring ideas to life.',
    points: ['Photoreal renders', 'Walkthroughs', 'Product visuals'],
  },
];
