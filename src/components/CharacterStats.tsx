'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLanguage } from "@/i18n/context";
import { FiGift } from "react-icons/fi";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseUnits } from 'ethers';
import {TOKEN_ADDRESSES, TIP_CONTRACT_ADDRESS} from '@/config/web3';
import {useAccount, useBalance, useWriteContract} from "wagmi";

interface Stat {
  name: string;
  value: number;
  icon: string;
  color: string;
  description: {
    en: string;
    zh: string;
  };
}

interface TokenOption {
  symbol: keyof typeof TOKEN_ADDRESSES;
  decimals: number;
}

interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: {
    str?: number;
    int?: number;
    agi?: number;
    dex?: number;
    luk?: number;
  };
  description: {
    en: string;
    zh: string;
  };
}

const TOKENS: TokenOption[] = [
  { symbol: 'ETH', decimals: 18 },
  { symbol: 'USDT', decimals: 6 },
  { symbol: 'USDC', decimals: 6 },
  { symbol: 'WBTC', decimals: 8 }
];

const equipments: Equipment[] = [
  {
    id: 'keyboard',
    name: 'Mechanical Keyboard',
    type: 'weapon',
    icon: '⌨️',
    rarity: 'epic',
    stats: {
      dex: 15,
      agi: 10
    },
    description: {
      en: 'A high-performance mechanical keyboard enhancing coding speed',
      zh: '高性能机械键盘，提升编码速度'
    }
  },
  {
    id: 'ide',
    name: 'Windsurf IDE',
    type: 'armor',
    icon: '🛡️',
    rarity: 'legendary',
    stats: {
      int: 20,
      dex: 10
    },
    description: {
      en: 'The world\'s first agentic IDE powered by AI',
      zh: '全球首个由AI驱动的智能IDE'
    }
  },
  {
    id: 'coffee',
    name: 'Developer\'s Coffee',
    type: 'accessory',
    icon: '☕',
    rarity: 'rare',
    stats: {
      str: 8,
      int: 5
    },
    description: {
      en: 'Essential companion for coding sessions',
      zh: '编程必备的提神伴侣'
    }
  },
  {
    id: 'algorithm_book',
    name: 'Algorithm Grimoire',
    type: 'weapon',
    icon: '📚',
    rarity: 'epic',
    stats: {
      int: 18,
      luk: 5
    },
    description: {
      en: 'Ancient tome containing algorithmic wisdom',
      zh: '蕴含算法智慧的古老魔典'
    }
  },
  {
    id: 'quantum_chip',
    name: 'Quantum Processor',
    type: 'accessory',
    icon: '🔮',
    rarity: 'legendary',
    stats: {
      int: 15,
      agi: 12,
      luk: 8
    },
    description: {
      en: 'Harness quantum computing power',
      zh: '驾驭量子计算之力'
    }
  },
  {
    id: 'debug_glasses',
    name: 'Debug Specs',
    type: 'armor',
    icon: '👓',
    rarity: 'rare',
    stats: {
      dex: 12,
      int: 8
    },
    description: {
      en: 'Enhance code analysis and bug detection',
      zh: '增强代码分析和调试能力'
    }
  },
  {
    id: 'energy_drink',
    name: 'Binary Boost',
    type: 'accessory',
    icon: '🥤',
    rarity: 'common',
    stats: {
      agi: 8,
      str: 5
    },
    description: {
      en: 'Quick energy boost for coding sprints',
      zh: '编程冲刺时的能量补充'
    }
  },
  {
    id: 'lucky_charm',
    name: 'Debug Duck',
    type: 'accessory',
    icon: '🦆',
    rarity: 'rare',
    stats: {
      luk: 15,
      int: 5
    },
    description: {
      en: 'Your faithful debugging companion',
      zh: '忠实的调试伙伴'
    }
  }
];

