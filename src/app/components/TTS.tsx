'use client';

import React, { useState, useRef } from 'react';

const TTS: React.FC = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-IN');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleSpeak = () => {
    if (!text.trim()) return;

    if (utteranceRef.current) {
      window.speechSynthesis.cancel(); // Stop any current speech
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  };

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Text to Speech</h2>

      <textarea
        className="w-full h-32 p-3 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-4 flex gap-2">
        <select
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en-IN">English (India)</option>
          <option value="hi-IN">Hindi</option>
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
        </select>
      </div>

      <div className="mt-4 flex gap-4">
        <button onClick={handleSpeak} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          🔊 Speak
        </button>
        <button onClick={handlePause} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          ⏸ Pause
        </button>
        <button onClick={handleResume} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          ▶️ Resume
        </button>
        <button onClick={handleStop} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          ⏹ Stop
        </button>
      </div>
    </div>
  );
};

export default TTS;
