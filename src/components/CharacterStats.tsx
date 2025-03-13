'use client';

import { useLanguage } from '@/i18n/context';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useTipJar } from '@/hooks/useTipJar';
import { useState } from 'react';
import { FiGift } from 'react-icons/fi';

const stats = [
  {
    name: 'STR',
    value: '28',
    color: 'bg-yellow-500',
  },
  {
    name: 'INT',
    value: '80/80',
    color: 'bg-red-500',
  },
  {
    name: 'AGI',
    value: '60/60',
    color: 'bg-blue-500',
  },
  {
    name: 'DEX',
    value: '90/100',
    color: 'bg-purple-500',
  },
  {
    name: 'LUK',
    value: '85/100',
    color: 'bg-green-500',
  },
];

export default function CharacterStats() {
  const { language } = useLanguage();
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('0.01');
  const { sendTip, isLoading, error } = useTipJar(
    '0x0000000000000000000000000000000000000000',
    amount,
    18
  );

  const handleTip = async () => {
    try {
      await sendTip();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-8 p-6 backdrop-blur-sm bg-black/30 rounded-lg">
      {/* 左侧：立绘和打赏区域 */}
      <div className="w-96 space-y-6">
        {/* 角色立绘 */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
          <img
            src="/avatar_upscale.png"
            alt="Character"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
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
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 pixel-input bg-black/50 border border-white/10 rounded px-3 py-2"
                  step="0.01"
                  min="0"
                />
                <button
                  onClick={handleTip}
                  disabled={isLoading}
                  className="pixel-button bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiGift className="mr-2" />
                  {isLoading
                    ? language === 'en'
                      ? 'Sending...'
                      : '发送中...'
                    : language === 'en'
                    ? 'Send Tip'
                    : '发送打赏'}
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
            </div>
          )}
        </div>
      </div>

      {/* 右侧：状态栏 */}
      <div className="flex-1 space-y-6">
        {stats.map((stat) => (
          <div key={stat.name} className="relative group">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-pixel">{stat.name}</span>
              <span className="font-pixel">{stat.value}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden status-bar">
              <motion.div
                className={`h-full ${stat.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${parseInt(stat.value)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