const stats: Stat[] = [
  { 
    name: 'HP', 
    value: 85, 
    icon: '❤️', 
    color: '#ff6b6b',
    description: {
      en: 'Endurance for project development and problem-solving',
      zh: '项目开发和解决问题的耐力值，表示在高强度工作下的持久作战能力'
    }
  },
  { 
    name: 'Basic Dev', 
    value: 90, 
    icon: '💻', 
    color: '#4dabf7',
    description: {
      en: 'Proficiency in fundamental programming and system design',
      zh: '基础编程和系统设计能力，包括算法、数据结构和软件架构'
    }
  },
  { 
    name: 'Game Dev', 
    value: 75, 
    icon: '🎮', 
    color: '#51cf66',
    description: {
      en: 'Experience in game development and interactive applications',
      zh: '游戏开发和交互应用经验，专注于用户体验和游戏机制设计'
    }
  },
  { 
    name: 'Web3 Dev', 
    value: 80, 
    icon: '⛓️', 
    color: '#845ef7',
    description: {
      en: 'Blockchain and decentralized application development skills',
      zh: '区块链和去中心化应用开发技能，包括智能合约和DeFi系统'
    }
  },
  { 
    name: 'AI Dev', 
    value: 70, 
    icon: '🤖', 
    color: '#ffd43b',
    description: {
      en: 'Artificial Intelligence and Machine Learning capabilities',
      zh: '人工智能和机器学习能力，专注于AI应用开发和模型训练'
    }
  },
  { 
    name: 'Action', 
    value: 95, 
    icon: '⚡', 
    color: '#ff922b',
    description: {
      en: 'Speed and efficiency in project execution and delivery',
      zh: '项目执行和交付的速度与效率，体现快速行动和决策能力'
    }
  },
];

const RARITY_COLORS = {
  common: '#95a5a6',
  rare: '#3498db',
  epic: '#9b59b6',
  legendary: '#f1c40f'
};

