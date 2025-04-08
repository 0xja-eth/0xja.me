import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useLanguage } from '@/i18n/context';
import { BlogSubmission } from './Challenge';
import { useAccount, useWriteContract } from 'wagmi';
import { useContract } from '@/contracts';
import { addrEq, addrInclude } from '@/utils/address';
import SubmitBlogModal from './SubmitBlogModal';

interface DungeonMapProps {
  challengeAddress: `0x${string}`;
  challenger: `0x${string}`;
  participants: `0x${string}`[];
  penaltyAmount: string;
  submissions: Array<{
    cycle: number;
    url: string;
    title: string;
    description: string;
    timestamp: number;
  }>;
  currentCycle: number;
  lastUpdatedCycle: number;
  refetchState: () => any;
  refetchLastUpdatedCycle: () => any;
}

// 模拟数据
const mockSubmissions: BlogSubmission[] = [
  {
    cycle: 1,
    url: 'https://0xja.me/blog/1',
    title: 'Building a Web3 Blog Platform',
    description: 'In this article, I will share my experience of building a decentralized blog platform using Next.js and Solidity. We will explore the challenges and solutions in detail.',
    timestamp: 1712083200, // 2024-04-03
  },
  {
    cycle: 1,
    url: 'https://0xja.me/blog/2',
    title: 'Smart Contract Security Best Practices',
    description: 'A comprehensive guide to securing your smart contracts. Learn about common vulnerabilities and how to prevent them.',
    timestamp: 1712169600, // 2024-04-04
  },
  {
    cycle: 2,
    url: 'https://0xja.me/blog/3',
    title: 'The Future of DeFi',
    description: 'Exploring the latest trends in decentralized finance and what the future holds for this rapidly evolving space.',
    timestamp: 1712256000, // 2024-04-05
  },
  {
    cycle: 2,
    url: 'https://0xja.me/blog/4',
    title: 'Zero Knowledge Proofs Explained',
    description: 'A deep dive into zero knowledge proofs and their applications in blockchain technology. From theory to practice.',
    timestamp: 1712342400, // 2024-04-06
  },
  {
    cycle: 3,
    url: 'https://0xja.me/blog/5',
    title: 'Web3 Gaming: The Next Frontier',
    description: 'Discover the exciting world of Web3 gaming and how it\'s changing the gaming industry.',
    timestamp: 1712428800, // 2024-04-07
  },
  {
    cycle: 3,
    url: 'https://0xja.me/blog/6',
    title: 'NFTs in the Music Industry',
    description: 'How NFTs are revolutionizing the music industry and what this means for artists and fans.',
    timestamp: 1712515200, // 2024-04-08
  }
];

