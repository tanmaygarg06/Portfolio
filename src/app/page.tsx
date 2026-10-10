"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence, useDragControls, useAnimation } from "framer-motion";
import { ArrowUpRight, Award, Send, Server, Activity, Database, BarChart2 } from "lucide-react";
import { ActivityCalendar } from 'react-activity-calendar';
import KineticGrid from "@/components/ui/kinetic-grid";
import Dock from "@/components/Dock";
import Window from "@/components/Window";
import Terminal from "@/components/Terminal";
import SwipeToStart from "@/components/SwipeToStart";
import { content } from "@/data/content";

export default function Home() {

  const portraitDrag = useDragControls();
  const statusDrag = useDragControls();
  const quoteDrag = useDragControls();
  const leadershipDrag = useDragControls();
  const leetcodeDrag = useDragControls();
  const serverDrag = useDragControls();
  const resetControls = useAnimation();
  
  const handleReset = () => {
    resetControls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } });
  };

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
  const [cpuUsage, setCpuUsage] = useState(34);
  const [memoryUsage, setMemoryUsage] = useState(2.1);
  const [networkLatency, setNetworkLatency] = useState(45);

  useEffect(() => {
    fetch('/api/leetcode')
      .then(res => res.json())
      .then(data => {
         if (data.calendar) setLeetcodeData(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 15);
      setMemoryUsage(+(Math.random() * 0.8 + 1.5).toFixed(1));
      setNetworkLatency(Math.floor(Math.random() * 40) + 20);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
    <main className="min-h-screen xl:h-screen w-screen overflow-x-hidden overflow-y-auto xl:overflow-hidden relative selection:bg-[#10b981]/30 pb-32 xl:pb-0 bg-[#0a0a0b]">
      <KineticGrid globalColor="default">
      
      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[999] bg-[#0a0a0b] flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="z-10 flex flex-col items-center w-full max-w-md px-8 relative">
              <motion.h1
                initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="title-serif text-5xl md:text-6xl text-white mb-12 tracking-wide text-center relative z-10"
              >
                {content.hero.fullName}
              </motion.h1>

              <div className="w-full relative z-10 flex flex-col items-center mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="w-full flex justify-center"
                >
                  <SwipeToStart onUnlock={() => setIsLoading(false)} />
                </motion.div>
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



      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:block px-6 md:px-8 xl:px-0 pt-24 pb-36 xl:p-0 gap-4 md:gap-6 xl:gap-0 w-full relative min-h-screen xl:h-screen max-w-[1600px] xl:max-w-none mx-auto">
        {/* Hero Section */}
        <div className="relative xl:absolute xl:top-20 xl:left-8 xl:left-16 max-w-lg md:max-w-none xl:max-w-lg z-20 pointer-events-none mx-auto xl:mx-0 w-full mb-8 md:mb-0 xl:mb-0 md:col-span-2 lg:col-span-2 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-3 mb-8 pointer-events-auto mt-2 xl:mt-0">
            <div className="flex flex-col">
              <h1 className="title-serif text-5xl md:text-[90px] text-white leading-none mb-2 md:mb-4">{content.hero.fullName}</h1>
              <div className="font-mono-spaced text-[10px] text-gray-400 tracking-[0.2em] flex flex-col gap-1.5">
                <span>{content.hero.subtitle}</span>
                <span className="text-[#10b981]">BUILDING SERVERLESS ARCHITECTURE</span>
              </div>
            </div>
            
            {/* Inline Portrait */}
            <div className="xl:hidden w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-white/20 overflow-hidden shrink-0 shadow-xl bg-[#111]/80 flex items-center justify-center mt-1">
              <img src="/portrait.png" alt="Portrait" className="w-full h-full object-cover pointer-events-none" style={{ imageRendering: 'high-quality' as any }} />
            </div>
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

        {/* Desktop Portrait Widget */}
        <motion.div drag dragControls={portraitDrag} dragListener={!isMobile} dragMomentum={false} animate={resetControls} className="hidden xl:flex absolute xl:top-24 xl:left-1/2 xl:-translate-x-1/2 w-64 h-64 border border-white/10 rounded-2xl bg-[#111]/80 backdrop-blur-md overflow-hidden z-20 flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none pointer-events-auto shadow-2xl">
          <div onPointerDown={(e) => portraitDrag.start(e)} className="absolute top-0 left-0 w-full h-8 flex items-center justify-center z-10 touch-none cursor-grab active:cursor-grabbing"><div className="w-8 h-1 bg-white/20 rounded-full" /></div>
          <img src="/portrait.png" alt="Portrait" className="w-full h-full object-cover pointer-events-none" style={{ imageRendering: 'high-quality' as any }} />
        </motion.div>

        {/* Status & Quote Column Wrapper (Stacked in Grid, Independent in OS) */}
        <div className="md:col-span-2 lg:col-span-1 flex flex-col gap-4 md:gap-6 xl:contents">
          {/* Status Widget */}
          <motion.div drag dragControls={statusDrag} dragListener={!isMobile} dragMomentum={false} animate={resetControls} className="relative xl:absolute xl:top-20 xl:right-20 w-full xl:w-72 md:h-full xl:h-auto md:min-h-[120px] xl:min-h-0 bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 z-20 cursor-grab active:cursor-grabbing shadow-2xl mb-6 md:mb-0 xl:mb-0 mx-auto flex flex-col justify-center">
            <div onPointerDown={(e) => statusDrag.start(e)} className="w-full py-2 -mt-2 mb-2 flex justify-center touch-none cursor-grab active:cursor-grabbing"><div className="w-8 h-1 bg-white/20 rounded-full" /></div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-mono-spaced text-[10px] text-gray-500">{content.widgets.status.label}</span>
            </div>
            <div className="text-sm text-gray-300">{content.widgets.status.text}</div>
          </motion.div>

          {/* Quote Widget */}
          <motion.div drag dragControls={quoteDrag} dragListener={!isMobile} dragMomentum={false} animate={resetControls} className="relative xl:absolute xl:top-52 xl:right-16 w-full xl:w-80 md:h-full xl:h-auto md:min-h-[180px] xl:min-h-0 bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 z-20 cursor-grab active:cursor-grabbing shadow-2xl mb-6 md:mb-0 xl:mb-0 mx-auto">
            <div onPointerDown={(e) => quoteDrag.start(e)} className="w-full py-2 -mt-2 mb-4 flex justify-center touch-none cursor-grab active:cursor-grabbing"><div className="w-8 h-1 bg-white/20 rounded-full" /></div>
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
        </div>

        {/* Leadership Widget */}
        <motion.div drag dragControls={leadershipDrag} dragListener={!isMobile} dragMomentum={false} animate={resetControls} className="relative xl:absolute xl:bottom-20 xl:left-8 xl:left-12 w-full xl:w-[380px] md:h-full xl:h-auto md:min-h-[200px] xl:min-h-0 bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 z-20 cursor-grab active:cursor-grabbing shadow-2xl mb-6 md:mb-0 xl:mb-0 mx-auto flex flex-col md:col-span-2 lg:col-span-1">
            <div onPointerDown={(e) => leadershipDrag.start(e)} className="w-full py-2 -mt-2 mb-2 flex justify-center touch-none cursor-grab active:cursor-grabbing"><div className="w-8 h-1 bg-white/20 rounded-full" /></div>
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
        <motion.div drag dragControls={leetcodeDrag} dragListener={!isMobile} dragMomentum={false} animate={resetControls} className="relative xl:absolute xl:bottom-24 xl:right-8 xl:right-12 w-full xl:w-[480px] md:h-full xl:h-auto md:min-h-[200px] xl:min-h-0 bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 z-20 cursor-grab active:cursor-grabbing mb-6 md:mb-0 xl:mb-0 mx-auto overflow-x-auto overflow-y-hidden hide-scrollbar flex flex-col md:col-span-2 lg:col-span-2">
            <div onPointerDown={(e) => leetcodeDrag.start(e)} className="w-full py-2 -mt-2 mb-2 flex justify-center touch-none cursor-grab active:cursor-grabbing"><div className="w-8 h-1 bg-white/20 rounded-full" /></div>
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
        <motion.div drag dragControls={serverDrag} dragListener={!isMobile} dragMomentum={false} animate={resetControls} className="relative xl:absolute xl:bottom-32 xl:left-1/2 xl:-translate-x-1/2 w-full xl:w-[400px] h-auto bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 z-20 cursor-grab active:cursor-grabbing shadow-2xl mx-auto mb-16 md:mb-0 xl:mb-0 flex flex-col md:col-span-2 lg:col-span-1">
          <div onPointerDown={(e) => serverDrag.start(e)} className="absolute top-0 left-0 w-full h-8 flex items-center justify-center z-10 touch-none cursor-grab active:cursor-grabbing"><div className="w-10 h-1.5 bg-white/20 rounded-full" /></div>
          
          <div className="font-mono-spaced text-[11px] text-gray-400 tracking-widest flex items-center justify-between mb-5 mt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
              AWS CLOUDWATCH | AP-SOUTH-1
            </div>
            <Server className="w-4 h-4 text-gray-500" />
          </div>
          
          <div className="flex flex-col gap-5 w-full">
            {/* CPU */}
            <div className="flex items-center gap-4 w-full">
              <Activity className="w-5 h-5 text-[#10b981] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-[11px] font-mono-spaced mb-2">
                  <span className="text-gray-400 truncate">CPU UTILIZATION</span>
                  <span className="text-[#10b981] flex-shrink-0 ml-2">{cpuUsage}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ width: `${cpuUsage}%` }} 
                     transition={{ duration: 1, ease: "easeInOut" }} 
                     className="h-full bg-[#10b981] rounded-full" 
                   />
                </div>
              </div>
            </div>

            {/* RAM */}
            <div className="flex items-center gap-4 w-full">
              <Database className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-[11px] font-mono-spaced mb-2">
                  <span className="text-gray-400 truncate">MEMORY USAGE</span>
                  <span className="text-purple-400 flex-shrink-0 ml-2">{memoryUsage} GB / 4.0 GB</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ width: `${(Number(memoryUsage)/4)*100}%` }} 
                     transition={{ duration: 1, ease: "easeInOut" }} 
                     className="h-full bg-purple-400 rounded-full" 
                   />
                </div>
              </div>
            </div>

            {/* NET */}
            <div className="flex items-center gap-4 w-full">
              <BarChart2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-[11px] font-mono-spaced mb-2">
                  <span className="text-gray-400 truncate">NETWORK I/O</span>
                  <span className="text-blue-400 flex-shrink-0 ml-2">{networkLatency} ms</span>
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
      {!isLoading && (
        <Dock onOpenWindow={openWindow} activeWindows={activeWindows.map(w => w.id)} />
      )}

      {/* Command Palette Placeholder (Bottom Right) */}
      {!isLoading && (
        <div className="fixed bottom-6 right-6 z-40 hidden md:block">
          <button onClick={handleReset} className="px-4 py-2 bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-full font-mono-spaced text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            RESET LAYOUT
          </button>
        </div>
      )}

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
      
    </KineticGrid>
    </main>
  );
}
