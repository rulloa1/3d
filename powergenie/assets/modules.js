/* PowerGenie interactive photo modules: image reveal, scroll-triggered video, mouse scrub, scroll scrub.
   Each module verifies its assets and hides itself cleanly if anything fails to load. */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const root = document.documentElement;

function hideModule(el, why) {
  if (el.dataset.failed) return;
  el.dataset.failed = '1';
  console.info('[powergenie] media unavailable, hiding module:', why);
  const sec = el.closest('section');
  if (el.matches('section')) {
    el.hidden = true;
    const dot = document.querySelector(`.dots [data-dot="${el.id}"]`); if (dot) dot.hidden = true;
  } else {
    el.hidden = true;
    if (sec) sec.classList.add('media-missing');
  }
}

function probeImage(url, el) {
  if (!url) return;
  const img = new Image();
  img.onerror = () => hideModule(el, url);
  img.src = url;
}

/* Lazy-load a video when its module nears the viewport. */
function lazyVideo(video, host, preload) {
  let started = false;
  const load = () => {
    if (started) return; started = true;
    if (video.dataset.poster) video.poster = video.dataset.poster;
    video.preload = preload;
    video.src = video.dataset.src;
    video.load();
  };
  video.addEventListener('error', () => hideModule(host, video.dataset.src));
  probeImage(video.dataset.poster, host);
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { load(); io.disconnect(); }
  }, { rootMargin: '700px 0px' });
  io.observe(host);
  return load;
}

/* Reduced motion: poster/still only, no video download, no autoplay. */
function stillOnly(video, host, url) {
  probeImage(url, host);
  video.poster = url;
  video.removeAttribute('src');
}

/* Throttled, lerped seeking shared by both scrubbers. */
function makeSeeker(video) {
  const s = { cur: 0, target: 0, dur: 0 };
  video.addEventListener('loadedmetadata', () => { s.dur = video.duration || 0; });
  s.step = (ease) => {
    s.cur += (s.target - s.cur) * ease;
    if (s.dur && video.readyState >= 1 && !video.seeking) {
      const t = clamp(s.cur, 0, s.dur - 0.04);
      if (Math.abs(video.currentTime - t) > 1 / 90) video.currentTime = t;
    }
    return Math.abs(s.target - s.cur) > 0.003 || video.seeking;
  };
  return s;
}

/* 1) Image reveal: feathered radial mask follows the pointer; the hole eases closed when idle. */
function initReveal(fig) {
  const stage = fig.querySelector('.rv-stage');
  const imgs = [...fig.querySelectorAll('img')];
  imgs.forEach((img) => {
    img.addEventListener('error', () => hideModule(fig, img.currentSrc || img.src));
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) hideModule(fig, img.currentSrc);
  });
  const toggle = fig.querySelector('.rv-toggle');
  toggle.addEventListener('click', () => {
    const on = !fig.classList.contains('show-night');
    fig.classList.toggle('show-night', on);
    toggle.setAttribute('aria-pressed', String(on));
    toggle.textContent = on ? 'Show the daytime' : 'Show the blackout';
  });
  if (reduce) { fig.classList.add('rm'); return; }

  const st = { x: 0, y: 0, tx: 0, ty: 0, r: 0, last: 0, inside: false, seen: false, running: false };
  const apply = () => {
    stage.style.setProperty('--x', st.x.toFixed(1) + 'px');
    stage.style.setProperty('--y', st.y.toFixed(1) + 'px');
    stage.style.setProperty('--r', st.r.toFixed(1) + 'px');
  };
  const frame = () => {
    const now = performance.now();
    const R = Math.max(130, stage.clientWidth * 0.24);
    const tr = st.inside && now - st.last < 900 ? R : 0;
    st.x += (st.tx - st.x) * 0.2;
    st.y += (st.ty - st.y) * 0.2;
    st.r += (tr - st.r) * (tr > st.r ? 0.14 : 0.035); // open fast, fade back slowly
    if (tr === 0 && st.r < 0.6) { st.r = 0; apply(); st.running = false; stage.classList.remove('active'); return; }
    apply();
    requestAnimationFrame(frame);
  };
  const move = (e) => {
    const r = stage.getBoundingClientRect();
    st.tx = e.clientX - r.left; st.ty = e.clientY - r.top;
    if (!st.seen || st.r < 1) { st.x = st.tx; st.y = st.ty; st.seen = true; }
    st.last = performance.now(); st.inside = true;
    stage.classList.add('active');
    if (!st.running) { st.running = true; requestAnimationFrame(frame); }
  };
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerdown', move);
  stage.addEventListener('pointerleave', () => { st.inside = false; });
  stage.addEventListener('pointercancel', () => { st.inside = false; });
}

