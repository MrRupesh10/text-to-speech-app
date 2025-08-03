'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface VoiceContextType {
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const loadVoices = () => {
      const synthVoices = window.speechSynthesis.getVoices();
      setVoices(synthVoices);
      const firstMatch = synthVoices.find(v => v.lang.startsWith(selectedLanguage));
      if (firstMatch) setSelectedVoice(firstMatch.name);
    };

    if (typeof window !== 'undefined') {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
      loadVoices();
    }
  }, [selectedLanguage]);

  return (
    <VoiceContext.Provider
      value={{
        voices,
        selectedVoice,
        setSelectedVoice,
        selectedLanguage,
        setSelectedLanguage,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error('useVoice must be used within VoiceProvider');
  return context;
};
