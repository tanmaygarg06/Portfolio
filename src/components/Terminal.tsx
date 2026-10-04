"use client";
import { useState, useRef, useEffect } from "react";
import Window from "./Window";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

const INITIAL_MESSAGE = [
  { type: 'output' as const, text: 'Welcome to the TanmayOS Interactive Terminal!' },
  { type: 'output' as const, text: 'I built this feature so you can explore my backend/cloud engineering skills in a native command-line environment.' },
  { type: 'output' as const, text: ' ' },
  { type: 'output' as const, text: 'Available commands:' },
  { type: 'output' as const, text: '  whoami       - Who is Tanmay?' },
  { type: 'output' as const, text: '  skills       - View technical skills' },
  { type: 'output' as const, text: '  projects     - View my top projects' },
  { type: 'output' as const, text: '  education    - View academic background' },
  { type: 'output' as const, text: '  contact      - Get my contact information' },
  { type: 'output' as const, text: '  matrix       - Enter the matrix' },
  { type: 'output' as const, text: '  theme        - Change OS theme' },
  { type: 'output' as const, text: '  clear        - Clear the terminal' },
  { type: 'output' as const, text: ' ' }
];

export default function Terminal({ isOpen, onClose, zIndex, onFocus }: TerminalProps) {
  const [history, setHistory] = useState<{ type: 'input' | 'output', text: string }[]>(INITIAL_MESSAGE);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const [processState, setProcessState] = useState<{ step: number; role: string; salary: string; company: string; email: string } | null>(null);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const lowerCmd = cmd.toLowerCase();
      const newHistory = [...history, { type: 'input', text: `visitor@tanmay-os:~$ ${cmd}` } as const];
      
      if (processState) {
        let output = "";
        const state = { ...processState };
        
        if (state.step === 1) {
          state.role = cmd;
          state.step = 2;
          output = "What is the proposed salary/stipend?";
          setProcessState(state);
        } else if (state.step === 2) {
          state.salary = cmd;
          state.step = 3;
          output = "What is the name of your company / hiring manager?";
          setProcessState(state);
        } else if (state.step === 3) {
          state.company = cmd;
          state.step = 4;
          output = "What is your email address so I can get back to you?";
          setProcessState(state);
        } else if (state.step === 4) {
          state.email = cmd;
          output = "Thank you for showing interest in hiring me! Once I read all requirements, I will respond to you promptly.";
          setProcessState(null);
          
          fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: state.company + ' (via Terminal)',
              email: state.email,
              message: `[TERMINAL HIRE REQUEST]\nRole: ${state.role}\nSalary/Stipend: ${state.salary}`
            })
          }).catch(console.error);
        }

        newHistory.push({ type: 'output', text: output });
        setHistory(newHistory);
        setInput("");
        return;
      }

      let output = "";
      switch (lowerCmd) {
        case 'help':
          output = "Available commands:\n  whoami\n  skills\n  projects\n  education\n  contact\n  matrix\n  theme\n  clear\n  sudo hire tanmay";
          break;
        case 'whoami':
          output = "Tanmay Garg - Software Engineer & Cloud Builder.\nPassionate about scalable backend systems, robust cloud solutions, and competitive programming.";
          break;
        case 'skills':
          output = "Cloud & DevOps : AWS, Docker, Kubernetes\nBackend        : Python, Java, Node.js\nFrontend       : JavaScript, React, Next.js, HTML, CSS\nDatabases      : DynamoDB, SQL\nTools          : Git, Linux, Power BI, Excel";
          break;
        case 'projects':
          output = "[1] Sync-Board: Real-time collaborative whiteboard using WebSockets.\n[2] Backend API: Scalable REST API deployed on AWS ECS with auto-scaling.\n[3] Portfolio OS: This very operating system simulation you are using right now!";
          break;
        case 'education':
          output = "Vellore Institute of Technology (VIT)\nB.Tech in Computer Science and Engineering\nExpected Graduation: 2026\nClubs: Backend Developer @ ISTE VIT";
          break;
        case 'contact':
          output = "Email    : tanmaylkgarg@gmail.com\nLinkedIn : linkedin.com/in/garg-tanmay\nGitHub   : github.com/tanmaygarg06\nCodolio  : codolio.com/profile/tanmay_garg06";
          break;
        case 'matrix':
          output = "Wake up, Neo...\nThe matrix has you...\nFollow the white rabbit.";
          break;
        case 'theme':
          output = "Error: Dark mode is the only mode for real developers.";
          break;
        case 'sudo hire tanmay':
          output = "Currently open for internship. What role are you hiring for?";
          setProcessState({ step: 1, role: '', salary: '', company: '', email: '' });
          break;
        case 'sudo rm -rf /':
          output = "Nice try. I keep my backups in multiple availability zones on AWS S3.";
          break;
        case 'clear':
          setHistory(INITIAL_MESSAGE);
          setInput("");
          return;
        case '':
          break;
        default:
          if (lowerCmd.startsWith('sudo ')) {
            output = `visitor is not in the sudoers file. This incident will be reported.`;
          } else {
            output = `command not found: ${cmd}. Type "help" for a list of available commands.`;
          }
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
          <div key={i} className={`mb-1 whitespace-pre-wrap leading-relaxed ${line.type === 'input' ? 'text-white' : 'text-[#10b981] opacity-90'}`}>
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
