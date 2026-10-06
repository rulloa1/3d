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

/* 1) Image reveal (spec: Image Reveal Hero)
   FRONT (.rv-over, daytime) sits on top of REVEAL (.rv-under, blackout). A CSS radial-gradient mask-image on FRONT is
   centred on the cursor via --reveal-x / --reveal-y. pointermove only stores the target; one rAF loop eases and writes
   the CSS variables (rAF throttle). pointerleave closes the mask so FRONT is whole again; when the pointer rests,
   the hole also eases closed slowly. CSS mask only, no WebGL. Reduced motion: FRONT static (optional toggle button). */
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
  if (reduce) { fig.classList.add('rm'); return; } // FRONT stays static; no mask motion

  const st = { x: 0, y: 0, tx: 0, ty: 0, r: 0, last: 0, inside: false, leaving: false, seen: false, running: false };
  const write = () => {
    stage.style.setProperty('--reveal-x', st.x.toFixed(1) + 'px');
    stage.style.setProperty('--reveal-y', st.y.toFixed(1) + 'px');
    stage.style.setProperty('--reveal-r', st.r.toFixed(1) + 'px');
  };
  const frame = () => {
    const now = performance.now();
    const R = Math.max(130, stage.clientWidth * 0.24);
    const tr = st.inside && now - st.last < 900 ? R : 0;
    st.x += (st.tx - st.x) * 0.2;
    st.y += (st.ty - st.y) * 0.2;
    const k = tr > st.r ? 0.14 : st.leaving ? 0.12 : 0.035; // open fast; close on leave; slow fade when idle
    st.r += (tr - st.r) * k;
    if (tr === 0 && st.r < 0.6) { st.r = 0; write(); st.running = false; stage.classList.remove('active'); return; }
    write();
    requestAnimationFrame(frame);
  };
  const kick = () => { if (!st.running) { st.running = true; requestAnimationFrame(frame); } };
  const move = (e) => {
    const r = stage.getBoundingClientRect();
    st.tx = e.clientX - r.left; st.ty = e.clientY - r.top;
    if (!st.seen || st.r < 1) { st.x = st.tx; st.y = st.ty; st.seen = true; }
    st.last = performance.now(); st.inside = true; st.leaving = false;
    stage.classList.add('active');
    kick();
  };
  const leave = () => { st.inside = false; st.leaving = true; kick(); };
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerdown', move);
  stage.addEventListener('pointerleave', leave);
  stage.addEventListener('pointercancel', leave);
}

/* 2) Scroll-triggered video section (spec: Scroll-Triggered Video Section)
   Full-viewport section; the video starts paused on frame 1. When the section fills the viewport ("armed"), ONE
   downward wheel / touch / key gesture is consumed (preventDefault), the section is aligned to the viewport, and the
   video plays from the current frame to the end. During playback all scroll input is locked (wheel, touchmove,
   scroll keys, hash-link clicks, scrollbar via overflow:hidden), so extra gestures cannot restart, scrub, skip or
   move the page. On 'ended' it pauses frozen on the final frame and the page is released.
   Scroll progress is never mapped to currentTime: the gesture is only a trigger. */
