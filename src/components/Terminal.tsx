"use client";
import { useState, useRef, useEffect } from "react";
import Window from "./Window";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

export default function Terminal({ isOpen, onClose, zIndex, onFocus }: TerminalProps) {
  const [history, setHistory] = useState<{ type: 'input' | 'output', text: string }[]>([
    { type: 'output', text: 'Welcome to the TanmayOS Interactive Terminal!' },
    { type: 'output', text: 'I built this feature so you can explore my backend/cloud engineering skills in a native command-line environment.' },
    { type: 'output', text: 'Type "help" to get started.' }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newHistory = [...history, { type: 'input', text: `visitor@tanmay-os:~$ ${input}` } as const];
      
      let output = "";
      switch (cmd) {
        case 'help':
          output = "Available commands: whoami, skills, clear, sudo hire tanmay";
          break;
        case 'whoami':
          output = "Tanmay Garg - Software Engineer & Cloud Builder. Passionate about scalable backend systems and robust cloud solutions.";
          break;
        case 'skills':
          output = "AWS, Python, Java, JavaScript, Next.js, Docker, Kubernetes, DynamoDB";
          break;
        case 'sudo hire tanmay':
          output = "Access Granted! Redirecting to contact protocol... (Check your Get In Touch window!)";
          break;
        case 'clear':
          setHistory([]);
          setInput("");
          return;
        case '':
          break;
        default:
          output = `command not found: ${cmd}`;
      }

      if (output) {
        newHistory.push({ type: 'output', text: output });
      }
      
      setHistory(newHistory);
      setInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <Window id="terminal" title="TERMINAL" isOpen={isOpen} onClose={onClose} zIndex={zIndex} onFocus={onFocus}>
      <div className="flex flex-col h-full bg-[#0a0a0b] -m-8 p-4 text-[#10b981] font-mono-spaced text-[12px] min-h-[400px] overflow-y-auto cursor-text" onClick={() => document.getElementById('terminal-input')?.focus()}>
        {history.map((line, i) => (
          <div key={i} className={`mb-1 ${line.type === 'input' ? 'text-white' : 'text-[#10b981] opacity-90'}`}>
            {line.text}
          </div>
        ))}
        <div className="flex mt-1">
          <span className="text-white mr-2">visitor@tanmay-os:~$</span>
          <input 
            id="terminal-input"
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="bg-transparent border-none outline-none text-[#10b981] flex-1"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </Window>
  );
}
