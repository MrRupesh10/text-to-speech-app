'use client';

import React, { createContext, useState, useContext } from 'react';

interface AppContextType {
  text: string;
  setText: (text: string) => void;
}

const AppContext = createContext<AppContextType>({
  text: '',
  setText: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState('');

  return (
    <AppContext.Provider value={{ text, setText }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
} 