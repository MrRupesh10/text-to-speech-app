'use client';

import { useTheme } from 'next-themes';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';



interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function Navbar({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);


  return (
  <nav className="fixed top-0 left-0 right-0 z-50  bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20">
<div className="flex items-center h-16">
        <div className="fixed left-0 flex items-center h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg z-10 border-r border-gray-200/20 dark:border-gray-700/20">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 mx-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <Link 
            href="/" 
            className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500 transition-all duration-200 pr-6"
          >
            Text to Speech
          </Link>
        </div>
        
        <div className={`flex items-center justify-end w-full px-4 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-80' : 'ml-64'}`}>
          <div className="flex items-center space-x-6 ml-auto mr-6">
            <Link 
              href="/features" 
              className="relative group px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
            >
              <span className="relative z-10 font-medium">Features</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              <span className="absolute inset-0 rounded-lg bg-purple-100 dark:bg-purple-900/30 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Link>
            <Link 
              href="/templates" 
              className="relative group px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
            >
              <span className="relative z-10 font-medium">Templates</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              <span className="absolute inset-0 rounded-lg bg-purple-100 dark:bg-purple-900/30 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Link>
            <Link 
              href="/history" 
              className="relative group px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
            >
              <span className="relative z-10 font-medium">History</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              <span className="absolute inset-0 rounded-lg bg-purple-100 dark:bg-purple-900/30 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Link>
            <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-6 ml-2">
           <button
  onClick={() => setTheme('light')}
  className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
    theme === 'light' 
      ? 'bg-white/10 text-purple-600 ring-1 ring-purple-400'  // 👈 More subtle
      : 'text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-500/20'
  }`}
  aria-label="Light Mode"
>


                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
          
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
  mounted && theme === 'dark'
    ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 ring-2 ring-purple-400'
    : 'text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-500/20'
}`}

                aria-label="Dark Mode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 