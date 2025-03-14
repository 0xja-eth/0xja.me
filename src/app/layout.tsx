import type { Metadata } from "next";
import { Press_Start_2P, Inter } from 'next/font/google';
import "@/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { LanguageProvider } from '@/i18n/context';
import LanguageSwitch from '@/components/LanguageSwitch';
import Navigation from "@/components/Navigation";
import { Providers } from "./providers";

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "0xJA.eth - Web3 Developer & Gaming Enthusiast",
  description: "Web3 developer focused on blockchain technology and game development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${pressStart2P.variable} ${inter.variable}`}>
        <Providers>
          <LanguageProvider>
            <Navigation />
            <LanguageSwitch />
            <main className="game-container font-pixel">
              {children}
            </main>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
