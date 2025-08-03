'use client';

import {ThemeProvider } from 'next-themes';
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
    { name: '💡 Innovation Summary', text: 'Our breakthrough technology revolutionizes renewable energy storage through advanced materials science. Laboratory tests demonstrate 30% higher efficiency than current solutions, with potential applications across multiple industries.' },
    { name: '🎬 Video Script', text: 'In today\'s video, we\'ll be exploring the fascinating world of...' }
];

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');


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
const filteredVoices = voices.filter(voice =>
  voice.lang.toLowerCase().startsWith(selectedLanguage.toLowerCase())
);

  
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
              selectedVoice={selectedVoice}
             setSelectedVoice={setSelectedVoice}
            />
           <div
  className={`flex-1 flex flex-col transition-all duration-300 ${
    isSidebarOpen ? 'ml-80' : 'ml-0'
  }`}
>

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