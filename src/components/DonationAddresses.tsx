import { useState } from 'react';
import { FaBitcoin } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import Image from 'next/image';
import { useLanguage } from '@/i18n/context';
import { motion, AnimatePresence } from 'framer-motion';

interface DonationAddress {
  name: string;
  address: string;
  icon: React.ReactNode;
  color: string;
  description: {
    en: string;
    zh: string;
  };
}

const donationAddresses: DonationAddress[] = [
  {
    name: 'BTC',
    address: 'bc1qglxmlv8s52sy3e7cr3yv4rky68sregqdqfkau9',
    // icon: <FaBitcoin className="w-6 h-6" />,
    icon: <Image src="/chains/btc.svg" width={24} height={24} alt="PEP" className="w-6 h-6" />,
    color: '#F7931A',
    description: {
      en: 'Bitcoin - The original cryptocurrency',
      zh: '比特币 - 最早的加密货币',
    },
  },
  {
    name: 'SOL',
    address: 'G9z2UMjmm8cLGVojAFMinbSKFW8vANPVk28cmeuqYaCe',
    // icon: <SiSolana className="w-6 h-6" />,
    icon: <Image src="/chains/solana.svg" width={24} height={24} alt="PEP" className="w-6 h-6" />,
    color: '#E669B8',
    description: {
      en: 'Solana - Fast, secure, and censorship resistant',
      zh: 'Solana - 快速、安全、抗审查',
    },
  },
  {
    name: 'PEP',
    address: 'PsErj5YaWTLw5eTq88UFDZvma8kaoqESzz',
    icon: <Image src="/chains/pep.svg" width={24} height={24} alt="PEP" className="w-6 h-6" />,
    color: '#04D180',
    description: {
      en: 'Pepecoin - Fully decentralized and secure blockchain for Pepe',
      zh: 'Pepecoin - 完全去中心化且安全的 Pepe 区块链',
    },
  },
];

export default function DonationAddresses() {
  const { language } = useLanguage();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-pixel mb-4">
        {language === 'en' ? 'Other Chain Support' : '其他链打赏'}
      </h3>
      <div className="space-y-3">
        {donationAddresses.map((donation) => (
          <motion.div
            key={donation.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg hover:bg-gray-700/50 transition-all duration-300 relative group overflow-hidden"
            style={{ '--donation-color': donation.color } as any}
            onMouseEnter={() => setHoveredAddress(donation.address)}
            onMouseLeave={() => setHoveredAddress(null)}
          >
            {/* Hover Effect Background */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
            />

            <div className="flex items-center gap-3 relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-[var(--donation-color)] transition-all duration-300"
              >
                {donation.icon}
              </motion.div>
              <div className="flex flex-col max-w-[256px]">
                <span className="font-sans font-bold">{donation.name}</span>
                <span className="text-sm text-gray-400 font-sans">
                  {donation.description[language]}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCopy(donation.address)}
              className="relative px-3 py-1.5 bg-gray-700/50 hover:bg-[var(--donation-color)] hover:text-black rounded font-sans text-sm transition-all duration-300 flex items-center gap-2"
            >
              <span className="truncate max-w-[120px] opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                {hoveredAddress === donation.address ? donation.address : `${donation.address.slice(0, 6)}...${donation.address.slice(-4)}`}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={copiedAddress === donation.address ? 'copied' : 'copy'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {copiedAddress === donation.address
                    ? '✨'
                    : (language === 'en' ? 'Copy' : '复制')}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
