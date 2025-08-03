import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ThemeProvider } from 'next-themes';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Text to Speech App',
  description: 'A modern text-to-speech converter with customizable voice settings',
};

// ClientWrapper needs to be a separate file since we can't mix 'use client' with metadata exports
import { ClientWrapper } from './components/ClientWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
         <ThemeProvider attribute="class" defaultTheme="dark">
        <ClientWrapper>
          {children}
        </ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
