'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function DynamicBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);

  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Convert mouse position to percentage
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        style={{
          x: springX.get() * 100,
          y: springY.get() * 100,
        }}
        className="absolute inset-0"
      >
        {/* Primary Glow */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
            left: `calc(${springX.get() * 100}% - 250px)`,
            top: `calc(${springY.get() * 100}% - 250px)`,
          }}
        />

        {/* Secondary Glows */}
        <div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
            left: `calc(${springX.get() * 100}% - 150px)`,
            top: `calc(${springY.get() * 100}% - 150px)`,
          }}
        />

        <div
          className="absolute w-[200px] h-[200px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
            left: `calc(${springX.get() * 100}% - 100px)`,
            top: `calc(${springY.get() * 100}% - 100px)`,
          }}
        />
      </motion.div>

      {/* Static Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-indigo-900/10" />
      <div className="absolute inset-0 backdrop-blur-[100px]" />
    </div>
  );
}
