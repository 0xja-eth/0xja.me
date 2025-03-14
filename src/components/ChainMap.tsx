'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Chain } from '@/data/types';
import { chains } from '@/data/chains';
import { useLanguage } from '@/i18n/context';
import PlaceholderIcon from './PlaceholderIcon';
import { FiX, FiExternalLink } from 'react-icons/fi';

interface Position {
  x: number;
  y: number;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

const NODE_RADIUS = 40; // 节点半径
const MIN_DISTANCE = 120; // 节点之间的最小距离
const CONTAINER_PADDING = 100; // 容器内边距

// 检查新位置是否与现有位置冲突
const checkCollision = (newPos: Position, positions: NodePosition[]): boolean => {
  return positions.some(pos => {
    const distance = Math.sqrt(
      Math.pow(newPos.x - pos.x, 2) + Math.pow(newPos.y - pos.y, 2)
    );
    return distance < MIN_DISTANCE;
  });
};

// 生成随机位置
const generateRandomPosition = (
  containerWidth: number,
  containerHeight: number,
  existingPositions: NodePosition[]
): Position => {
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const position = {
      x: Math.random() * (containerWidth - CONTAINER_PADDING * 2) + CONTAINER_PADDING,
      y: Math.random() * (containerHeight - CONTAINER_PADDING * 2) + CONTAINER_PADDING,
    };

    if (!checkCollision(position, existingPositions)) {
      return position;
    }

    attempts++;
  }

  // 如果找不到合适的位置，返回一个备用位置
  return {
    x: containerWidth / 2,
    y: containerHeight / 2,
  };
};

export default function ChainMap() {
  const { language } = useLanguage();
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [positions, setPositions] = useState<NodePosition[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化节点位置
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const newPositions: NodePosition[] = [];

      chains.forEach(chain => {
        const position = generateRandomPosition(
          containerWidth,
          containerHeight,
          newPositions
        );
        newPositions.push({ ...position, id: chain.name });
      });

      setPositions(newPositions);
    }
  }, []);

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
        {chains.map(chain => {
          const position = positions.find(p => p.id === chain.name);
          if (!position) return null;

          return (
            <motion.div
              key={chain.name}
              className="absolute"
              style={{
                left: position.x - NODE_RADIUS,
                top: position.y - NODE_RADIUS,
              }}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                x: [0, Math.random() * 20 - 10],
                y: [0, Math.random() * 20 - 10],
              }}
              transition={{
                scale: { duration: 0.5 },
                x: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }}
              onClick={() => setSelectedChain(chain)}
            >
              <div className="relative group">
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
                >
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
          );
        })}
      </div>

      {/* Chain Details Modal */}
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
              <p className="text-gray-400 mb-3 font-sans">
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
              <div className="text-lg font-bold mt-1 text-gray-400 font-sans">
              {language === 'en' ? 'Proficiency' : '熟练度'} {selectedChain.level}/100
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
    </div>
  );
}
