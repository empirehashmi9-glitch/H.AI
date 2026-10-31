import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Bot, User, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../lib/types';

interface JarvisChatProps {
  onSuggestPrompt: (prompt: string) => void;
  onOpenGeminiVsHAI: () => void;
}

export const JarvisChat: React.FC<JarvisChatProps> = ({ onSuggestPrompt, onOpenGeminiVsHAI }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'jarvis',
      text: 'Salam! Main H.AI ka J.A.R.V.I.S. Autonomous Assistant hoon. Aap mujh se Urdu, Hindi ya English me sawal pooch sakte hain: Gemini vs H.AI ka farq, app generation, ya duniya ke sab se tez AI engines ke bare me!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionSuggested: 'Crypto Trading Terminal'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 200));
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable', e);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');

    // J.A.R.V.I.S. Intelligent response generator
    setTimeout(() => {
      let reply = '';
      let suggestedPrompt = '';

      if (query.includes('gemini') || query.includes('gamini') || query.includes('advance')) {
        reply = 'Gemini Google ka super-intelligent foundation brain hai! Jabke H.AI ek 30-agent autonomous factory hai jo Gemini ke brain ko use karke poori Web + iOS + Android app 90 seconds me assemble karti hai. Dono mil kar dunya ka sab se tez multi-platform ecosystem bante hain!';
      } else if (query.includes('taaz') || query.includes('tez') || query.includes('speed') || query.includes('fast')) {
        reply = 'H.AI me jab aap Hyper-Drive 200% activate karte hain to 30 specialist agents parallel chalte hain (aggregate 4,800 tokens/sec), jo kisi bhi aam sequential LLM se 5x se 10x zyada tez complete codebase tayyar karta hai!';
        suggestedPrompt = 'Autonomous AI Drone Fleet Command Dashboard with 3D map telemetry';
      } else if (query.includes('kami') || query.includes('missing') || query.includes('update')) {
        reply = 'Pehle aapke project me App.tsx khali tha, 3D Arc Reactor missing tha, multi-platform code generator nahi tha aur AI speed comparison nahi tha. Hum ne ye tamam cheezein 100% build aur update kar di hain!';
      } else if (query.includes('deploy') || query.includes('vercel') || query.includes('supabase')) {
        reply = 'Deploy tab se aap 1-click me Supabase PostgreSQL schema aur Vercel SPA routing export kar sakte hain. Tamam tables me Row Level Security (RLS) auto-injected hai!';
      } else {
        reply = `Aapke prompt "${query.slice(0, 40)}" par humare 30 specialist agents (React, SwiftUI, Compose, PostgreSQL RLS) kaam karne ke liye ready hain. "Assemble Multi-Platform App" dabayein!`;
        suggestedPrompt = query;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'jarvis',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggested: suggestedPrompt
      };

      setMessages(prev => [...prev, botMsg]);
      speakText(reply);
    }, 600);
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser window. Please type your message.');
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 flex flex-col h-[560px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm font-orbitron">J.A.R.V.I.S. Voice & AI Terminal</h3>
            <p className="text-xs text-cyan-400 font-mono">Bilingual (Urdu / English) · Autonomous Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
              voiceEnabled ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-500'
            }`}
            title="Toggle Voice Output"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline font-mono">{voiceEnabled ? 'Voice ON' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-cyan-500 text-slate-950 font-bold'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[80%] rounded-2xl p-3.5 space-y-2 border ${
              msg.sender === 'user'
                ? 'bg-blue-600/20 border-blue-500/30 text-white rounded-tr-none'
                : 'bg-slate-950/80 border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              
              {msg.actionSuggested && (
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => onSuggestPrompt(msg.actionSuggested!)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Load Template: "{msg.actionSuggested}"
                  </button>
                </div>
              )}

              <div className="text-[10px] text-slate-500 text-right font-mono">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening ? 'bg-rose-500 text-white animate-pulse border-rose-400' : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
            title="Speech to Text"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder="Poochiye: Gemini vs H.AI, speed test, ya app ka idea..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