export default function CharacterStats() {
  const { language } = useLanguage();
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<TokenOption>(TOKENS[0]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync } = useWriteContract()

  // 获取选定代币的余额
  const { data: balance } = useBalance({
    address,
    token: selectedToken.symbol === 'ETH' ? undefined : TOKEN_ADDRESSES[selectedToken.symbol] as `0x${string}`,
  });

  const approve = (amount: bigint) =>
      writeContractAsync({
        address: TOKEN_ADDRESSES[selectedToken.symbol] as `0x${string}`,
        abi: [
          {
            name: 'approve',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'spender', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [
              { name: 'success', type: 'bool' }
            ]
          }
        ],
        functionName: 'approve',
        args: [TIP_CONTRACT_ADDRESS, amount],
      })

  const tip = (amount: bigint) =>
      writeContractAsync({
        address: TIP_CONTRACT_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'tip',
            type: 'function',
            stateMutability: 'payable',
            inputs: [
              { name: 'token', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: []
          }
        ],
        functionName: 'tip',
        args: [TOKEN_ADDRESSES[selectedToken.symbol], amount],
        value: selectedToken.symbol === 'ETH' ? amount : 0n
    })

  const handleTip = async () => {
    try {
      setError(null);
      setIsLoading(true);

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error(language === 'en' ? 'Invalid amount' : '无效金额');
      }

      // 检查余额
      const tipAmount = parseUnits(amount, selectedToken.decimals);
      if (balance && tipAmount > balance.value) {
        throw new Error('Insufficient balance');
      }

      if (selectedToken.symbol !== 'ETH') {
        // ERC20 代币需要先授权
        await approve(tipAmount);
      }

      // 发送打赏
      await tip(tipAmount);

      setAmount('');
      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const [animatedStats, setAnimatedStats] = useState<Stat[]>(
    stats.map(stat => ({ ...stat, value: 0 }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats(stats);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const updateTooltipPosition = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipWidth = 192; // w-48 = 12rem = 192px
    const tooltipHeight = 180; // 预估高度
    const padding = 8;

    let x = rect.right + padding;
    let y = rect.top + rect.height / 2;

    // 检查右边界
    if (x + tooltipWidth > window.innerWidth) {
      x = rect.left - tooltipWidth - padding;
    }

    // 检查上下边界
    if (y + tooltipHeight / 2 > window.innerHeight) {
      y = window.innerHeight - tooltipHeight / 2;
    } else if (y - tooltipHeight / 2 < 0) {
      y = tooltipHeight / 2;
    }

    setTooltipPosition({ x, y });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedEquipment) {
        const target = event.target as HTMLElement;
        if (!target.closest('.equipment-item')) {
          setSelectedEquipment(null);
          setTooltipPosition(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedEquipment]);

  return (
    <div className="w-full backdrop-blur-sm bg-gray-900/30">
      <div className="flex gap-8 p-6">
        {/* Character Art and Equipment */}
        <div className="flex flex-col gap-4">
          {/* Character Art */}
          <div className="relative w-72 h-96 overflow-hidden rounded-lg border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent"/>
            <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-t from-indigo-500/10 to-transparent"/>
            <Image
                src="/avatar_upscale.png"
                alt="Character Avatar"
                fill
                className="object-cover z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/50"/>

            {/* Animated light beam */}
            <div className="absolute inset-0 animate-light-beam overflow-hidden">
              <div className="absolute top-0 -left-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-45"/>
            </div>

            {/* Character Level Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 z-20">
              <span className="text-xs font-pixel text-yellow-400">Lv.{Math.floor(stats.reduce((acc, stat) => acc + stat.value, 0) / stats.length)}</span>
            </div>
          </div>

          {/* Equipment */}
          <div className="w-72">
            <h3 className="font-pixel text-sm text-gray-400 mb-3">
              {language === 'en' ? 'Equipment' : '装备'}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {equipments.map((equipment) => (
                <motion.div
                  key={equipment.id}
                  className="equipment-item relative group cursor-pointer"
                  onClick={() => setSelectedEquipment(equipment === selectedEquipment ? null : equipment)}
                  whileHover={{ scale: 1.05 }}
                  style={{ 
                    zIndex: selectedEquipment?.id === equipment.id || equipment.id === selectedEquipment?.id ? 50 : 'auto'
                  }}
                >
                  <div 
                    className={`w-full aspect-square rounded-lg border backdrop-blur-sm flex items-center justify-center relative overflow-hidden group-hover:z-50 ${
                      selectedEquipment?.id === equipment.id ? 'border-white/30' : 'border-white/10'
                    }`}
                    style={{
                      backgroundColor: `${RARITY_COLORS[equipment.rarity]}10`,
                      borderColor: selectedEquipment?.id === equipment.id ? RARITY_COLORS[equipment.rarity] : undefined
                    }}
                  >
                    <span className="text-xl">{equipment.icon}</span>
                    
                    {/* Rarity Indicator */}
                    <div 
                      className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: RARITY_COLORS[equipment.rarity] }}
                    />

                    {/* Hover Effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(45deg, ${RARITY_COLORS[equipment.rarity]}20, transparent)`
                      }}
                    />
                  </div>

                  {/* Equipment Details Tooltip */}
                  {selectedEquipment?.id === equipment.id && (
                    <div className="absolute left-full ml-2 w-64 p-3 rounded-lg bg-gray-900/95 border border-white/10 z-[60]">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xl">{equipment.icon}</span>
                        <div>
                          <h4 className="font-medium text-sm" style={{ color: RARITY_COLORS[equipment.rarity] }}>
                            {equipment.name}
                          </h4>
                          <span className="text-xs text-gray-500 capitalize">{equipment.type}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        {equipment.description[language]}
                      </p>
                      <div className="space-y-1">
                        {Object.entries(equipment.stats).map(([stat, value]) => (
                          <div key={stat} className="flex items-center justify-between text-xs">
                            <span className="uppercase text-gray-500">{stat}</span>
                            <span className="text-green-400">+{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-6">
          <div className="grid gap-6">
            {animatedStats.map((stat) => (
                <motion.div
                    key={stat.name}
                    className="group"
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.5}}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl group-hover:scale-110 transition-transform">{stat.icon}</span>
                    <span className="font-pixel text-sm">{stat.name}</span>
                    <span className="font-pixel text-sm ml-auto">{stat.value}/100</span>
                  </div>
                  <div className="relative h-2 bg-gray-800/50 overflow-hidden rounded-full">
                    <motion.div
                        initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ backgroundColor: stat.color }}
                    className="absolute inset-y-0 left-0 rounded-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-full" />
                  </motion.div>
                </div>
                <div className="mt-1 text-sm text-gray-400 font-sans">
                  {stat.description[language]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tip 区域 */}
      <div className="p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            {language === 'en' ? 'Support Me' : '支持我'}
          </h3>
          <div className="scale-90 origin-right">
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
        </div>

        {isConnected && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 pixel-input bg-black/50 border border-white/10 rounded px-3 py-2"
                  step="0.01"
                  min="0"
                  placeholder={language === 'en' ? 'Amount' : '金额'}
                />
                <select
                  value={selectedToken.symbol}
                  onChange={(e) => setSelectedToken(TOKENS.find(t => t.symbol === e.target.value as keyof typeof TOKEN_ADDRESSES)!)}
                  className="pixel-input bg-black/50 border border-white/10 rounded px-3 py-2"
                >
                  {TOKENS.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleTip}
                disabled={isLoading}
                className="pixel-button bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiGift className="mr-2" />
                {isLoading
                  ? language === 'en'
                    ? 'Sending...'
                    : '发送中...'
                  : language === 'en'
                    ? 'Tip'
                    : '打赏'}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm">
                {error === 'Insufficient balance'
                  ? language === 'en'
                    ? 'Insufficient balance'
                    : '余额不足'
                  : error}
              </p>
            )}
            {balance && (
              <p className="text-sm text-gray-400">
                {language === 'en' ? 'Balance: ' : '余额：'}
                {balance.formatted} {balance.symbol}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