function initScrollVideo(sec) {
  const v = sec.querySelector('video');
  if (reduce) { sec.classList.add('rm', 'done'); stillOnly(v, sec, v.dataset.still || v.dataset.poster); return; }
  const load = lazyVideo(v, sec, 'auto');
  let state = 'idle'; // idle -> playing -> done
  let lockY = 0, alignUntil = 0, safety = 0, lastTouchY = null, lastTouchEnd = 0, lastAnchor = 0;
  const SCROLL_KEYS = new Set(['ArrowDown', 'PageDown', ' ', 'Spacebar', 'End']);
  const ALL_KEYS = new Set([...SCROLL_KEYS, 'ArrowUp', 'PageUp', 'Home']);

  const armed = () => {
    if (state !== 'idle' || sec.hidden) return false;
    const r = sec.getBoundingClientRect(), vh = window.innerHeight;
    // armed as the section arrives (top between 25% below and 8% above the viewport top), so alignment glides forward
    return r.height > 0 && r.top <= vh * 0.25 && r.top >= -vh * 0.08;
  };
  const release = () => {
    root.classList.remove('scroll-locked');
    clearTimeout(safety);
  };
  const finish = () => {
    if (state === 'done') return;
    state = 'done';
    v.pause();
    sec.classList.remove('playing'); sec.classList.add('done');
    release();
  };
  const trigger = () => {
    state = 'playing';
    sec.classList.add('playing');
    lockY = Math.round(sec.getBoundingClientRect().top + window.scrollY);
    root.classList.add('scroll-locked');
    alignUntil = performance.now() + 800;
    window.scrollTo({ top: lockY, behavior: 'smooth' });
    load();
    const go = () => v.play().catch(() => { if (v.duration) v.currentTime = v.duration - 0.04; finish(); });
    if (v.readyState >= 3) go(); else v.addEventListener('canplay', go, { once: true });
    // never trap the visitor: release even if the media stalls
    safety = setTimeout(finish, 15000);
  };
  v.addEventListener('ended', finish);
  v.addEventListener('error', () => { if (state === 'playing') finish(); });

  const consume = (e) => { if (e.cancelable) e.preventDefault(); };
  window.addEventListener('wheel', (e) => {
    if (state === 'playing') return consume(e);
    if (e.deltaY > 0 && armed()) { consume(e); trigger(); }
  }, { passive: false });
  window.addEventListener('touchstart', (e) => { lastTouchY = e.touches[0] ? e.touches[0].clientY : null; }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (state === 'playing') return consume(e);
    const y = e.touches[0] ? e.touches[0].clientY : null;
    if (y != null && lastTouchY != null && lastTouchY - y > 4 && armed()) { consume(e); trigger(); }
  }, { passive: false });
  window.addEventListener('touchend', () => { lastTouchEnd = performance.now(); }, { passive: true });
  window.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable]')) return;
    if (state === 'playing' && ALL_KEYS.has(e.key)) return consume(e);
    if (SCROLL_KEYS.has(e.key) && !e.shiftKey && armed()) { consume(e); trigger(); }
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    if (state === 'playing') { e.preventDefault(); return; }
    lastAnchor = performance.now();
  }, true);
  let prevY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY, now = performance.now();
    if (state === 'playing') {
      // hold the page still during playback (after the short alignment glide)
      if (now > alignUntil && Math.abs(y - lockY) > 1) window.scrollTo({ top: lockY, behavior: 'instant' });
    } else if (state === 'idle' && y > prevY && now - lastTouchEnd < 1500 && now - lastAnchor > 2000 && armed()) {
      trigger(); // touch momentum carried the page into the section without a touchmove: treat as the gesture
    }
    prevY = y;
  }, { passive: true });
}

/* 3) Mouse scrub (spec: Mouse-Controlled Video Scrub)
   ratio = clamp(mouseX / window.innerWidth, 0, 1); targetTime = ratio * duration (only once loadedmetadata gave the
   duration). mousemove ONLY stores the target; one rAF loop eases the displayed time toward it, writes currentTime at
   most once per frame, and stops when settled (restarts on the next move). The video stays paused: play() is never
   called. Touch fallback: horizontal drag on the media maps the touch X the same way. */
