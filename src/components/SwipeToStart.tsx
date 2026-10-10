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
      className="relative w-full max-w-sm h-16 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 flex items-center p-1 overflow-hidden touch-none shadow-[0_0_40px_rgba(0,0,0,0.5)]"
    >
      {/* Dynamic Background Glow on swipe */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/60 pointer-events-none"
        style={{ opacity: bgOpacity }}
      />
      
      {/* Continuous scanning laser effect */}
      <motion.div 
        animate={{ x: ["-100%", "300%"] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
      />
      
      {/* Background Text with shimmering effect */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: textOpacity }}
      >
        <span className="font-mono-spaced text-[11px] tracking-[0.25em] ml-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500 animate-pulse">
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
        className="relative w-14 h-14 bg-white text-black rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
      >
        {/* Pulsing ring around knob */}
        {!isUnlocked && (
          <motion.div 
            animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-white pointer-events-none"
          />
        )}
        
        {isUnlocked ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"
          />
        ) : (
          <ChevronRight className="w-6 h-6 text-[#0a0a0b] ml-0.5" />
        )}
      </motion.div>
    </div>
  );
}
