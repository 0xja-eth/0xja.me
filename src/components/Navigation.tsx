"use client"

import { useState } from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { GameController, Code, User, Notebook, EnvelopeSimple } from "@phosphor-icons/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage } from '@/i18n/context';

const menuItems = [
  { href: "/", label: "Home", icon: User },
  { href: "/projects", label: "Projects", icon: Code },
  { href: "/gaming", label: "Gaming", icon: GameController },
  { href: "/blog", label: "Blog", icon: Notebook },
  { href: "/contact", label: "Contact", icon: EnvelopeSimple },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      {/* Desktop Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center md:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
                >
                  <item.icon size={20} />
                  <span className="font-pixel text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:block">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="pixel-button bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          >
                            {language === 'en' ? 'Connect Wallet' : '连接钱包'}
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="pixel-button bg-red-500 hover:bg-red-600"
                          >
                            {language === 'en' ? 'Wrong Network' : '错误网络'}
                          </button>
                        );
                      }

                      return (
                        <div className="flex gap-2">
                          <button
                            onClick={openChainModal}
                            className="pixel-button bg-gradient-to-r from-blue-500 to-purple-500"
                          >
                            {chain.name}
                          </button>
                          <button
                            onClick={openAccountModal}
                            className="pixel-button bg-gradient-to-r from-purple-500 to-pink-500"
                          >
                            {account.displayName}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-blue-400"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-black/90 backdrop-blur-sm"
        >
          <div className="px-4 pt-2 pb-3 space-y-3">
            {menuItems.map((item) => {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-4">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="w-full pixel-button bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            >
                              {language === 'en' ? 'Connect Wallet' : '连接钱包'}
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              className="w-full pixel-button bg-red-500 hover:bg-red-600"
                            >
                              {language === 'en' ? 'Wrong Network' : '错误网络'}
                            </button>
                          );
                        }

                        return (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={openChainModal}
                              className="w-full pixel-button bg-gradient-to-r from-blue-500 to-purple-500"
                            >
                              {chain.name}
                            </button>
                            <button
                              onClick={openAccountModal}
                              className="w-full pixel-button bg-gradient-to-r from-purple-500 to-pink-500"
                            >
                              {account.displayName}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
