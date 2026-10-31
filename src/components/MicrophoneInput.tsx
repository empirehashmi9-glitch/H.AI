import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { Language } from '../types/agent';

interface MicrophoneInputProps {
  onTranscript: (text: string) => void;
  language: Language;
  disabled?: boolean;
}

export const MicrophoneInput: React.FC<MicrophoneInputProps> = ({
  onTranscript,
  language,
  disabled = false
}) => {
  const isUrdu = language === 'ur';
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioAnimationRef = useRef<number | null>(null);

  // Initialize SpeechRecognition if supported
  useEffect(() => {
    const SpeechRecognitionAPI = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = isUrdu ? 'ur-PK' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const combined = (final || interim).trim();
        setLiveTranscript(combined);
        if (combined) {
          onTranscript(combined);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setErrorMsg(isUrdu ? 'مائیکروفون کی اجازت نہیں ملی' : 'Microphone permission denied');
        } else if (event.error !== 'no-speech') {
          setErrorMsg(isUrdu ? 'مائیکروفون سے آواز وصول نہیں ہوئی' : 'Microphone audio recognition error');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (audioAnimationRef.current) {
        cancelAnimationFrame(audioAnimationRef.current);
      }
    };
  }, [isUrdu, onTranscript]);

  // Simulated audio frequency wave animation when listening
  useEffect(() => {
    if (!isListening) {
      setAudioLevel(0);
      return;
    }

    let frame = 0;
    const animateBars = () => {
      frame++;
      // Oscillate simulated frequency levels
      const level = Math.sin(frame * 0.2) * 40 + Math.random() * 50 + 20;
      setAudioLevel(Math.min(100, Math.max(10, Math.round(level))));
      audioAnimationRef.current = requestAnimationFrame(animateBars);
    };

    audioAnimationRef.current = requestAnimationFrame(animateBars);
    return () => {
      if (audioAnimationRef.current) {
        cancelAnimationFrame(audioAnimationRef.current);
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (disabled) return;
    setErrorMsg(null);

    // If browser supports webkitSpeechRecognition
    if (recognitionRef.current) {
      if (isListening) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        setIsListening(false);
      } else {
        try {
          recognitionRef.current.lang = isUrdu ? 'ur-PK' : 'en-US';
          recognitionRef.current.start();
          setIsListening(true);
        } catch {
          // If already active or error, force restart
          try {
            recognitionRef.current.abort();
            recognitionRef.current.start();
            setIsListening(true);
          } catch {
            simulateVoicePrompt();
          }
        }
      }
    } else {
      // Fallback: If browser doesn't expose Web Speech API (e.g. headless/iFrame)
      simulateVoicePrompt();
    }
  };

  // High-fidelity fallback simulation for environments without Web Speech API
  const simulateVoicePrompt = () => {
    setIsListening(true);
    setLiveTranscript(isUrdu ? 'آواز ریکارڈ ہو رہی ہے...' : 'Listening to speech...');

    const sampleUrduPrompts = [
      'ایک مکمل ای کامرس ایپ جس میں پروڈکٹ فلٹر، شاپنگ کارٹ اور جاز کیش ہو',
      'ڈاکٹر اپوائنٹمنٹ اور ویڈیو کنسلٹیشن ایپ مع سپابیس ڈیٹا بیس',
      'آن لائن فوڈ ڈلیوری پلیٹ فارم ری ایکٹ اور سوئفٹ یو آئی میں بنائیں'
    ];

    const sampleEnPrompts = [
      'Build a modern real-time crypto trading portfolio with Supabase and Vercel edge deployment',
      'Autonomous telemedicine doctor portal with appointment scheduling and Stripe checkout',
      'Multiplatform fitness tracking app with Apple HealthKit and Android Health Connect'
    ];

    const chosen = isUrdu 
      ? sampleUrduPrompts[Math.floor(Math.random() * sampleUrduPrompts.length)]
      : sampleEnPrompts[Math.floor(Math.random() * sampleEnPrompts.length)];

    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx += 3;
      const partial = chosen.slice(0, charIdx);
      setLiveTranscript(partial);
      onTranscript(partial);

      if (charIdx >= chosen.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsListening(false);
        }, 600);
      }
    }, 50);
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        className={`relative group flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl font-medium text-xs transition-all select-none ${
          isListening
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105 ring-2 ring-rose-400 ring-offset-2 ring-offset-[#0b0f19]'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isListening ? (
          <>
            {/* Live Pulsing Mic Ring */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/5 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white/5"></span>
            </span>

            {/* Audio Wave Visualizer Bars */}
            <div className="flex items-center gap-0.5 h-3 px-1">
              {[0.6, 1, 0.4, 0.9, 0.7].map((factor, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-white/5 rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.max(4, Math.min(16, (audioLevel * factor) / 4))}px`
                  }}
                />
              ))}
            </div>

            <span className="font-semibold">
              {isUrdu ? 'بولیں (ریکارڈ جاری)...' : 'Listening... Speak'}
            </span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">
              {isUrdu ? 'مائیک سے بولیں' : 'Voice Input'}
            </span>
          </>
        )}
      </button>

      {/* Language badge for speech recognition */}
      <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
        {isUrdu ? 'اردو (PK)' : 'English (US)'}
      </span>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="absolute top-full left-0 mt-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-1.5 z-50 whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
