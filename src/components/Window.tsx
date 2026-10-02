"use client";
import { motion } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";
import { useState } from "react";

interface WindowProps {
  id: string;
  title: string;
  vol?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex: number;
  onFocus: () => void;
  initialMaximized?: boolean;
}

export default function Window({ id, title, vol, isOpen, onClose, children, zIndex, onFocus, initialMaximized = false }: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(initialMaximized);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: isMaximized ? "100vw" : "800px",
        height: isMaximized ? "100vh" : "600px",
        x: isMaximized ? 0 : "max(0px, calc(50vw - 400px))",
        y: isMaximized ? 0 : "max(0px, calc(50vh - 300px))",
        position: "fixed",
        top: 0,
        left: 0
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      drag={!isMaximized}
      dragHandle=".title-bar"
      dragMomentum={false}
      onClick={onFocus}
      style={{ zIndex }}
      className={`flex flex-col bg-[#0e0e0f]/90 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden ${
        isMaximized ? "rounded-none" : "rounded-2xl"
      }`}
    >
      {/* Title Bar */}
      <div className="title-bar h-12 flex items-center justify-between px-4 border-b border-white/5 cursor-grab active:cursor-grabbing bg-white/5 shrink-0">
        <div className="flex space-x-2 w-20">
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] flex items-center justify-center hover:bg-[#ff5f56]/80 transition-colors shadow-sm">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7M7 1L1 7" stroke="#4a0400" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }} className="w-3.5 h-3.5 rounded-full bg-[#27c93f] flex items-center justify-center hover:bg-[#27c93f]/80 transition-colors shadow-sm">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 1H7V2.5M7 1L4.5 3.5M2.5 7H1V5.5M1 7L3.5 4.5" stroke="#004a00" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="font-mono-spaced text-[10px] text-gray-400 select-none">{title}</div>
        <div className="w-20"></div>
      </div>

      {/* Header Row */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-wide">{title}</h2>
        {vol && <div className="font-mono-spaced text-[10px] text-gray-500">{vol}</div>}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto window-scroll p-8 text-gray-300 bg-gradient-to-b from-transparent to-black/20">
        {children}
      </div>
    </motion.div>
  );
}
