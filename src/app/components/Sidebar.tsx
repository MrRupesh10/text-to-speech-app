'use client';

import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, StarIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  isSidebarOpen: boolean; 
  setIsSidebarOpen: (open: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  voices: SpeechSynthesisVoice[];
  history: any[];
  setHistory: (history: any[]) => void;
  templates: { name: string; text: string; }[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

export function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  selectedLanguage,
  setSelectedLanguage,
  voices,
  history,
  setHistory,
  templates,
  selectedVoice,
  setSelectedVoice
}: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { setText } = useAppContext();
  const [isLanguageOpen, setIsLanguageOpen] = useState(true);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(true);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(true);

  return (
    <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
      <div className="p-4 space-y-6">
        
        {/* Language Filter Section */}
<div className="space-y-2">
  <button
    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
    className="flex items-center justify-between w-full text-gray-300 hover:text-white"
  >
    <h3 className="text-lg font-semibold">Language Filter</h3>
    {isLanguageOpen ? (
      <ChevronUpIcon className="h-5 w-5" />
    ) : (
      <ChevronDownIcon className="h-5 w-5" />
    )}
  </button>

  {isLanguageOpen && voices.length > 0 && (
    <select
      value={selectedLanguage}
      onChange={(e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        setSelectedVoice(''); // optional: reset voice when language changes
        setTimeout(() => setSelectedVoice(
          voices.find(v => v.lang.startsWith(lang))?.name || voices[0]?.name || ''
        ), 100); // ensures voice is updated after render
      }}
      className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      {Array.from(new Set(voices.map(v => v.lang.split('-')[0])))
        .sort()
        .map((lang) => (
          <option key={lang} value={lang}>
            {new Intl.DisplayNames(['en'], { type: 'language' }).of(lang) || lang}
          </option>
        ))}
    </select>
  )}
</div>



        {/* Voice Settings Section */}
        <div className="space-y-2">
          <button
            onClick={() => setIsVoiceSettingsOpen(!isVoiceSettingsOpen)}
            className="flex items-center justify-between w-full text-gray-300 hover:text-white"
          >
            <h3 className="text-lg font-semibold">Voice Settings</h3>
            {isVoiceSettingsOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          {isVoiceSettingsOpen && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Voice Selection</h4>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                >
                  {(selectedLanguage === 'all' ? voices : voices.filter(voice => voice.lang.startsWith(selectedLanguage))).map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Voice Quality</h4>
                <select className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600">
                  <option value="high">High Quality</option>
                  <option value="medium">Medium Quality</option>
                  <option value="low">Low Quality</option>
                </select>
              </div>
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Speech Rate</h4>
                <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" 
                  className="w-full bg-gray-700" />
              </div>
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Pitch</h4>
                <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" 
                  className="w-full bg-gray-700" />
              </div>
            </div>
          )}
        </div>

        {/* Templates Section */}
        <div className="space-y-2">
          <button
            onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
            className="flex items-center justify-between w-full text-gray-300 hover:text-white"
          >
            <h3 className="text-lg font-semibold">Quick Templates</h3>
            {isTemplatesOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          {isTemplatesOpen && (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setText(template.text)}
                  className="w-full p-2 text-left rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 text-gray-300"
                >
                  {template.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shortcuts Section */}
        <div className="space-y-2">
          <button
            onClick={() => setIsShortcutsOpen(!isShortcutsOpen)}
            className="flex items-center justify-between w-full text-gray-300 hover:text-white"
          >
            <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
            {isShortcutsOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          {isShortcutsOpen && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Play/Pause</span>
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">Space</kbd>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Stop</span>
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">Esc</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Toggle Sidebar</span>
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">Ctrl + B</kbd>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="space-y-2">
          <button
            onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
            className="flex items-center justify-between w-full text-gray-300 hover:text-white"
          >
            <h3 className="text-lg font-semibold">Recent History</h3>
            {isFavoritesOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          {isFavoritesOpen && (
            <div className="space-y-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 cursor-pointer"
                  onClick={() => {
                    setText(item.text);
                  }}
                >
                  <p className="text-sm line-clamp-2 text-gray-300">{item.text}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newHistory = [...history];
                        newHistory[index].isFavorite = !newHistory[index].isFavorite;
                        setHistory(newHistory);
                      }}
                      className="hover:text-yellow-500 transition-colors"
                    >
                      <StarIcon className={`h-4 w-4 ${item.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 