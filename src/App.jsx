
import React, { useState, useEffect, useRef } from 'react';
import { Send, Cat, User, Sparkles, Zap, Ghost, Cpu, Activity, Info } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    { 
      id: 'welcome', 
      role: 'bot', 
      text: "Halo! Saya Necko AI v1.0. Ada yang bisa saya bantu hari ini? ✨",
      isTyping: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const API_URL = "https://b57b-2400-9800-1f2-6721-613f-5599-8b67-e4d.ngrok-free.app/chat";

  const forceScrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    forceScrollToBottom();
  }, [messages, isLoading]);

  const typeMessage = (fullText, messageId) => {
    let index = 0;
    const speed = 10; 

    const interval = setInterval(() => {
      if (index <= fullText.length) {
        const partialText = fullText.slice(0, index);
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, text: partialText } : msg
        ));
        index++;
        forceScrollToBottom();
      } else {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, isTyping: false } : msg
        ));
        clearInterval(interval);
      }
    }, speed);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ message: currentInput })
      });

      const data = await response.json();
      const botReply = data.reply || data.response || data.text || "Sistem Necko mengalami kendala.";
      
      const botId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botId, role: 'bot', text: '', isTyping: true }]);
      
      setIsLoading(false);
      typeMessage(botReply, botId);

    } catch (error) {
      setIsLoading(false);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'bot', 
        text: "Koneksi terputus ke server, Coba lagi nanti yaaa🤗" 
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#05070a] text-slate-100 overflow-hidden font-sans relative">
      
      {/* Background Animated Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles Simulation */}
        <div className="absolute w-2 h-2 bg-indigo-500/20 rounded-full top-[20%] left-[30%] animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute w-1 h-1 bg-purple-500/20 rounded-full top-[60%] left-[80%] animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-3 h-3 bg-blue-500/10 rounded-full top-[40%] left-[10%] animate-pulse" style={{ animationDuration: '5s' }} />
      </div>

      {/* Glassmorphism Header */}
      <header className="flex-none p-4 md:px-8 bg-slate-900/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 shadow-inner transform group-hover:rotate-12 transition-transform">
              <Cat className="text-white w-7 h-7" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-200">
              NECKO<span className="text-indigo-500">AI</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse [animation-delay:0.2s]" />
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex gap-6 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Latency</span>
            <span className="text-xs text-emerald-400 font-mono">14ms</span>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Memory</span>
            <span className="text-xs text-indigo-400 font-mono">0.4 GB</span>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-white/5">
             <Activity className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Interactive Chat Main View */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 scroll-smooth scrollbar-none z-10"
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          {/* Static Decoration for Start */}
          <div className="flex flex-col items-center py-10 opacity-30 select-none">
             <Cpu className="w-12 h-12 text-indigo-500 mb-2 animate-spin-slow" />
             <p className="text-xs font-mono uppercase tracking-[0.3em]">Encrypted Session Initialized</p>
          </div>

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-4 animate-fade-up`}
            >
              {msg.role === 'bot' && (
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20" />
                  <div className="relative w-10 h-10 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shadow-xl">
                    <Ghost className="text-indigo-400 w-5 h-5 animate-pulse" />
                  </div>
                </div>
              )}
              
              <div className={`
                relative px-6 py-4 rounded-[2rem] text-sm md:text-base leading-relaxed max-w-[85%] md:max-w-[75%] shadow-2xl transition-all hover:scale-[1.01]
                ${msg.role === 'user' 
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none border border-white/10' 
                  : 'bg-slate-900/60 backdrop-blur-md border border-white/10 text-slate-200 rounded-tl-none'}
              `}>
                <div className="whitespace-pre-wrap font-medium">
                  {msg.text}
                  {msg.isTyping && (
                    <span className="inline-flex ml-2 w-2 h-5 bg-indigo-400 animate-pulse rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)] align-middle" />
                  )}
                </div>
                
                {/* Micro-detail in bubbles */}
                <div className={`absolute bottom-[-18px] text-[9px] font-bold uppercase tracking-wider opacity-30 ${msg.role === 'user' ? 'right-4' : 'left-4'}`}>
                   {msg.role === 'user' ? 'Authorised' : 'Verified AI'}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-lg">
                  <User className="text-indigo-400 w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center">
                <Ghost className="text-indigo-400 w-5 h-5" />
              </div>
              <div className="flex gap-2 px-6 py-4 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl">
                 <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                 </div>
                 <span className="text-xs text-slate-500 font-bold uppercase tracking-widest ml-2">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Interactive Bottom Control Dock */}
      <footer className="flex-none p-6 md:px-10 md:pb-10 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative group p-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-[2.5rem] shadow-2xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
            
            <div className="relative flex items-center bg-[#0d121f] rounded-[2.4rem] p-2 pr-3">
              <div className="pl-6 pr-4">
                 <Sparkles className="w-5 h-5 text-indigo-500/50 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tuliskan perintah ke Necko..." 
                className="flex-1 bg-transparent border-none outline-none py-4 text-sm md:text-base text-white placeholder:text-slate-600 font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="relative overflow-hidden group/btn bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-indigo-600/30"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <Send className={`w-6 h-6 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform ${isLoading ? 'opacity-50' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center md:justify-between items-center px-6 gap-4">
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/5">
                   <Zap className="w-3 h-3 text-amber-500" />
                   <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Giga Response</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/5">
                   <Info className="w-3 h-3 text-indigo-400" />
                   <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">SSL-X</span>
                </div>
             </div>
             <p className="text-[9px] text-slate-700 font-black tracking-[0.4em] uppercase">
                &copy; 2026 NECKO NEURAL SYSTEM
             </p>
          </div>
        </div>
      </footer>

      {/* Global Style Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.4s ease-out forwards; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        
        input::placeholder {
          transition: transform 0.3s ease;
        }
        input:focus::placeholder {
          transform: translateX(10px);
          opacity: 0.5;
        }
      `}} />
    </div>
  );
}

