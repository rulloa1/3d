import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export default function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const words = text.split("");

  return (
    <p ref={containerRef} className={`flex flex-wrap justify-center ${className}`}>
      {words.map((char, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

        return (
          <span key={i} className="relative inline-block">
            <span className="opacity-0">{char === " " ? "\u00A0" : char}</span>
            <motion.span
              style={{ opacity }}
              className="absolute left-0 top-0"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        );
      })}
    </p>
  );
}
