'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, ChevronUpIcon, ChevronDownIcon, StarIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useAppContext } from './context/AppContext';
import { translateText as translate } from './services/translation';


interface HistoryItem {
  text: string;
  timestamp: Date;
  voice: string;
  isFavorite?: boolean;
}

interface Template {
  name: string;
  text: string;
}


export default function Home() {
  const { text, setText } = useAppContext();
  const [translatedText, setTranslatedText] = useState('');
  const [translationLanguage, setTranslationLanguage] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<string>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

// Add spinner component
const Spinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 border-2 border-t-2 border-t-purple-500 border-purple-300 rounded-full animate-spin"></div>
    <span className="text-sm text-gray-500 dark:text-gray-300">Translating...</span>
  </div>
);


useEffect(() => {
    if (!text) {
      setTranslatedText('');
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const langCode = translationLanguage.split('-')[0].toLowerCase();
        const translated = await translate(text, langCode);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Live translation failed:', error);
        setTranslatedText('[Translation failed]');
      } finally {
        setIsTranslating(false);
      }
    }, 800);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [text, translationLanguage]);

 

    useEffect(() => {
  const loadVoices = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setSelectedVoice(availableVoices[0].name);
      }
    }
  };
     if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }
    // Load history from localStorage
   const savedHistory = localStorage.getItem('ttsHistory');
  if (savedHistory) {
    setHistory(JSON.parse(savedHistory).map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    })));
  }

  return () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = null;
    }
  };
}, []);
  useEffect(() => {
    if (text) {
      setCharCount(text.length);
      setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
    } else {
      setCharCount(0);
      setWordCount(0);
    }
  }, [text]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

 const startRecording = async () => {
  try {
    if (!navigator?.mediaDevices?.getUserMedia) {
      alert('Audio recording not supported on this device');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'speech.wav';
      a.click();
      URL.revokeObjectURL(audioUrl);
    };

    mediaRecorder.start();
    setIsRecording(true);
  } catch (err) {
    console.error('Microphone access error:', err);
    alert('Microphone not accessible');
  }
};


  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSpeak = async () => {
    if (!text) return;
    
    try {
      const textToSpeak = translatedText || text;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Find a voice for the selected voice language
      const availableVoices = voices.filter(v => v.lang.startsWith(voiceLanguage));
      const voice = availableVoices.length > 0 ? availableVoices[0] : voices[0];
      if (voice) utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = voiceLanguage;
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      
      
      // Add to history
      const newHistory = [
        { text: textToSpeak, timestamp: new Date(), voice: voice?.name || 'Default' },
        ...history
      ].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('ttsHistory', JSON.stringify(newHistory));
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
      alert('Failed to speak. Please try again.');
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const estimatedTime = Math.round((wordCount / 150) * 60); // Assuming 150 words per minute

  const filteredVoices = voiceLanguage === 'all' 
    ? voices 
    : voices.filter(voice => voice.lang.startsWith(voiceLanguage));

  const uniqueLanguages = Array.from(new Set(voices.map(voice => voice.lang.split('-')[0])));

  const toggleFavorite = (index: number) => {
    const newHistory = [...history];
    newHistory[index].isFavorite = !newHistory[index].isFavorite;
    setHistory(newHistory);
    localStorage.setItem('ttsHistory', JSON.stringify(newHistory));
  };

  const applyTemplate = (template: Template) => {
    setText(template.text);
  };

  const handleTranslate = async () => {
    if (!text) return;
    
    setIsTranslating(true);
    try {
      // Convert language codes to ISO 639-1 format
      const langCode = translationLanguage.split('-')[0].toLowerCase();
      const translated = await translate(text, langCode);
      setTranslatedText(translated);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsTranslating(false);
    }
  };

  return (
 
   <>
        {/* Header */}
        <header className={`relative overflow-hidden py-10 md:py-14 px-4 bg-gradient-to-br ${
          theme === 'dark'
            ? 'from-slate-800/20 via-purple-900/20 to-slate-800/20'
            : theme === 'system'
              ? 'from-gray-700/20 via-purple-800/20 to-gray-700/20'
              : 'from-purple-600/5 via-pink-600/5 to-blue-600/5'
        } border-b border-gray-200/20 dark:border-gray-700/20`}>
          <div className="absolute inset-0 backdrop-blur-xl"></div>
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center space-y-4">
              <div className="inline-block animate-float">
                <div className="relative w-64 h-64 mx-auto mb-8">
        <Image
                    src="/images/speech-waves.svg"
                    alt="Speech Waves"
                    fill
                    className="object-contain"
          priority
        />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
                  Text to Speech
                </h1>
              </div>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Transform your words into natural speech instantly ✨
              </p>
              <div className="flex justify-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Image
                    src="/images/microphone.svg"
                    alt="Multiple Voices"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  Multiple Voices
                </div>
                <div className="flex items-center">
                  <Image
                    src="/images/globe.svg"
                    alt="Multiple Languages"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  Multiple Languages
                </div>
                <div className="flex items-center">
                  <Image
                    src="/images/lightning.svg"
                    alt="Real-time Preview"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  Real-time Preview
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl"></div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
          <main className="space-y-8">
            <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-700/20">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white cursor-pointer transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>Upload Text</span>
                    <input
                      type="file"
                      accept=".txt,.doc,.docx,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-colors`}
                  >
                    {isRecording ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <rect x="6" y="6" width="12" height="12" rx="1"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <circle cx="12" cy="12" r="6"/>
                        <circle cx="12" cy="12" r="2" fill="currentColor"/>
                      </svg>
                    )}
                    <span>{isRecording ? 'Stop' : 'Record'}</span>
                  </button>
                  <div className="flex items-center gap-2 ml-auto">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Voice Language:</label>
                    <select
                      value={voiceLanguage}
                      onChange={(e) => setVoiceLanguage(e.target.value)}
                      className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border-0 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="ru">Russian</option>
                      <option value="ar">Arabic</option>
                      <option value="bn">Bengali</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Original Text:</label>
                    <textarea
                      className="w-full h-48 p-4 text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 rounded-xl border-0 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ease-in-out text-lg"
                      placeholder="Enter your text here..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Words: {wordCount} | Characters: {charCount}
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <select
                          value={translationLanguage}
                          onChange={(e) => setTranslationLanguage(e.target.value)}
                          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="hi">Hindi</option>
                          <option value="ja">Japanese</option>
                          <option value="ko">Korean</option>
                          <option value="ru">Russian</option>
                          <option value="zh">Chinese</option>
                          <option value="ar">Arabic</option>
                          <option value="bn">Bengali</option>
                        </select>
                        <button
                          onClick={handleTranslate}
                          disabled={!text || isTranslating}
                          className={`px-4 py-2 rounded-lg ${
                            !text || isTranslating
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white`}
                        >
                          {isTranslating ? 'Translating...' : 'Translate'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Translated Text:</label>
                   <div className="w-full h-50 p-4 text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 rounded-xl border-0 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ease-in-out text-lg overflow-auto ">
                      {isTranslating ? <Spinner w-6 h-6 border-2 border-t-2 border-t-purple-500 border-purple-300 rounded-full animate-spin-fast/> : (translatedText || '[Translation will appear here...]')}
                    </div>
                  </div>
                </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="text-gray-700 dark:text-gray-300">Speed: {rate}x</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 dark:text-gray-300">Pitch: {pitch}</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={pitch}
                      onChange={(e) => setPitch(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={handleSpeak}
                    disabled={isSpeaking || (!text && !translatedText)}
                    className={`px-8 py-3 rounded-xl font-medium text-white shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 ${
                      isSpeaking || (!text && !translatedText)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isSpeaking ? '🔊 Speaking...' : '🎙️ Speak'}
                    </span>
                  </button>
                  
                  {isSpeaking && (
                    <button
                      onClick={handleStop}
                      className="px-8 py-3 rounded-xl font-medium text-white shadow-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transform transition-all duration-200 ease-in-out hover:scale-105"
                    >
                      <span className="flex items-center gap-2">
                        ⏹️ Stop
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {history.length > 0 && (
              <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-800/20 rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-4">
                  📜 Recent Conversions
                </h2>
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-white/10 dark:bg-gray-700/10 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => {
                            setText(item.text);
                            setSelectedVoice(item.voice);
                          }}
                        >
                          <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{item.text}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {item.timestamp.toLocaleString()} • {item.voice}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(index);
                          }}
                          className="ml-4 text-xl hover:scale-110 transition-transform"
                        >
                          {item.isFavorite ? '⭐' : '☆'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-800/20 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-4 flex items-center">
                <Image
                  src="/images/lightbulb.svg"
                  alt="Tips"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Quick Tips
              </h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <Image
                    src="/images/edit.svg"
                    alt="Type"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Type or paste your text in the box above
          </li>
                <li className="flex items-center">
                  <Image
                    src="/images/file.svg"
                    alt="Upload"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Upload a text file or record your voice
          </li>
                <li className="flex items-center">
            <Image
                    src="/images/settings.svg"
                    alt="Settings"
              width={20}
              height={20}
                    className="mr-2"
                  />
                  Adjust voice, speed, and pitch to your preference
                </li>
                <li className="flex items-center">
          <Image
                    src="/images/play.svg"
                    alt="Play"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Click the Speak button to hear the text
                </li>
                <li className="flex items-center">
          <Image
                    src="/images/stop.svg"
                    alt="Stop"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Use the Stop button to cancel the speech
                </li>
                <li className="flex items-center">
          <Image
                    src="/images/history.svg"
                    alt="History"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Access your recent conversions from history
                </li>
              </ul>
            </div>
          </main>
        </div>
     </>
    
  
  );
}