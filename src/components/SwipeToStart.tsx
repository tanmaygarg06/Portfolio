"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SwipeToStartProps {
  onUnlock: () => void;
}

export default function SwipeToStart({ onUnlock }: SwipeToStartProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [constraints, setConstraints] = useState(0);

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current) {
        // 56px is the width of the knob, padding is 4px on each side (8px total)
        setConstraints(containerRef.current.offsetWidth - 56 - 8);
      }
    };
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  // Opacity of the "SWIPE TO START" text decreases as you swipe
  const textOpacity = useTransform(x, [0, constraints / 2], [1, 0]);
  
  // Background gradient of the track intensifies as you swipe
  const bgOpacity = useTransform(x, [0, constraints], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (x.get() > constraints * 0.75) {
      // Unlock triggered
      setIsUnlocked(true);
      controls.start({ x: constraints, transition: { duration: 0.2 } });
      setTimeout(() => {
        onUnlock();
      }, 400);
    } else {
      // Snap back
      controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 25 } });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-sm h-16 bg-[#111] rounded-full border border-white/10 flex items-center p-1 overflow-hidden touch-none"
    >
      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0 bg-emerald-500/20 pointer-events-none"
        style={{ opacity: bgOpacity }}
      />
      
      {/* Background Text */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: textOpacity }}
      >
        <span className="font-mono-spaced text-[11px] text-gray-500 tracking-[0.2em] ml-10">
          SWIPE TO INITIALIZE
        </span>
      </motion.div>

      {/* Draggable Knob */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: constraints }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shrink-0"
      >
        {isUnlocked ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 bg-emerald-500 rounded-full"
          />
        ) : (
          <ChevronRight className="w-6 h-6 text-[#0a0a0b]" />
        )}
      </motion.div>
    </div>
  );
}
