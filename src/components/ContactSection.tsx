import { useState, type FormEvent } from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import FadeIn from './FadeIn';
import { PROFILE } from '../data/content';

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base text-fg placeholder:text-white/35 transition-colors focus:border-accent focus:bg-white/[0.05] focus:outline-none';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Opens the visitor's email app with the details pre-filled (properly URL-encoded).
    const subject = `Project inquiry from ${form.name}`;
    const body = `${form.message}\n\nFrom: ${form.name} (${form.email})`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[150px]" />

      <div className="container-x relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        <FadeIn>
          <p className="eyebrow mb-5">Contact</p>
          <h2 id="contact-title" className="section-title">
            Let&apos;s build <span className="accent-text">something great.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Need a new website, a bug fixed, or your site to finally work on phones? Tell me about your project and
            I&apos;ll get back to you.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            <li>
              <a href={`mailto:${PROFILE.email}`} className="card group flex items-center gap-4 p-5 transition-colors hover:border-accent/50">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Mail size={20} aria-hidden />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-subtle">Email</span>
                  <span className="block font-display text-lg font-semibold text-fg sm:text-xl">{PROFILE.email}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={PROFILE.phoneHref} className="card group flex items-center gap-4 p-5 transition-colors hover:border-accent/50">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Phone size={20} aria-hidden />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-subtle">Phone</span>
                  <span className="block font-display text-lg font-semibold text-fg sm:text-xl">{PROFILE.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li className="flex items-center gap-4 px-5 py-2 text-muted">
              <MapPin size={18} aria-hidden className="text-accent" /> {PROFILE.location} · available for remote work
            </li>
          </ul>
        </FadeIn>

        <FadeIn delay={0.1}>
          <form onSubmit={handleSubmit} className="card flex flex-col gap-5 p-6 sm:p-8" aria-describedby="form-note">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-fg">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Smith"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-fg">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-fg">
                Project details
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="What do you need built, fixed or updated? Any deadline or budget?"
                className={`${inputClass} resize-y`}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2 w-full">
              Send inquiry <ArrowRight size={18} aria-hidden />
            </button>
            <p id="form-note" className="text-center text-xs text-subtle">
              Opens your email app with your message ready to send.
            </p>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
