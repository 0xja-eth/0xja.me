'use client';

import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import { BLOG_CHALLENGE_ABI } from '@/contracts/BlogChallenge';
import { DungeonMap } from './DungeonMap';
import { formatEther, parseEther } from 'ethers';
import { useLanguage } from '@/i18n/context';
import './crystal-slider.css';
import { addrEq, addrInclude } from '@/utils/address';
import { motion, AnimatePresence } from 'framer-motion';
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';
import { ContractABIs, useContract, useExplorer } from '@/contracts';
import { ChallengeInfo, ChallengeState } from './page';

export interface BlogSubmission {
  cycle: number;
  title: string;
  description: string;
  url: string;
  timestamp: number;
}

export interface ChallengeProps {
  address: `0x${string}`;
  info: ChallengeInfo;
  state: ChallengeState;
}

export default function Challenge(props: ChallengeProps) {

  const [participants, setParticipants] = useState<string[]>([]);
  const [participantBalances, setParticipantBalances] = useState<bigint[]>([]);
  
  const [blogSubmissions, setBlogSubmissions] = useState<BlogSubmission[]>([]);
  const [shareRatio, setShareRatio] = useState(50); // 默认50%
  const [error, setError] = useState<Error | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    title: '',
    description: '',
    url: ''
  });

  const { language } = useLanguage();
  const { isConnected, chainId, address: userAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { address, abi } = useContract(chainId as number, 'BlogChallenge', props.address);
  const { viewAddress, addressUrl } = useExplorer(chainId as number);

  // 从合约获取数据
  // const { data: info, refetch: refetchInfo } = useReadContract({
  //   address, abi, functionName: 'getInfo',
  // });
  const { data: state, refetch: refetchState } = useReadContract({
    address, abi, functionName: 'getState',
  });

  // useEffect(() => {
  //   if (infoError) {
  //     console.error('Error fetching challenge info:', infoError);
  //     setError(infoError);
  //   }
  // }, [infoError]);

  const [
    id, challenger, startTime, cycle, numberOfCycles, 
    penaltyToken, penaltyAmount, maxParticipants, freeMode
    // participantsCount, blogSubmissionsCount
  ] = props.info ?? [];

  const [
    currentCycle, started, participatable, 
    participantsCount, blogSubmissionsCount,
    deposit, isChallengerApproved
  ] = state ?? props.state ?? [];

  // const { data: currentCycle } = useReadContract({
  //   address, abi, functionName: 'currentCycle',
  // });
  
  // const { data: started } = useReadContract({
  //   address, abi, functionName: 'started',
  // });
  // const { data: participatable } = useReadContract({
  //   address, abi, functionName: 'participatable',
  // });
  // const { data: freeMode } = useReadContract({
  //   address, abi, functionName: 'freeMode',
  // });

  const { data: participantsData } = useReadContracts({
    contracts: Array.from({ length: Number(participantsCount) }, (_, i) => ({
      address, abi, functionName: 'participants', args: [BigInt(i)]
    }) as const)
  });
  useEffect(() => {
    if (!participantsData) return;

    setParticipants(participantsData.map(({result}) => result || ''));
  }, [participantsData]);

  const isParticipant = addrInclude(participants, userAddress || '');
  const isChallenger = addrEq(challenger, userAddress || '');

  const { data: participantBalancesData } = useReadContracts({
    contracts: participants.map((participant) => ({
      address, abi, functionName: 'balanceOf', args: [participant]
    }) as const)
  });
  useEffect(() => {
    if (!participantBalancesData) return;

    setParticipantBalances(participantBalancesData.map(({result}) => result || 0n));
  }, [participantBalancesData]);

  const participantBalancesSum = participantBalances.reduce((a, b) => a + b, 0n);
  const participantPercentages = participantBalances.map(b => Number(b) / Number(participantBalancesSum) * 100);

  const { data: blogSubmissionsData } = useReadContracts({
    contracts: Array.from({ length: Number(blogSubmissionsCount) }, (_, i) => ({
      address,
      abi,
      functionName: 'blogSubmissions',
      args: [BigInt(i)]
    }) as const)
  });
  useEffect(() => {
    if (!blogSubmissionsData) return;

    setBlogSubmissions(blogSubmissionsData.map(({result}) => ({
      cycle: Number(result?.[0]) || 0,
      title: result?.[1] || '',
      description: result?.[2] || '',
      url: result?.[3] || '',
      timestamp: Number(result?.[4]) || 0
    })) || []);
  }, [blogSubmissionsData]);

  // 检查当前周期是否已提交
  const hasSubmittedCurrentCycle = blogSubmissions.some(
    sub => sub.cycle === Number(currentCycle) && sub.url
  );

  // 计算时间相关信息
  const now = Math.floor(Date.now() / 1000);
  const cycleStartTime = Number(startTime);
  const cycleLength = Number(cycle);
  const totalCycles = Number(numberOfCycles);
  const currentCycleIndex = Math.floor((now - cycleStartTime) / cycleLength);
  const nextCycleTime = cycleStartTime + (currentCycleIndex + 1) * cycleLength;
  const timeLeft = nextCycleTime - now;

  // 格式化时间
  const formatTimeLeft = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // 处理参与挑战
  const handleParticipate = async () => {
    if (!isConnected) return;
    try {
      await writeContractAsync({
        address, abi, functionName: 'participate',
        args: [BigInt(shareRatio * 100)] // 转换为基点 (1% = 100)
      });
      await refetchState();
    } catch (error) {
      console.error('Error participating in challenge:', error);
    }
  };

  // 处理博客提交
  const handleSubmit = async () => {
    if (!isConnected) return;
    try {
      await writeContractAsync({
        address, abi, functionName: 'submitBlog',
        args: [submitForm.title, submitForm.description, submitForm.url]
      });
      setIsSubmitModalOpen(false);
      setSubmitForm({ title: '', description: '', url: '' });
      await refetchState();
    } catch (error) {
      console.error('Error submitting blog:', error);
    }
  };

  return (
    <div className="relative" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex gap-6 w-full"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 relative group ${!isHovered ? 'h-fit' : ''}`}
        >
          {/* Challenge Info */}
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold neon-text">
                    Challenge #{id?.toString()}
                  </h3>
                  <div className="relative group">
                    <button
                      onClick={() => viewAddress(address)}
                      className="p-2 rounded-lg bg-black/30 hover:bg-black/50 transition-colors text-gray-400 hover:text-gray-300"
                      title={language === 'en' ? 'View on Explorer' : '在区块链浏览器中查看'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 flex items-center gap-2">
                  {language === 'en' ? 'Challenger' : '挑战者'}: 
                  <div className="relative group flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <Jazzicon diameter={20} seed={jsNumberForAddress(challenger || '')} />
                    </div>
                    <button
                      onClick={() => viewAddress(challenger || '')}
                      className="text-gray-300 hover:text-purple-300 transition-colors"
                    >
                      {challenger?.slice(0, 6)}...{challenger?.slice(-4)}
                    </button>
                  </div>
                </p>
              </div>

              {/* Action Buttons - Always visible */}
              {/* <div className="flex gap-2">
                {!started && isChallenger && (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => writeContractAsync({
                      address, abi, functionName: 'start'
                    })}
                  >
                    {language === 'en' ? 'Start' : '开始'}
                  </button>
                )}
                {participatable && !isParticipant && (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={handleParticipate}
                  >
                    {language === 'en' ? 'Participate' : '参与'}
                  </button>
                )}
                {isParticipant && !hasSubmittedCurrentCycle && (
                  <button
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    onClick={() => setIsSubmitModalOpen(true)}
                  >
                    {language === 'en' ? 'Submit' : '提交'}
                  </button>
                )}
              </div> */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">
                  {language === 'en' ? 'Cycle Length' : '周期长度'}
                </div>
                <div className="text-xl font-bold neon-text">
                  {formatTimeLeft(Number(cycle))}
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">
                  {language === 'en' ? 'Current Cycle' : '当前周期'}
                </div>
                <div className="text-xl font-bold neon-text">
                  {currentCycleIndex + 1} / {totalCycles}
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">
                  {language === 'en' ? 'Participants' : '参与人数'}
                </div>
                <div className="text-xl font-bold neon-text">
                  {participants?.length || 0} / {maxParticipants?.toString()}
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">
                  {language === 'en' ? 'Time Left' : '剩余时间'}
                </div>
                <div className="text-xl font-bold neon-text">
                  {formatTimeLeft(timeLeft)}
                </div>
              </div>
            </div>
          </div>

          {/* Map Section - Only visible when expanded */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-[500px] relative bg-black/30 border-t border-gray-800">
                  <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
                  <DungeonMap
                    submissions={blogSubmissions}
                    currentCycle={Number(currentCycle)}
                    avatarUrl="/images/player-avatar.svg"
                  />
                  <AnimatePresence>
                    {isHovered && isConnected && isChallenger && !hasSubmittedCurrentCycle && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="absolute bottom-4 right-4 pixel-button flex items-center justify-center gap-2"
                      >
                        {language === 'en' ? 'Submit Blog' : '提交博客'}
                      </motion.button>
                    )}
                    {isHovered && isConnected && hasSubmittedCurrentCycle && (
                      <div className="absolute bottom-4 right-4 text-center text-sm text-gray-500 py-2">
                        {language === 'en' ? 'Already submitted for this cycle' : '本周期已提交'}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Participants List - Only visible when expanded */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '288px' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/50 backdrop-blur-sm rounded-lg border border-gray-800 p-4 overflow-hidden"
            >
              <h4 className="text-lg font-bold mb-4 neon-text">
                {language === 'en' ? 'Participants' : '参与者'}
              </h4>
              <div className="space-y-3">
                {participants.filter((_, i) => i < 10).map((participant, index) => (
                  <div key={participant} className="relative overflow-hidden">
                    {/* Progress Bar Background */}
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${participantPercentages[index]}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                    </motion.div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/30 transition-colors relative z-10">
                      <div className="flex-shrink-0">
                        <Jazzicon diameter={24} seed={jsNumberForAddress(participant)} />
                      </div>
                      <div className="flex-1 min-w-0 flex justify-between items-center">
                        <div className="text-sm text-gray-300 truncate">
                          {participant}
                        </div>
                        <div className="text-xs font-medium text-gray-400 ml-2">
                          {participantPercentages[index]?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <AnimatePresence>
                  {isHovered && isConnected && participatable && !isParticipant && !isChallenger && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleParticipate}
                      className="pixel-button flex items-center justify-center gap-2 w-full"
                    >
                      {language === 'en' ? 'Participate' : '参与'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Submit Modal */}
      {isSubmitModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-black/80 p-6 rounded-lg border border-gray-800 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 neon-text">
              {language === 'en' ? 'Submit Blog' : '提交博客'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  {language === 'en' ? 'Title' : '标题'}
                </label>
                <input
                  type="text"
                  value={submitForm.title}
                  onChange={e => setSubmitForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white"
                  placeholder={language === 'en' ? 'Enter blog title' : '输入博客标题'}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  {language === 'en' ? 'Description' : '描述'}
                </label>
                <textarea
                  value={submitForm.description}
                  onChange={e => setSubmitForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white h-24"
                  placeholder={language === 'en' ? 'Enter blog description' : '输入博客描述'}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL</label>
                <input
                  type="url"
                  value={submitForm.url}
                  onChange={e => setSubmitForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white"
                  placeholder={language === 'en' ? 'Enter blog URL' : '输入博客链接'}
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  {language === 'en' ? 'Cancel' : '取消'}
                </button>
                <button
                  onClick={handleSubmit}
                  className="pixel-button"
                  disabled={!submitForm.title || !submitForm.description || !submitForm.url}
                >
                  {language === 'en' ? 'Submit' : '提交'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
