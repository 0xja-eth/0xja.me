"use client"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GameController, Code, User, Notebook, EnvelopeSimple, Trophy } from "@phosphor-icons/react";
import ConnectWallet from './ConnectWallet';

const menuItems = [
  { href: "/", label: "Home", icon: User },
  // { href: "/projects", label: "Projects", icon: Code },
  // { href: "/gaming", label: "Gaming", icon: GameController },
  // { href: "/blog", label: "Blog", icon: Notebook },
  // { href: "/contact", label: "Contact", icon: EnvelopeSimple },
  { href: "/blog-challenge", label: "Blog Challenge", icon: Trophy },
] as { href: string, label: string, icon: any }[];

export default function Navigation() {
  const [activeItem, setActiveItem] = useState("/");
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-sm border-b-2 border-white/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="neon-text text-xl">
              0xJA.eth
            </Link>
          </div>
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`menu-item flex items-center gap-2 ${
                      activeItem === item.href ? "neon-text" : "text-gray-300"
                    }`}
                    onClick={() => setActiveItem(item.href)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <ConnectWallet />
            <button
              onClick={toggleMenu}
              className="sm:hidden pixel-button p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? 'Close' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          className="sm:hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`menu-item flex items-center gap-2 ${
                    activeItem === item.href ? "neon-text" : "text-gray-300"
                  }`}
                  onClick={() => setActiveItem(item.href)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <ConnectWallet />
          </div>
        </motion.div>
      )}
    </nav>
  );
}
