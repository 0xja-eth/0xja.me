'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chains } from '@/data/chains';
import { Chain } from '@/data/types';
import PlaceholderIcon from './PlaceholderIcon';
import { useLanguage } from '@/i18n/context';
import Image from 'next/image';

export default function ChainMap() {
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const { language } = useLanguage();

  const handleChainClick = (chain: Chain) => {
    setSelectedChain(selectedChain?.name.en === chain.name.en ? null : chain);
  };

  return (
    <div className="relative w-full aspect-[16/9] min-h-[400px] pixel-border p-4 backdrop-blur-sm bg-gray-900/30">
      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-20">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border border-gray-700" />
        ))}
      </div>

      {/* Chain Nodes */}
      {chains.map((chain) => (
        <motion.div
          key={chain.name.en}
          className={`absolute cursor-pointer transition-transform hover:scale-110 ${
            selectedChain?.name.en === chain.name.en ? 'z-20' : 'z-10'
          }`}
          style={{
            left: `${chain.position.x}%`,
            top: `${chain.position.y}%`,
          }}
          onClick={() => handleChainClick(chain)}
        >
          <div
            className={`relative w-12 h-12 rounded-full pixel-border ${
              selectedChain?.name.en === chain.name.en ? 'ring-2 ring-offset-2' : ''
            }`}
            style={{
              backgroundColor: chain.color,
              boxShadow: `0 0 20px ${chain.color}40`,
            }}
          >
            {chain.icon ? (
              <Image
                src={chain.icon}
                alt={chain.name[language]}
                fill
                className="p-2"
              />
            ) : (
              <PlaceholderIcon text={chain.name[language]} />
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-900 rounded-full pixel-border flex items-center justify-center text-xs">
              {chain.level}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Chain Connections */}
      <svg className="absolute inset-0 pointer-events-none z-0">
        <defs>
          <marker
            id="dot"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
          >
            <circle cx="5" cy="5" r="2" fill="currentColor" />
          </marker>
        </defs>
        {chains.map((chain, i) =>
          chains.slice(i + 1).map((nextChain, j) => {
            const distance = Math.sqrt(
              Math.pow(chain.position.x - nextChain.position.x, 2) +
                Math.pow(chain.position.y - nextChain.position.y, 2)
            );
            if (distance < 30) {
              return (
                <line
                  key={`${chain.name.en}-${nextChain.name.en}`}
                  x1={`${chain.position.x}%`}
                  y1={`${chain.position.y}%`}
                  x2={`${nextChain.position.x}%`}
                  y2={`${nextChain.position.y}%`}
                  className="stroke-gray-600"
                  strokeDasharray="4 4"
                  markerStart="url(#dot)"
                  markerEnd="url(#dot)"
                />
              );
            }
            return null;
          })
        )}
      </svg>

      {/* Chain Details */}
      <AnimatePresence>
        {selectedChain && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-sm p-4 pixel-border"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 relative pixel-border rounded-lg overflow-hidden flex-shrink-0">
                {selectedChain.icon ? (
                  <Image
                    src={selectedChain.icon}
                    alt={selectedChain.name[language]}
                    fill
                    className="p-2"
                    style={{ backgroundColor: selectedChain.color }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: selectedChain.color }}
                  >
                    <PlaceholderIcon text={selectedChain.name[language]} size="lg" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2 font-pixel">
                  {selectedChain.name[language]}
                </h3>
                <p className="mb-4 text-gray-300" style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif',
                  fontSize: '1rem',
                  lineHeight: '1.75',
                  letterSpacing: '0.025em'
                }}>
                  {selectedChain.description[language]}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-grow">
                    <div className="h-2 bg-gray-700 pixel-border">
                      <div
                        className="h-full transition-all duration-1000"
                        style={{
                          width: `${selectedChain.level}%`,
                          backgroundColor: selectedChain.color,
                        }}
                      />
                    </div>
                    <div className="text-sm mt-1">
                      Level {selectedChain.level}/100
                    </div>
                  </div>
                  <a
                    href={selectedChain.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-button"
                    style={{
                      backgroundColor: `${selectedChain.color}40`,
                    }}
                  >
                    Visit
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
