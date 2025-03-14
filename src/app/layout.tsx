import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from 'next/font/google';
import "@/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { LanguageProvider } from '@/i18n/context';
import LanguageSwitch from '@/components/LanguageSwitch';
import Navigation from "@/components/Navigation";
import { Providers } from "./providers";

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
  preload: true,
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "0xJA.eth - Web3 Developer & Gaming Enthusiast",
  description: "Web3 developer focused on blockchain technology and game development",
  icons: {
    icon: '/avatar.png',
    shortcut: '/avatar.png',
    apple: '/avatar.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${vt323.variable} dark`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <LanguageProvider>
            <Navigation />
            <LanguageSwitch />
            <main className="flex-1">
              <div className="game-container">
                {children}
              </div>
            </main>
            <footer className="text-center py-4 text-gray-600 text-m font-sans bg-black/50 backdrop-blur-sm">
              <span className="shine-text">🤩 95% made by Windsurf 🤩</span>
            </footer>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
