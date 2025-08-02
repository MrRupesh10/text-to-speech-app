'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, ChevronUpIcon, ChevronDownIcon, StarIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
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

  
  const [templates] = useState<Template[]>([
    { name: '👋 Greeting', text: 'Hello! How are you doing today?' },
    { name: '🙏 Thank You', text: 'Thank you for your help and support. I really appreciate it.' },
    { name: '📅 Meeting', text: 'Let\'s schedule a meeting to discuss this further. What time works best for you?' },
    { name: '📧 Email Intro', text: 'I hope this message finds you well. I am writing to discuss...' },
    { name: '🎉 Congratulations', text: 'Congratulations on your achievement! This is a remarkable accomplishment.' },
    { name: '📝 Feedback', text: 'Thank you for your work. Here\'s my feedback on the recent project...' },
    { name: '🤝 Introduction', text: 'Hi, I\'m [Name]. It\'s a pleasure to meet you. I work in...' },
    { name: '💼 Job Application', text: 'I am writing to express my interest in the [position] role at your company...' },
    { name: '🎯 Project Update', text: 'Here\'s a quick update on the project progress. We\'ve completed...' },
    { name: '🌟 Recommendation', text: 'I highly recommend [Name] for their exceptional skills in...' },
    { name: '📚 Book Review', text: 'This compelling novel takes readers on an unforgettable journey through time and space, weaving together multiple storylines that explore themes of love, loss, and redemption. The author\'s masterful prose creates vivid imagery throughout.' },
    { name: '🎓 Academic Abstract', text: 'This research paper examines the impact of artificial intelligence on modern healthcare systems, focusing on diagnostic accuracy and patient outcomes. Through comprehensive data analysis and case studies, we demonstrate significant improvements in early disease detection.' },
    { name: '🏢 Company Overview', text: 'Our organization specializes in developing innovative solutions for sustainable energy production. With over two decades of experience, we\'ve successfully implemented renewable energy projects across three continents, serving millions of households.' },
    { name: '🌍 Travel Blog', text: 'Nestled in the heart of the ancient city, this hidden gem offers travelers an authentic cultural experience. Local artisans showcase traditional crafts while street vendors serve delectable regional specialties in the bustling marketplace.' },
    { name: '👨‍🍳 Recipe Introduction', text: 'This family-favorite recipe has been passed down through generations, combining fresh Mediterranean ingredients with modern cooking techniques. The secret lies in the slow-cooking process and careful selection of aromatic herbs.' },
    { name: '🎭 Event Description', text: 'Join us for an evening of enchanting performances featuring local and international artists. The showcase includes live music, contemporary dance, and interactive art installations, creating an immersive experience for all attendees.' },
    { name: '🏥 Medical Summary', text: 'The patient presents with symptoms including mild fever, persistent cough, and fatigue lasting approximately one week. Previous medical history shows no significant respiratory issues. Current vital signs are within normal ranges.' },
    { name: '🌱 Garden Guide', text: 'Spring is the perfect time to start your herb garden. Choose a sunny location with well-draining soil, and plant aromatic varieties like basil, thyme, and rosemary. Regular watering and monthly fertilizing ensure optimal growth.' },
    { name: '🎨 Art Description', text: 'The masterpiece showcases the artist\'s signature style through bold brushstrokes and vibrant color choices. Created during their influential Paris period, this work reflects themes of urban life and social transformation.' },
    { name: '🏃 Fitness Plan', text: 'This comprehensive workout routine combines high-intensity interval training with strength exercises. Begin with a 10-minute warm-up, followed by circuit training. Remember to maintain proper form and stay hydrated throughout.' },
    { name: '🎮 Game Review', text: 'This groundbreaking video game redefines the action-adventure genre with stunning visuals and innovative gameplay mechanics. The intricate storyline keeps players engaged while the dynamic combat system offers unprecedented freedom of choice.' },
    { name: '🏠 Property Listing', text: 'This charming three-bedroom home features modern amenities while preserving its classic character. The renovated kitchen includes stainless steel appliances, while the spacious backyard offers perfect entertainment space with mature landscaping.' },
    { name: '📱 Tech Review', text: 'The latest smartphone release combines cutting-edge technology with practical features. The advanced camera system excels in low-light conditions, while the enhanced battery life supports extended use. The intuitive interface improves user experience.' },
    { name: '🍽️ Restaurant Review', text: 'This elegant establishment offers a unique fusion of traditional and contemporary cuisine. The chef\'s tasting menu showcases seasonal ingredients sourced from local farms. The attentive service and ambient atmosphere create an exceptional dining experience.' },
    { name: '🎵 Music Review', text: 'The album masterfully blends classical elements with modern electronic sounds, creating an innovative sonic landscape. Each track demonstrates the artist\'s evolution while maintaining their signature style. The production quality is outstanding.' },
    { name: '📺 Movie Synopsis', text: 'In this thrilling drama, a determined detective uncovers a complex conspiracy while dealing with personal demons. Set against a noir-inspired cityscape, the story explores themes of redemption and justice through compelling character development.' },
    { name: '🌿 Product Description', text: 'Our all-natural skincare line combines organic botanicals with scientifically proven ingredients. Each product is carefully formulated to nourish and protect your skin, while sustainable packaging reflects our commitment to environmental responsibility.' },
    { name: '📊 Business Proposal', text: 'Our innovative solution addresses key market challenges through proprietary technology and scalable infrastructure. Initial testing shows a 40% improvement in efficiency. The implementation plan includes comprehensive training and ongoing support.' },
    { name: '🎪 Festival Announcement', text: 'Experience three days of music, art, and culture at our annual community festival. Featured attractions include international performers, interactive workshops, local food vendors, and family-friendly activities throughout the historic downtown area.' },
    { name: '🎓 Course Description', text: 'This comprehensive program covers advanced topics in data science and machine learning. Students will gain hands-on experience with real-world projects, while expert instructors provide guidance in implementing cutting-edge algorithms and best practices.' },
    { name: '🌊 Weather Report', text: 'A strong weather system approaches from the northwest, bringing significant rainfall and gusty winds. Coastal areas should prepare for high surf conditions. Temperatures will remain below seasonal averages through the weekend.' },
    { name: '🏛️ Historical Overview', text: 'The ancient civilization flourished in this region for over five centuries, developing sophisticated agricultural systems and architectural marvels. Recent archaeological discoveries provide new insights into their social structure and technological achievements.' },
    { name: '🎪 Workshop Invitation', text: 'Join our intensive three-day workshop focused on creative writing and storytelling techniques. Experienced authors will share insights on character development, plot structure, and publishing strategies. Limited spots available for hands-on sessions.' },
    { name: '🌿 Environmental Report', text: 'Recent studies indicate significant improvements in local air quality following the implementation of green initiatives. Urban forests have expanded by 15%, while community recycling programs show increased participation rates.' },
    { name: '💡 Innovation Summary', text: 'Our breakthrough technology revolutionizes renewable energy storage through advanced materials science. Laboratory tests demonstrate 30% higher efficiency than current solutions, with potential applications across multiple industries.' }
  ]);


  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    // Load history from localStorage
    const savedHistory = localStorage.getItem('ttsHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
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
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone');
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
  <div className="flex">
    {/* Sidebar */}
    <Sidebar
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      selectedLanguage={voiceLanguage}
      setSelectedLanguage={setVoiceLanguage}
      voices={voices}
      history={history}
      setHistory={setHistory}
      templates={templates}
      selectedVoice={selectedVoice}
      setSelectedVoice={setSelectedVoice}
    />

    {/* Main wrapper that shifts left/right */}
    <div
      className={`flex flex-col min-h-screen w-full transition-all duration-300 ${
        isSidebarOpen ? 'ml-80' : 'ml-0'
      }`}
    >
      {/* Navbar always on top */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Your main content */}
      <div className="pt-20 px-6 pb-10 flex-grow">
        {/* ✅ Keep your existing page content here (header, inputs, etc.) */}
      </div>
    

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
      </div>
    </div>
  
  );
}