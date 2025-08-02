'use client';

import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { AppProvider } from '../context/AppContext'; 

const templates = [
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
  { name: '📚 Book Review', text: 'This book offers a fascinating perspective on [topic]. The author masterfully...' },
  { name: '🎓 Academic Paper', text: 'This research paper examines the relationship between [variable A] and [variable B]...' },
  { name: '🎤 Speech Opening', text: 'Distinguished guests, ladies and gentlemen, it is my honor to...' },
  { name: '📱 Product Description', text: 'Introducing our latest innovation, designed to revolutionize how you...' },
  { name: '🎨 Creative Writing', text: 'The sun cast long shadows across the ancient cobblestones as...' },
  { name: '📊 Data Analysis', text: 'Based on our findings, the data shows a significant correlation between...' },
  { name: '🏥 Medical Report', text: 'Patient presents with symptoms including [symptom A] and [symptom B]...' },
  { name: '⚖️ Legal Notice', text: 'This document serves as formal notice regarding the matter of...' },
  { name: '🎮 Game Script', text: 'Welcome, adventurer! Your quest begins in the mystical realm of...' },
  { name: '🎬 Video Script', text: 'In today\'s video, we\'ll be exploring the fascinating world of...' }
];

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const initVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Get initial voices
    initVoices();

    // Listen for voices changed event
    window.speechSynthesis.onvoiceschanged = initVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const filteredVoices = selectedLanguage === 'all' 
    ? voices 
    : voices.filter(voice => voice.lang.startsWith(selectedLanguage));
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar 
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className="flex flex-1">
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              voices={filteredVoices}
              history={history}
              setHistory={setHistory}
              templates={templates}
            />
            <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-80' : 'ml-0'} transition-all duration-300`}>
              <main className="flex-1 container mx-auto px-4 pt-16">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
} 