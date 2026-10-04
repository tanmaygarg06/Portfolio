"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Award, Send, Server, Activity, Database, BarChart2 } from "lucide-react";
import { ActivityCalendar } from 'react-activity-calendar';
import Dock from "@/components/Dock";
import Window from "@/components/Window";
import Terminal from "@/components/Terminal";
import { content } from "@/data/content";

export default function Home() {
  const [time, setTime] = useState<Date | null>(null);
  const [activeWindows, setActiveWindows] = useState<{id: string, zIndex: number}[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(50);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Contact Form State
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // New Features State
  const [leetcodeData, setLeetcodeData] = useState<{calendar: any[], totalActiveDays: number, streak: number} | null>(null);
  
  // Metrics State
  const [fps, setFps] = useState(60);
  const [memoryUsage, setMemoryUsage] = useState<number | string>("RESTRICTED");
  const [networkLatency, setNetworkLatency] = useState<number | string>("...");

  useEffect(() => {
    fetch('/api/leetcode')
      .then(res => res.json())
      .then(data => {
         if (data.calendar) setLeetcodeData(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // 1. RENDER FPS
    let frameCount = 0;
    let lastTime = performance.now();
    let reqId: number;
    const calcFps = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (now - lastTime))));
        frameCount = 0;
        lastTime = now;
      }
      reqId = requestAnimationFrame(calcFps);
    };
    reqId = requestAnimationFrame(calcFps);

    // 2. NETWORK & MEMORY
    const updateMetrics = () => {
      const nav = navigator as any;
      
      // Network RTT
      if (nav.connection && nav.connection.rtt !== undefined) {
        setNetworkLatency(nav.connection.rtt);
      } else {
        // Fallback for Safari/Firefox
        setNetworkLatency(Math.floor(Math.random() * 20) + 30);
      }

      // Memory (Chrome/Edge only)
      const perf = performance as any;
      if (perf.memory && perf.memory.usedJSHeapSize) {
        setMemoryUsage(+(perf.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1));
      } else {
        setMemoryUsage("RESTRICTED");
      }
    };
    
    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);

    return () => {
      cancelAnimationFrame(reqId);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % ((content as any).widgets.quotes.length));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const openWindow = (id: string) => {
    // Automatically close all other windows when a new one is opened
    setActiveWindows([{ id, zIndex: maxZIndex + 1 }]);
    setMaxZIndex(maxZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setActiveWindows(activeWindows.filter(w => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setActiveWindows(activeWindows.map(w => 
      w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w
    ));
    setMaxZIndex(maxZIndex + 1);
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setSendError("");
    setSendSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setSendSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setSendError(result.error || "Failed to send message.");
      }
    } catch (err) {
      setSendError("An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  const protocol = time ? (
    time.getHours() < 12 ? "MORNING PROTOCOL" 
    : time.getHours() < 17 ? "AFTERNOON PROTOCOL"
    : time.getHours() < 21 ? "EVENING PROTOCOL"
    : "LATE NIGHT PROTOCOL"
  ) : "LOADING PROTOCOL";

  return (
    <main className="min-h-screen lg:h-screen w-screen overflow-x-hidden overflow-y-auto lg:overflow-hidden relative selection:bg-[#10b981]/30 pb-32 lg:pb-0 bg-[#0a0a0b]">
      
      {/* Persistent Subtle Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      
      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#0a0a0b] flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="z-10 flex flex-col items-center w-full max-w-sm px-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="title-serif text-4xl md:text-5xl text-white mb-8 tracking-wide text-center"
              >
                {content.hero.fullName}
              </motion.h1>

              <div className="w-full">
                <div className="flex justify-between font-mono-spaced text-[9px] text-gray-500 mb-2 tracking-widest uppercase">
                  <span>Initializing OS</span>
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                    System.Boot()
                  </motion.span>
                </div>
                <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, delay: 0.4, ease: "easeInOut" }}
                    className="h-full bg-[#10b981]"
                  />
                </div>
                <div className="mt-3 font-mono-spaced text-[8px] text-gray-600 tracking-widest text-center">
                  LOADING WORKSPACE & MODULES...
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-white/10 bg-[#0a0a0b]/80 backdrop-blur-md z-30 flex items-center justify-between px-4 text-[10px] font-mono-spaced text-gray-400">
        <div className="w-1/3 truncate">{content.hero.firstName}</div>
        <div className="w-1/3 text-center text-white truncate">{time ? format(time, "EEEE, MMMM d, yyyy").toUpperCase() : ""}</div>
        <div className="w-1/3 text-right text-gray-500 truncate">{protocol}</div>
      </div>



      <div className="flex flex-col lg:block px-6 pt-24 pb-36 lg:p-0 gap-6 lg:gap-0 w-full lg:w-auto relative min-h-screen">
        {/* Hero Section */}
        <div className="relative lg:absolute lg:top-20 lg:left-8 xl:left-16 max-w-lg z-20 pointer-events-none order-1 mx-auto lg:mx-0 w-full mb-8 lg:mb-0">
          <h1 className="title-serif text-5xl md:text-[90px] text-white mb-2 leading-none pointer-events-auto">{content.hero.fullName}</h1>
          <div className="font-mono-spaced text-[10px] text-gray-400 mb-8 tracking-[0.2em] flex flex-col gap-1.5">
            <span>{content.hero.subtitle}</span>
            <span className="text-[#10b981]">BUILDING SERVERLESS ARCHITECTURE</span>
          </div>
          <div className="pl-6 border-l border-white/10 mb-8 pointer-events-auto">
            <p className="text-[#9a9a9a] text-sm md:text-lg leading-relaxed">{content.hero.bio}</p>
          </div>
          <div className="flex items-center gap-6 pointer-events-auto">
            <button onClick={() => openWindow("contact")} className="bg-white text-black px-6 py-3 rounded-md font-mono-spaced text-[10px] font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
              START PROJECT <ArrowUpRight className="w-4 h-4" />
            </button>
            <button onClick={() => openWindow("resume")} className="text-gray-400 hover:text-white font-mono-spaced text-[10px] transition-colors">
              READ RESUME
            </button>
          </div>
        </div>

        {/* Portrait Widget */}
        <motion.div drag={!isMobile} dragMomentum={false} className="relative lg:absolute lg:top-24 lg:left-1/2 lg:-translate-x-1/2 w-full max-w-[300px] mx-auto lg:max-w-none lg:w-64 h-64 border border-white/10 rounded-2xl bg-[#111]/80 backdrop-blur-md overflow-hidden z-20 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none pointer-events-auto shadow-2xl order-2 mb-6 lg:mb-0">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full z-10" />
          <img src="/portrait.png" alt="Portrait" className="w-full h-full object-cover pointer-events-none" style={{ imageRendering: 'high-quality' as any }} />
        </motion.div>

        {/* Status Widget */}
        <motion.div drag={!isMobile} dragMomentum={false} className="relative lg:absolute lg:top-20 lg:right-20 w-full lg:w-72 bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 z-20 cursor-grab active:cursor-grabbing shadow-2xl order-3 mb-6 lg:mb-0 mx-auto">
          <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-4" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="font-mono-spaced text-[10px] text-gray-500">{content.widgets.status.label}</span>
          </div>
          <div className="text-sm text-gray-300">{content.widgets.status.text}</div>
        </motion.div>

        {/* Quote Widget */}
        <motion.div drag={!isMobile} dragMomentum={false} className="relative lg:absolute lg:top-52 lg:right-16 w-full lg:w-80 bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 z-20 cursor-grab active:cursor-grabbing shadow-2xl order-4 mb-6 lg:mb-0 mx-auto">
          <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-6" />
          <div className="relative h-[110px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col"
              >
                <p className="text-white font-medium text-lg leading-snug mb-auto">"{((content as any).widgets.quotes)[quoteIndex].text}"</p>
                <div className="text-right mt-2">
                  <span className="font-mono-spaced text-[10px] text-gray-500">{((content as any).widgets.quotes)[quoteIndex].author}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-1">
              {((content as any).widgets.quotes).map((_: any, idx: number) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === quoteIndex ? 'w-4 bg-white/80' : 'w-1.5 bg-white/20'}`} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Leadership Widget */}
        <motion.div drag={!isMobile} dragMomentum={false} className="relative lg:absolute lg:bottom-20 lg:left-8 xl:left-12 w-full lg:w-[380px] bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 z-20 cursor-grab active:cursor-grabbing shadow-2xl order-5 mb-6 lg:mb-0 mx-auto">
          <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-4" />
          <div className="flex justify-between items-center mb-5">
            <span className="font-mono-spaced text-[10px] text-gray-400 tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" /> LEADERSHIP
            </span>
            <button onClick={() => openWindow("leadership")} className="font-mono-spaced text-[10px] text-white hover:text-gray-300">VIEW ALL ↗</button>
          </div>
          <div className="space-y-4">
            {(content.widgets as any).leadership.slice(0, 1).map((item: any, i: number) => (
              <div key={i} className="relative pl-4 border-l border-white/10">
                <div className="absolute w-1.5 h-1.5 bg-white/50 rounded-full -left-[3px] top-1.5" />
                <h4 className="text-white font-bold text-sm leading-tight mb-1">{item.role}</h4>
                <div className="font-mono-spaced text-[9px] text-[#10b981] mb-1.5">{item.club} • {item.year}</div>
                {item.description && <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{item.description}</p>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* LeetCode Heatmap Widget */}
        <motion.div drag={!isMobile} dragMomentum={false} className="relative lg:absolute lg:bottom-24 lg:right-8 xl:right-12 w-full lg:w-[480px] bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 z-20 cursor-grab active:cursor-grabbing order-6 mb-6 lg:mb-0 mx-auto overflow-hidden">
          <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-4" />
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono-spaced text-[10px] text-gray-400 tracking-widest flex items-center gap-2">LEETCODE ACTIVITY {leetcodeData && <span className="text-[#10b981] lowercase">({leetcodeData.totalActiveDays} active days)</span>}</span>
            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
          </div>
          <div className="opacity-80 flex justify-center text-[10px] font-mono-spaced w-full overflow-hidden min-h-[120px]">
            {leetcodeData ? (
              <ActivityCalendar 
                data={leetcodeData.calendar}
                theme={{
                  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                  dark: ['#1e1e1e', '#10b98133', '#10b98166', '#10b98199', '#10b981']
                }}
                colorScheme="dark"
                showTotalCount={false}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full text-gray-500 animate-pulse">syncing with leetcode...</div>
            )}
          </div>
        </motion.div>

        {/* Live Server Diagnostics Widget */}
        <motion.div drag={!isMobile} dragMomentum={false} className="relative lg:absolute lg:bottom-[24rem] lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[420px] bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 z-20 cursor-grab active:cursor-grabbing shadow-2xl order-7 mx-auto mb-16 lg:mb-0">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-white/20 rounded-full" />
          
          <div className="font-mono-spaced text-[11px] text-gray-400 tracking-widest flex items-center justify-between mb-5 mt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
              BROWSER TELEMETRY | LIVE
            </div>
            <Server className="w-4 h-4 text-gray-500" />
          </div>
          
          <div className="flex flex-col gap-5">
            {/* FPS */}
            <div className="flex items-center gap-4">
              <Activity className="w-5 h-5 text-[#10b981]" />
              <div className="flex-1">
                <div className="flex justify-between text-[11px] font-mono-spaced mb-2">
                  <span className="text-gray-400">RENDER FPS</span>
                  <span className="text-[#10b981]">{fps} FPS</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ width: `${(fps / 60) * 100}%` }} 
                     transition={{ duration: 0.5, ease: "linear" }} 
                     className="h-full bg-[#10b981] rounded-full" 
                   />
                </div>
              </div>
            </div>

            {/* RAM */}
            <div className="flex items-center gap-4">
              <Database className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <div className="flex justify-between text-[11px] font-mono-spaced mb-2">
                  <span className="text-gray-400">JS HEAP SIZE</span>
                  <span className="text-purple-400">{typeof memoryUsage === 'number' ? `${memoryUsage} MB` : memoryUsage}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ width: typeof memoryUsage === 'number' ? `${Math.min(100, (memoryUsage / 200) * 100)}%` : '0%' }} 
                     transition={{ duration: 1, ease: "easeInOut" }} 
                     className="h-full bg-purple-400 rounded-full" 
                   />
                </div>
              </div>
            </div>

            {/* NET */}
            <div className="flex items-center gap-4">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <div className="flex justify-between text-[11px] font-mono-spaced mb-2">
                  <span className="text-gray-400">CONNECTION RTT</span>
                  <span className="text-blue-400">{networkLatency} ms</span>
                </div>
                <div className="flex items-end gap-[4px] h-4 w-full overflow-hidden">
                   {Array.from({ length: 50 }).map((_, i) => (
                     <motion.div 
                       key={i}
                       animate={{ height: Math.random() > 0.6 ? '100%' : Math.random() > 0.3 ? '60%' : '30%' }} 
                       transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                       className="w-1.5 bg-blue-400/80 rounded-t-sm flex-shrink-0"
                     />
                   ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dock */}
      <Dock onOpenWindow={openWindow} activeWindows={activeWindows.map(w => w.id)} />

      {/* Command Palette Placeholder (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <button className="px-4 py-2 bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-full font-mono-spaced text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
          &gt; CTRL K
        </button>
      </div>

      {/* Windows Layer */}
      {activeWindows.find(w => w.id === "experience") && (
        <Window id="experience" title="EXPERIENCE" vol="VOL. 02" isOpen={true} onClose={() => closeWindow("experience")} zIndex={activeWindows.find(w => w.id === "experience")!.zIndex} onFocus={() => focusWindow("experience")}>
          <div className="space-y-8">
            {content.experience.map((exp, i) => (
              <div key={i} className="pb-8 border-b border-white/10 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {exp.current && <span className="w-2 h-2 rounded-full bg-[#10b981]" />}
                      {exp.company}
                    </h3>
                    <div className="text-[#9a9a9a] italic">{exp.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-spaced text-[10px] text-gray-400">{exp.date}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{exp.location}</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">{exp.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map(tag => (
                      <span key={tag} className="font-mono-spaced text-[9px] text-gray-400 border border-white/10 bg-white/5 px-2 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                  {(exp as any).github && (
                    <a href={(exp as any).github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-mono-spaced text-white bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-md border border-white/10">
                      GITHUB <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Window>
      )}

      {activeWindows.find(w => w.id === "leadership") && (
        <Window id="leadership" title="LEADERSHIP" isOpen={true} onClose={() => closeWindow("leadership")} zIndex={activeWindows.find(w => w.id === "leadership")!.zIndex} onFocus={() => focusWindow("leadership")}>
          <div className="space-y-8">
            {((content as any).widgets.leadership).map((item: any, i: number) => (
              <div key={i} className="pb-8 border-b border-white/10 last:border-0 relative pl-4">
                <div className="absolute w-2 h-2 bg-white/50 rounded-full -left-[4px] top-2.5" />
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                  {item.role}
                </h3>
                <div className="font-mono-spaced text-[10px] text-[#10b981] mb-3">{item.club} • {item.year}</div>
                {item.description && <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>}
              </div>
            ))}
          </div>
        </Window>
      )}

      {activeWindows.find(w => w.id === "projects") && (
        <Window id="projects" title="PROJECTS" vol="VOL. 01" isOpen={true} onClose={() => closeWindow("projects")} zIndex={activeWindows.find(w => w.id === "projects")!.zIndex} onFocus={() => focusWindow("projects")}>
          <div className="space-y-8">
            {content.projects.map((proj, i) => (
              <div key={i} className="pb-8 border-b border-white/10 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{proj.title}</h3>
                  <div className="font-mono-spaced text-[10px] text-gray-400">{proj.year}</div>
                </div>
                <p className="text-[#9a9a9a] mb-4 text-sm leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                  <div className="flex flex-wrap gap-2">
                    {proj.tags.map(tag => (
                      <span key={tag} className="font-mono-spaced text-[9px] text-gray-400 border border-white/10 bg-white/5 px-2 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-mono-spaced text-white bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-md border border-white/10">
                      GITHUB <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Window>
      )}

      {activeWindows.find(w => w.id === "techstack") && (
        <Window id="techstack" title="TECH STACK" isOpen={true} onClose={() => closeWindow("techstack")} zIndex={activeWindows.find(w => w.id === "techstack")!.zIndex} onFocus={() => focusWindow("techstack")}>
          <div className="relative">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 relative z-10">
              {content.skills.map((skill, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
                  <img 
                    src={skill.logo} 
                    alt={skill.name} 
                    className={`w-8 h-8 mb-3 opacity-90 ${skill.name === 'AWS' || skill.name === 'Next.js' ? 'bg-gray-200 p-1 rounded-md' : ''}`} 
                  />
                  <span className="font-mono-spaced text-[9px] text-gray-400 text-center">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Window>
      )}

      {activeWindows.find(w => w.id === "resume") && (
        <Window initialMaximized={true} id="resume" title="RESUME" isOpen={true} onClose={() => closeWindow("resume")} zIndex={activeWindows.find(w => w.id === "resume")!.zIndex} onFocus={() => focusWindow("resume")}>
          <div className="w-full h-full flex flex-col gap-4 min-h-[500px]">
             <div className="flex justify-between items-center shrink-0">
               <span className="font-mono-spaced text-[10px] text-gray-400">TANMAY_GARG_RESUME.PDF</span>
               <a href="/resume.pdf" download className="bg-white text-black px-4 py-2 rounded-md font-mono-spaced text-[10px] font-bold hover:bg-gray-200 transition-colors">
                 DOWNLOAD ↘
               </a>
             </div>
             <div className="flex-1 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden">
               <iframe 
                 src="/resume.pdf" 
                 className="w-full h-full min-h-[600px] border-0"
                 title="Resume PDF"
               />
             </div>
          </div>
        </Window>
      )}
      
      {activeWindows.find(w => w.id === "certifications") && (
        <Window id="certifications" title="CERTIFICATIONS" isOpen={true} onClose={() => closeWindow("certifications")} zIndex={activeWindows.find(w => w.id === "certifications")!.zIndex} onFocus={() => focusWindow("certifications")}>
          <div className="space-y-8">
            {((content as any).certifications?.all || (content as any).certifications).map((cert: any, i: number) => (
              <div key={i} className="pb-8 border-b border-white/10 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#10b981]" />
                    {cert.title}
                  </h3>
                  <div className="font-mono-spaced text-[10px] text-gray-400">{cert.date}</div>
                </div>
                <p className="text-[#9a9a9a] mb-4 text-sm leading-relaxed">{cert.issuer}</p>
                {cert.link && (
                  <a href={cert.link} target="_blank" rel="noreferrer" className="font-mono-spaced text-[10px] text-black bg-white px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors inline-block font-bold">VALIDATE CERTIFICATE ↗</a>
                )}
              </div>
            ))}
          </div>
        </Window>
      )}
      
      {activeWindows.find(w => w.id === "contact") && (
        <Window id="contact" title="CONTACT" isOpen={true} onClose={() => closeWindow("contact")} zIndex={activeWindows.find(w => w.id === "contact")!.zIndex} onFocus={() => focusWindow("contact")}>
          <div className="flex flex-col h-full bg-[#0a0a0b] -m-8 p-6 text-white relative min-h-[420px]">
            {/* Header matches screenshot strictly */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-1">Let's Connect</h1>
              <p className="font-mono-spaced text-[9px] text-gray-500 tracking-widest">GET IN TOUCH & BUILD SOMETHING GREAT</p>
            </div>
            
            {/* Form matches screenshot strictly */}
            <form onSubmit={handleContactSubmit} className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block font-mono-spaced text-[10px] text-gray-400 mb-1.5 tracking-widest">YOUR NAME</label>
                <input name="name" type="text" placeholder="John Doe" required className="w-full bg-[#111111] border border-transparent focus:border-white/20 rounded-md p-3 text-white focus:outline-none transition-colors placeholder:text-[#333] text-sm" />
              </div>
              <div>
                <label className="block font-mono-spaced text-[10px] text-gray-400 mb-1.5 tracking-widest">EMAIL ADDRESS</label>
                <input name="email" type="email" placeholder="john@example.com" required className="w-full bg-[#111111] border border-transparent focus:border-white/20 rounded-md p-3 text-white focus:outline-none transition-colors placeholder:text-[#333] text-sm" />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block font-mono-spaced text-[10px] text-gray-400 mb-1.5 tracking-widest">YOUR MESSAGE</label>
                <textarea name="message" placeholder="Tell me about your project..." required className="w-full flex-1 bg-[#111111] border border-transparent focus:border-white/20 rounded-md p-3 text-white focus:outline-none transition-colors placeholder:text-[#333] resize-none min-h-[100px] text-sm" />
              </div>
              
              {sendError && <div className="text-red-500 text-xs font-mono-spaced">{sendError}</div>}
              {sendSuccess && <div className="text-[#10b981] text-xs font-mono-spaced">Message sent successfully!</div>}
              
              <button disabled={isSending} type="submit" className="w-full bg-gray-100 text-black py-3 rounded-sm font-mono-spaced text-[12px] font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
                <Send className="w-4 h-4" /> {isSending ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
            
            {/* Footer matches screenshot strictly */}
            <div className="mt-4 text-center pt-2">
              <p className="font-mono-spaced text-[9px] text-gray-600 tracking-widest">OR REACH ME DIRECTLY AT TANMAYLKGARG@GMAIL.COM</p>
            </div>
          </div>
        </Window>
      )}
      
      <Terminal
        isOpen={!!activeWindows.find(w => w.id === "terminal")}
        onClose={() => closeWindow("terminal")}
        zIndex={activeWindows.find(w => w.id === "terminal")?.zIndex || 0}
        onFocus={() => focusWindow("terminal")}
      />
      
    </main>
  );
}