/* 2) Scroll-triggered video: plays once when 50% in view, then rests on its last frame. */
function initScrollVideo(fig) {
  const v = fig.querySelector('video');
  if (reduce) { stillOnly(v, fig, v.dataset.still || v.dataset.poster); return; }
  const load = lazyVideo(v, fig, 'auto');
  let played = false;
  const play = () => {
    load();
    const go = () => v.play().catch(() => { // autoplay refused: jump to the final frame instead
      if (v.duration) v.currentTime = v.duration - 0.05;
    });
    if (v.readyState >= 3) go(); else v.addEventListener('canplay', go, { once: true });
  };
  v.addEventListener('ended', () => { v.pause(); fig.classList.add('done'); });
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (!played && e.intersectionRatio >= 0.5) { played = true; play(); io.disconnect(); } });
  }, { threshold: [0, 0.5, 0.75] });
  io.observe(fig);
}

/* 3) Mouse scrub: paused video; cursor X (or touch drag) maps to currentTime. Never autoplays. */
function initMouseScrub(fig) {
  const v = fig.querySelector('video');
  const bar = fig.querySelector('.ms-track span');
  if (reduce) { fig.classList.add('rm'); stillOnly(v, fig, v.dataset.poster); return; }
  lazyVideo(v, fig, 'auto');
  const sk = makeSeeker(v);
  let running = false;
  v.addEventListener('loadedmetadata', () => { sk.dur = v.duration; sk.cur = sk.target = sk.dur / 2; v.currentTime = sk.cur; bar.style.width = '50%'; });
  const tick = () => {
    const more = sk.step(0.22);
    if (sk.dur) bar.style.width = (100 * sk.cur / sk.dur).toFixed(2) + '%';
    if (more) requestAnimationFrame(tick); else running = false;
  };
  const fromX = (x) => {
    if (!sk.dur) return;
    const r = fig.getBoundingClientRect();
    sk.target = clamp((x - r.left) / r.width, 0, 1) * sk.dur;
    fig.classList.add('touched');
    if (!running) { running = true; requestAnimationFrame(tick); }
  };
  fig.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons) fromX(e.clientX); });
  fig.addEventListener('pointerdown', (e) => fromX(e.clientX));
}

/* 4) Scroll scrub: tall sticky section; scroll progress drives currentTime (down = forward, up = rewind). */
function initScrollScrub(sec) {
  const v = sec.querySelector('video');
  const steps = [...sec.querySelectorAll('.step')];
  const bar = sec.querySelector('.scrub-bar span');
  if (reduce) { sec.classList.add('rm'); stillOnly(v, sec, v.dataset.still || v.dataset.poster); return; }
  lazyVideo(v, sec, 'auto');
  v.addEventListener('loadeddata', () => sec.classList.add('ready'));
  const sk = makeSeeker(v);
  let active = false;
  const progress = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  };
  const tick = () => {
    const p = progress();
    sk.target = p * sk.dur;
    sk.step(0.16);
    bar.style.width = (p * 100).toFixed(1) + '%';
    let idx = steps.findIndex((s) => p < parseFloat(s.dataset.until));
    if (idx < 0) idx = steps.length - 1;
    steps.forEach((s, i) => s.classList.toggle('is-on', i === idx));
    sec.classList.toggle('scrolled', p > 0.03);
    if (active) requestAnimationFrame(tick);
  };
  new IntersectionObserver((es) => {
    const was = active; active = es[0].isIntersecting;
    if (active && !was) requestAnimationFrame(tick);
  }, { rootMargin: '100px 0px' }).observe(sec);
}

/* Fade/pause the WebGL background while media sections own the viewport. */
function initGlHandoff() {
  const secs = [...document.querySelectorAll('main > section')];
  let pending = false;
  const check = () => {
    pending = false;
    const mid = window.innerHeight / 2;
    let off = false;
    for (const s of secs) {
      if (s.hidden) continue;
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) { off = s.dataset.gl === 'off'; break; }
    }
    root.classList.toggle('gl-off', off);
  };
  window.addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(check); } }, { passive: true });
  window.addEventListener('resize', check);
  check();
}

const init = { 'reveal': initReveal, 'scroll-video': initScrollVideo, 'mouse-scrub': initMouseScrub, 'scroll-scrub': initScrollScrub };
document.querySelectorAll('[data-module]').forEach((el) => {
  try { init[el.dataset.module](el); } catch (err) { console.warn(err); hideModule(el, 'init error'); }
});
initGlHandoff();
