'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Chain } from '@/data/types';
import { chains } from '@/data/chains';
import { useLanguage } from '@/i18n/context';
import PlaceholderIcon from './PlaceholderIcon';
import { FiX, FiExternalLink, FiMove } from 'react-icons/fi';

export default function ChainMap() {
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [positions, setPositions] = useState(() => 
    Object.fromEntries(chains.map(chain => [
      chain.name, 
      { x: chain.position.x, y: chain.position.y }
    ]))
  );
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (chainName: string, info: { point: { x: number, y: number } }) => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const x = ((info.point.x - container.left) / container.width) * 100;
    const y = ((info.point.y - container.top) / container.height) * 100;

    setPositions(prev => ({
      ...prev,
      [chainName]: { x, y }
    }));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[600px] backdrop-blur-md rounded-lg overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-t from-indigo-500/5 to-transparent" />
        <div className="absolute inset-0 animate-scan-line" />
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-20">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border border-gray-700" />
        ))}
      </div>

      {/* Content Container */}
      <div className="absolute p-8 w-full h-full">
        {/* Chain Nodes */}
        {chains.map((chain) => (
          <motion.div
            key={chain.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={containerRef}
            onDragEnd={(_, info) => handleDragEnd(chain.name, info)}
            className="absolute touch-none"
            style={{ 
              left: `${positions[chain.name].x}%`, 
              top: `${positions[chain.name].y}%`,
              cursor: 'grab'
            }}
          >
            <div
              className="relative group"
            >
              {/* Node Glow */}
              <div 
                className="absolute inset-[-8px] rounded-full animate-pulse-slow group-hover:opacity-100 opacity-50 transition-opacity"
                style={{ 
                  background: `radial-gradient(circle, ${chain.color}40 0%, transparent 70%)` 
                }}
              />
              
              {/* Node Container */}
              <div 
                className="relative w-16 h-16 bg-gray-900/90 backdrop-blur-sm rounded-full p-2 border transition-colors overflow-hidden"
                style={{ 
                  borderColor: `${chain.color}40`,
                  borderWidth: selectedChain?.name === chain.name ? '2px' : '1px'
                }}
                onClick={() => setSelectedChain(chain)}
              >
                {/* Move Icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiMove className="w-6 h-6 text-white" />
                </div>
                
                {/* Scanning Effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-scan-y opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${chain.color}20 50%, transparent 100%)`
                  }}
                />
                
                {/* Chain Icon */}
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  {chain.icon ? (
                    <Image
                      src={chain.icon}
                      alt={chain.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <PlaceholderIcon text={chain.name} />
                  )}
                </div>
              </div>

              {/* Level Badge */}
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border border-gray-700/50"
                style={{
                  background: `linear-gradient(135deg, ${chain.color}40, transparent)`,
                  color: chain.color
                }}
              >
                {chain.level}
              </div>

              {/* Chain Name */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
                <span 
                  className="px-2 py-1 text-sm bg-gray-900/90 backdrop-blur-sm rounded-full border border-gray-700/50"
                  style={{ borderColor: `${chain.color}40` }}
                >
                  {chain.name}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Chain Connections */}
        <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full left-8 top-8">
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
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {chains.map((chain, i) =>
            chains.slice(i + 1).map((nextChain, j) => {
              const distance = Math.sqrt(
                Math.pow(positions[chain.name].x - positions[nextChain.name].x, 2) +
                Math.pow(positions[chain.name].y - positions[nextChain.name].y, 2)
              );
              
              if (distance < 30) {
                return (
                  <line
                    key={`${chain.name}-${nextChain.name}`}
                    x1={`${positions[chain.name].x}%`}
                    y1={`${positions[chain.name].y}%`}
                    x2={`${positions[nextChain.name].x}%`}
                    y2={`${positions[nextChain.name].y}%`}
                    className="stroke-gray-600"
                    strokeDasharray="4 4"
                    markerStart="url(#dot)"
                    markerEnd="url(#dot)"
                    filter="url(#glow)"
                  />
                );
              }
              return null;
            })
          )}
        </svg>
      </div>

      {/* Chain Details Modal */}
      <AnimatePresence>
        {selectedChain && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 z-20 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50"
            style={{ borderColor: `${selectedChain.color}40` }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${selectedChain.color}20, transparent)` }}
              >
                {selectedChain.icon ? (
                  <Image
                    src={selectedChain.icon}
                    alt={selectedChain.name}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlaceholderIcon text={selectedChain.name} size="lg" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-medium">
                    {selectedChain.name}
                  </h3>
                  <a
                    href={selectedChain.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    <FiExternalLink />
                  </a>
                </div>
                <p className="text-gray-400 mb-3">
                  {selectedChain.description[language]}
                </p>
                <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000"
                    style={{ 
                      width: `${selectedChain.level}%`,
                      background: `linear-gradient(90deg, ${selectedChain.color}40, ${selectedChain.color}80)`
                    }}
                  />
                </div>
                <div className="text-sm mt-1 text-gray-400">
                  Level {selectedChain.level}/100
                </div>
              </div>
              <button
                onClick={() => setSelectedChain(null)}
                className="text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
