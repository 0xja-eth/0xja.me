'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/i18n/context';
import { FiX, FiGift, FiLoader } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTipJar } from '@/hooks/useTipJar';

interface Token {
  symbol: string;
  address: string;
  decimals: number;
  icon: string;
}

const tokens: Token[] = [
  {
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    icon: '/tokens/eth.svg'
  },
  {
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    icon: '/tokens/usdt.svg'
  },
  {
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    icon: '/tokens/usdc.svg'
  },
  {
    symbol: 'WBTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    icon: '/tokens/wbtc.svg'
  }
];

export default function TipButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');
  const [isPending, setIsPending] = useState(false);
  const { language } = useLanguage();
  const { address, isConnected } = useAccount();

  const {
    sendTip,
    isLoading: isContractLoading,
    error: contractError,
    balance
  } = useTipJar(
    selectedToken?.address || '0x0000000000000000000000000000000000000000',
    amount,
    selectedToken?.decimals || 18
  );

  const handleTip = async () => {
    if (!selectedToken || !amount) return;
    
    try {
      setIsPending(true);
      
      // 发送交易
      const hash = await sendTip();
      
      // 重置状态
      if (hash) {
        setIsModalOpen(false);
        setAmount('');
        setSelectedToken(null);
      }
    } catch (error) {
      console.error('Error tipping:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <FiGift className="w-4 h-4" />
        {language === 'en' ? 'Tip' : '打赏'}
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  {language === 'en' ? 'Send a tip' : '发送打赏'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-500"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {!isConnected ? (
                <div className="text-center">
                  <p className="mb-4">
                    {language === 'en' 
                      ? 'Connect your wallet to send a tip' 
                      : '连接钱包以发送打赏'}
                  </p>
                  <ConnectButton />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {tokens.map((token) => (
                      <button
                        key={token.address}
                        onClick={() => setSelectedToken(token)}
                        className={`flex items-center gap-2 p-3 rounded-lg border ${
                          selectedToken?.address === token.address
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={token.icon}
                          alt={token.symbol}
                          width={24}
                          height={24}
                        />
                        <span className="font-medium">{token.symbol}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {language === 'en' ? 'Amount' : '金额'}
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {balance && (
                      <p className="mt-1 text-sm text-gray-500">
                        {language === 'en' ? 'Balance: ' : '余额：'}
                        {balance.formatted} {balance.symbol}
                      </p>
                    )}
                  </div>

                  {contractError && (
                    <p className="mb-4 text-sm text-red-600">{contractError}</p>
                  )}

                  <button
                    onClick={handleTip}
                    disabled={!selectedToken || !amount || isPending || isContractLoading}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isPending || isContractLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <FiLoader className="w-4 h-4 animate-spin" />
                        {language === 'en' ? 'Processing...' : '处理中...'}
                      </div>
                    ) : (
                      language === 'en' ? 'Send Tip' : '发送打赏'
                    )}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
