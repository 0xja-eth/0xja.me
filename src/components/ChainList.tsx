'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import PlaceholderIcon from './PlaceholderIcon';
import { useState } from 'react';

const chains = [
  { name: 'Bitcoin', icon: '/chains/btc.svg', url: 'https://bitcoin.org', color: '#F7931A' },
  { name: 'Ethereum', icon: '/chains/eth.svg', url: 'https://ethereum.org', color: '#627EEA' },
  { name: 'zkSync', icon: '/chains/zksync.svg', url: 'https://zksync.io', color: '#8C8DFC' },
  { name: 'Base', icon: '/chains/base.svg', url: 'https://base.org', color: '#0052FF' },
  { name: 'Zircuit', icon: null, url: 'https://zircuit.com', color: '#FF4D4D' },
  { name: 'Solana', icon: '/chains/solana.svg', url: 'https://solana.com', color: '#14F195' },
  { name: 'Aptos', icon: '/chains/aptos.svg', url: 'https://aptoslabs.com', color: '#2DD8A7' },
  { name: 'Sui', icon: '/chains/sui.svg', url: 'https://sui.io', color: '#6FBCF0' },
  { name: 'CKB', icon: null, url: 'https://www.nervos.org', color: '#3CC68A' },
  { name: 'Cosmos', icon: '/chains/cosmos.svg', url: 'https://cosmos.network', color: '#2E3148' },
  { name: 'Celestia', icon: '/chains/celestia.svg', url: 'https://celestia.org', color: '#7B2BF9' },
  { name: 'Sonic', icon: null, url: 'https://sonic.ooo', color: '#FF6B4A' }
];

export default function ChainList() {
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  const handleImageError = (chainName: string) => {
    setErrorImages(prev => new Set(prev).add(chainName));
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {chains.map((chain, index) => (
        <motion.a
          key={chain.name}
          href={chain.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex flex-col items-center p-3 pixel-border bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm transition-all group"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative w-12 h-12 mb-2">
            {chain.icon && !errorImages.has(chain.name) ? (
              <Image
                src={chain.icon}
                alt={chain.name}
                fill
                className="object-contain group-hover:scale-110 transition-transform"
                onError={() => handleImageError(chain.name)}
              />
            ) : (
              <PlaceholderIcon text={chain.name} color={chain.color} />
            )}
          </div>
          <span className="text-sm text-center group-hover:text-indigo-400 transition-colors">
            {chain.name}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
