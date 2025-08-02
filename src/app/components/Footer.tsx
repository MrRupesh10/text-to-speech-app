'use client';

import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto py-8 backdrop-blur-lg bg-white/10 dark:bg-gray-800/10 border-t border-white/20 dark:border-gray-700/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center">
              <Image
                src="/images/info.svg"
                alt="About"
                width={20}
                height={20}
                className="mr-2"
              />
              About
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              A modern text-to-speech converter with customizable voice settings and real-time preview.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center">
              <Image
                src="/images/features.svg"
                alt="Features"
                width={20}
                height={20}
                className="mr-2"
              />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/features" 
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/templates" 
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link 
                  href="/history" 
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  History
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center">
              <Image
                src="/images/heart.svg"
                alt="Connect"
                width={20}
                height={20}
                className="mr-2"
              />
              Connect
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-300">
                <a href="mailto:support@texttospeech.app" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  support@texttospeech.app
                </a>
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                Follow us on Twitter
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                Join our Discord
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Text to Speech App. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 