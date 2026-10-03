import { useEffect, useRef, useState, type ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}

/**
 * Subtle "magnetic" follow effect. Only enabled for fine pointers (mouse/trackpad)
 * and when the user has not requested reduced motion. Updates are rAF-throttled.
 */
export default function Magnet({ children, padding = 150, strength = 3, className = '' }: MagnetProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduced) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const inRange = Math.hypot(dx, dy) < Math.max(r.width, r.height) / 2 + padding;
        setActive(inRange);
        setPos(inRange ? { x: dx / strength, y: dy / strength } : { x: 0, y: 0 });
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
    };
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: active ? 'transform 0.3s ease-out' : 'transform 0.6s ease-in-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