function initMouseScrub(fig) {
  const v = fig.querySelector('video');
  const bar = fig.querySelector('.ms-track span');
  if (reduce) { fig.classList.add('rm'); stillOnly(v, fig, v.dataset.poster); return; }
  lazyVideo(v, fig, 'auto');
  let duration = 0, targetTime = 0, shownTime = 0, running = false, inView = false, lastX = null;
  const loop = () => {
    shownTime += (targetTime - shownTime) * 0.2;
    if (Math.abs(targetTime - shownTime) < 0.002) shownTime = targetTime;
    if (!v.seeking) {
      const t = clamp(shownTime, 0, duration - 0.04);
      if (Math.abs(v.currentTime - t) > 1 / 120) v.currentTime = t; // single write per frame
    }
    bar.style.transform = `scaleX(${(shownTime / duration).toFixed(4)})`;
    if (shownTime !== targetTime || v.seeking) requestAnimationFrame(loop); else running = false;
  };
  const setTarget = (clientX) => {
    lastX = clientX;
    if (!duration) return; // wait for loadedmetadata
    targetTime = clamp(clientX / window.innerWidth, 0, 1) * duration;
    if (!running) { running = true; requestAnimationFrame(loop); }
  };
  v.addEventListener('loadedmetadata', () => {
    duration = v.duration;
    shownTime = targetTime = duration / 2; v.currentTime = shownTime;
    bar.style.transform = 'scaleX(0.5)';
    if (lastX != null && inView) setTarget(lastX);
  });
  new IntersectionObserver((es) => { inView = es[0].isIntersecting; }, { threshold: 0.15 }).observe(fig);
  window.addEventListener('mousemove', (e) => { if (inView) { fig.classList.add('touched'); setTarget(e.clientX); } }, { passive: true });
  fig.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') { fig.classList.add('touched'); setTarget(e.clientX); } });
  fig.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') setTarget(e.clientX); });
}

/* 4) Scroll scrub (spec: Scroll-Controlled Video Scrub)
   progress = clamp((scrollY - sectionTop) / (sectionHeight - innerHeight), 0, 1) within the tall sticky section;
   targetTime = progress * duration (after loadedmetadata). Scrolling down seeks forward, up seeks backward.
   The scroll handler ONLY stores the target (cached geometry, no layout reads); one rAF loop eases the displayed
   time, writes currentTime at most once per frame, and stops when settled. Never calls play(). */
function initScrollScrub(sec) {
  const v = sec.querySelector('video');
  const steps = [...sec.querySelectorAll('.step')];
  const bar = sec.querySelector('.scrub-bar span');
  if (reduce) { sec.classList.add('rm'); stillOnly(v, sec, v.dataset.still || v.dataset.poster); return; }
  lazyVideo(v, sec, 'auto');
  v.addEventListener('loadeddata', () => sec.classList.add('ready'));
  let duration = 0, top = 0, span = 1, progress = 0, targetTime = 0, shownTime = 0, running = false;
  const measure = () => {
    const r = sec.getBoundingClientRect();
    top = r.top + window.scrollY; span = Math.max(1, sec.offsetHeight - window.innerHeight);
  };
  const ui = () => {
    bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    let idx = steps.findIndex((s) => progress < parseFloat(s.dataset.until));
    if (idx < 0) idx = steps.length - 1;
    steps.forEach((s, i) => s.classList.toggle('is-on', i === idx));
    sec.classList.toggle('scrolled', progress > 0.03);
  };
  const loop = () => {
    shownTime += (targetTime - shownTime) * 0.16;
    if (Math.abs(targetTime - shownTime) < 0.002) shownTime = targetTime;
    if (duration && !v.seeking) {
      const t = clamp(shownTime, 0, duration - 0.04);
      if (Math.abs(v.currentTime - t) > 1 / 120) v.currentTime = t; // single write per frame
    }
    ui();
    if (shownTime !== targetTime || v.seeking) requestAnimationFrame(loop); else running = false;
  };
  const onScroll = () => {
    progress = clamp((window.scrollY - top) / span, 0, 1);
    if (duration) targetTime = progress * duration;
    if (!running) { running = true; requestAnimationFrame(loop); }
  };
  v.addEventListener('loadedmetadata', () => { duration = v.duration; onScroll(); });
  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); onScroll(); });
  window.addEventListener('load', () => { measure(); onScroll(); });
  if (window.ResizeObserver) new ResizeObserver(() => { measure(); onScroll(); }).observe(document.body);
  onScroll();
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
