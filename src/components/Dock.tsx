"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Briefcase, Terminal as TerminalIcon, Cpu, Award, FileText, Mail, Monitor } from "lucide-react";

const GithubIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const CodolioIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 4h-4C8.686 4 6 7.582 6 12s2.686 8 6 8h4" />
    <circle cx="16" cy="12" r="2" />
    <line x1="9" y1="12" x2="14" y2="12" />
  </svg>
);

interface DockProps {
  onOpenWindow: (id: string) => void;
  activeWindows: string[];
}

export default function Dock({ onOpenWindow, activeWindows }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  const items = [
    { id: "experience", label: "EXPERIENCE", icon: Briefcase, type: "window" },
    { id: "projects", label: "PROJECTS", icon: Monitor, type: "window" },
    { id: "terminal", label: "TERMINAL", icon: TerminalIcon, type: "window" },
    { id: "techstack", label: "TECH STACK", icon: Cpu, type: "window" },
    { id: "certifications", label: "CERTIFICATIONS", icon: Award, type: "window" },
    { id: "resume", label: "RESUME", icon: FileText, type: "window" },
    { id: "contact", label: "CONTACT", icon: Mail, type: "window" },
    { id: "divider", type: "divider" },
    { id: "github", label: "GITHUB", icon: GithubIcon, type: "link", url: "https://github.com/tanmaygarg06" },
    { id: "linkedin", label: "LINKEDIN", icon: LinkedinIcon, type: "link", url: "https://www.linkedin.com/in/garg-tanmay/" },
    { id: "codolio", label: "CODOLIO", icon: CodolioIcon, type: "link", url: "https://codolio.com/profile/tanmay_garg06" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end h-16 gap-2 px-3 py-2 bg-[#0e0e0f]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl"
      >
        {items.map((item, i) => {
          if (item.type === "divider") {
            return <div key={i} className="w-[1px] h-8 bg-white/10 self-center mx-2" />;
          }
          return (
            <DockIcon
              key={item.id}
              item={item}
              mouseX={mouseX}
              isOpen={activeWindows.includes(item.id as string)}
              onClick={() => {
                if (item.type === "window") onOpenWindow(item.id as string);
                else if (item.type === "link") window.open(item.url, "_blank");
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

function DockIcon({ item, mouseX, isOpen, onClick }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-end h-full">
      {hovered && (
        <div className="absolute -top-12 px-3 py-1.5 bg-[#1a1a1c] border border-white/10 rounded-md text-[10px] text-gray-200 font-mono-spaced whitespace-nowrap z-50">
          {item.label}
        </div>
      )}
      {item.type === 'link' ? (
        <motion.a
          ref={ref as any}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ width, height: width }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative flex items-center justify-center rounded-xl shrink-0 cursor-pointer"
        >
          <item.icon className="w-1/2 h-1/2 text-gray-300" />
        </motion.a>
      ) : (
        <motion.button
          ref={ref as any}
          style={{ width, height: width }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onClick}
          className="relative flex items-center justify-center rounded-xl shrink-0"
        >
          <item.icon className="w-1/2 h-1/2 text-gray-300" />
        </motion.button>
      )}
      {/* Indicator for open window */}
      <div className={`mt-1.5 w-1 h-1 rounded-full bg-white/80 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
    </div>
  );
}