export const DungeonMap: React.FC<DungeonMapProps> = ({
  challengeAddress,
  penaltyAmount,
  submissions,
  participants,
  currentCycle,
  lastUpdatedCycle,
  challenger,
  refetchState,
  refetchLastUpdatedCycle
}) => {
  const { language } = useLanguage();
  const [selectedSubmission, setSelectedSubmission] = useState<typeof submissions[0] | null>(null);

  // submissions = mockSubmissions
  
  const { isConnected, chainId, address: userAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const { address, abi } = useContract(chainId as number, 'BlogChallenge', challengeAddress);

  const isChallenger = addrEq(challenger, userAddress || '');
  const isParticipant = addrInclude(participants, userAddress || '');

  // 检查当前周期是否已提交
  const hasSubmittedCurrentCycle = submissions.some(
    sub => sub.cycle === Number(currentCycle) && sub.url
  );

  // 按周期分组提交记录
  const submissionsByCycle = submissions.reduce((acc, submission) => {
    if (!acc[submission.cycle]) acc[submission.cycle] = [];
    acc[submission.cycle].push(submission);
    return acc;
  }, {} as Record<number, typeof submissions>);

  // 生成所有周期的数组（包括空的周期）
  const allCycles = Array.from({ length: currentCycle }, (_, i) => i + 1);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString(language === 'en' ? 'en-US' : 'zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isConnected) return

    try {
      await writeContractAsync({
        address, abi, functionName: 'updateCycle'
      })
      setTimeout(refetchLastUpdatedCycle, 3000)
    } catch (error) {
      console.error('Error submitting blog:', error)
    } finally {
    }
  }, [isConnected, address, abi])

  return (
    <div className="relative h-full w-full overflow-y-scroll">
      {/* 时间轴主体 */}
      <div className="relative max-w-4xl mx-auto py-8 font-sans">
        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-purple-500/20" />
        
        {allCycles.map((cycle) => {
          const cycleSubmissions = submissionsByCycle[cycle] || [];
          const isCurrentCycle = cycle === currentCycle;
          const isEmpty = cycleSubmissions.length === 0;
          const isNeedUpdate = cycle > lastUpdatedCycle && isEmpty;
          
          return (
            <div key={cycle} className="relative mb-8">
              {/* 周期标记 */}
              <div className="flex items-center justify-center mb-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${isCurrentCycle 
                    ? 'bg-purple-500 text-white' 
                    : isEmpty 
                      ? 'bg-gray-800 text-gray-400' 
                      : 'bg-purple-500/20 text-purple-300'
                  }
                `}>
                  {cycle}
                </div>
              </div>

              {/* 提交列表 */}
              <div className="space-y-4">
                {cycleSubmissions.map((submission, index) => (
                  <motion.div
                    key={submission.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      relative flex items-start gap-4 p-4 rounded-lg
                      ${selectedSubmission?.url === submission.url 
                        ? 'bg-purple-500/20 border border-purple-500/30' 
                        : 'bg-black/20 hover:bg-purple-500/10 border border-white/[0.06] hover:border-purple-500/20'
                      }
                      transition-all cursor-pointer group
                    `}
                    // onClick={() => setSelectedSubmission(submission)}
                  >
                    {/* 日期 */}
                    <div className="flex-shrink-0 w-24 text-xl text-gray-400">
                      {formatDate(submission.timestamp)}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-purple-300 group-hover:text-purple-200 mb-1">
                        {submission.title}
                      </h3>
                      <p className="text-gray-400 text-lg line-clamp-2">
                        {submission.description}
                      </p>
                    </div>

                    {/* 阅读按钮 */}
                    <a
                      href={submission.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 px-3 py-1 text-sm text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 rounded-full transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {language === 'en' ? 'Read' : '阅读'}
                    </a>
                  </motion.div>
                ))}

                {/* 空周期提示 */}
                {isEmpty ? (
                  <div className="relative flex flex-col items-center justify-center p-4">
                    {isCurrentCycle ? 
                      <AnimatePresence>
                        {isChallenger ? (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsSubmitModalOpen(true);
                            }}
                            className="pixel-button flex items-center justify-center gap-2"
                          >
                            {language === 'en' ? 'Submit Blog' : '提交博客'}
                          </motion.button>
                        ) : 
                        <span className="text-gray-500 text-lg italic">
                          {language === 'en' ? 
                            `Waiting for challenger to submit` : 
                            `等待挑战者提交`}
                        </span>
                        }
                      </AnimatePresence> :
                      <span className="text-gray-500 text-lg italic">
                        {language === 'en' ? 
                          `No submission in this cycle, deduct ${penaltyAmount} USDT` : 
                          `本周期无提交，扣除 ${penaltyAmount} USDT`}
                      </span>
                    }
                    {!isCurrentCycle && isParticipant && 
                      <div className="relative flex flex-col items-center justify-center p-4">
                        {isNeedUpdate ? 
                          <AnimatePresence>
                            {isConnected && (
                              <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleUpdate}
                                className="pixel-button flex items-center justify-center gap-2"
                              >
                                {language === 'en' ? 'Claim Rewards' : '领取奖励'}
                              </motion.button>
                            )}
                          </AnimatePresence> : 
                          <span className="text-gray-500 text-lg italic">
                            {language === 'en' ? 
                              `Reward has been distributed` : 
                              `奖励已发放`}
                          </span>
                        }
                      </div>
                    }
                  </div>
                  
                ) : isCurrentCycle && 
                  <div className="relative flex flex-col items-center justify-center p-4">
                    <div className="text-center text-gray-500 text-lg italic">
                      {language === 'en' ? 'Already submitted for this cycle' : '本周期已提交'}
                    </div>
                    <AnimatePresence>
                      {isConnected && isChallenger && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsSubmitModalOpen(true);
                          }}
                          className="pixel-button flex items-center justify-center mt-4 gap-2"
                        >
                          {language === 'en' ? 'Submit Again' : '继续提交'}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>}

                  {/* {isEmpty && !isCurrentCycle && isParticipant && 
                    <div className="relative flex flex-col items-center justify-center p-4">
                      {isNeedUpdate ? 
                        <AnimatePresence>
                          {isConnected && (
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={handleUpdate}
                              className="pixel-button flex items-center justify-center gap-2"
                            >
                              {language === 'en' ? 'Claim Rewards' : '领取奖励'}
                            </motion.button>
                          )}
                        </AnimatePresence> : 
                        <span className="text-gray-500 text-lg italic">
                          {language === 'en' ? 
                            `Reward has been distributed` : 
                            `奖励已发放`}
                        </span>
                      }
                    </div>
                  } */}
              </div>
            </div>
          );
        })}
      </div>

      {/* 选中文章的详细信息 */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              className="bg-[#1A1A1A] rounded-xl border border-white/[0.06] p-6 max-w-2xl w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">
                  {formatDate(selectedSubmission.timestamp)}
                </div>
                <h2 className="text-2xl font-medium text-purple-300 mb-2">
                  {selectedSubmission.title}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {selectedSubmission.description}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  {language === 'en' ? 'Close' : '关闭'}
                </button>
                <a
                  href={selectedSubmission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {language === 'en' ? 'Read Article' : '阅读文章'}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Modal */}
      <SubmitBlogModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setTimeout(refetchState, 3000);
        }}
        challengeAddress={address as `0x${string}`}
      />
    </div>
  );
};
