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
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setPinned] = useState(false);
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
      onMouseEnter={() => !isPinned && setIsHovered(true)}
      onMouseLeave={() => !isPinned && setIsHovered(false)}
    >
      <motion.div
        className="flex gap-6 w-full"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800/50 relative group hover:border-purple-500/30 transition-all duration-300 ${!isHovered && !isPinned ? 'h-fit shadow-lg' : 'shadow-2xl'}`}
        >
          {/* Pin Button */}
          {isHovered && <button
            onClick={() => setPinned(!isPinned)}
            className={`absolute top-4 right-4 rounded-lg backdrop-blur-sm border w-8 h-8 flex items-center justify-center
              ${isPinned 
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                : 'bg-black/20 text-gray-400 border-gray-700/50 hover:bg-black/40 hover:text-gray-300'} 
              transition-all duration-300 z-50 transform hover:scale-110`}
            title={language === 'en' ? (isPinned ? 'Unpin' : 'Pin') : (isPinned ? '取消固定' : '固定')}
          >
            📌
          </button>}

          {/* Challenge Info */}
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Challenge #{id?.toString()}
                    </h3>
                    <div className="relative group">
                      <button
                        onClick={() => viewAddress(address)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-300 border border-white/10"
                        title={language === 'en' ? 'View on Explorer' : '在区块链浏览器中查看'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* USDT Penalty Amount */}
                  <div className="flex items-center gap-2 bg-[#26A17B]/10 px-3 py-1.5 rounded-full border border-[#26A17B]/30 shadow-[0_0_15px_rgba(38,161,123,0.1)]">
                    <div className="w-5 h-5 rounded-full bg-[#26A17B] flex items-center justify-center shadow-lg">
                      <span className="text-[10px] font-bold text-white">$</span>
                    </div>
                    <span className="text-lg font-bold text-[#26A17B]">
                      {formatEther(penaltyAmount)}
                    </span>
                    <span className="text-sm text-[#26A17B]/80">USDT</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Challenger Info */}
                  <div className="flex items-center gap-2 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <span className="text-gray-400">{language === 'en' ? 'By' : '发起者'}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden ring-2 ring-white/10">
                        <Jazzicon diameter={20} seed={jsNumberForAddress(challenger || '')} />
                      </div>
                      <button
                        onClick={() => viewAddress(challenger || '')}
                        className="text-gray-300 hover:text-purple-300 transition-colors"
                      >
                        {challenger?.slice(0, 6)}...{challenger?.slice(-4)}
                      </button>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="flex items-center gap-3 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">{new Date(Number(startTime) * 1000).toLocaleDateString()}</span>
                    </div>
                    <span className="text-gray-500">→</span>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">
                        {new Date(Number(startTime) * 1000 + Number(cycle) * Number(numberOfCycles) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <AnimatePresence>
              {(isHovered || isPinned) && 
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <div className="text-sm text-gray-400 mb-2 group-hover:text-purple-300 transition-colors">
                      {language === 'en' ? 'Cycle Length' : '周期长度'}
                    </div>
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {formatTimeLeft(Number(cycle))}
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <div className="text-sm text-gray-400 mb-2 group-hover:text-purple-300 transition-colors">
                      {language === 'en' ? 'Current Cycle' : '当前周期'}
                    </div>
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {currentCycleIndex + 1} / {totalCycles}
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <div className="text-sm text-gray-400 mb-2 group-hover:text-purple-300 transition-colors">
                      {language === 'en' ? 'Participants' : '参与人数'}
                    </div>
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {participants?.length || 0} / {maxParticipants?.toString()}
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <div className="text-sm text-gray-400 mb-2 group-hover:text-purple-300 transition-colors">
                      {language === 'en' ? 'Time Left' : '剩余时间'}
                    </div>
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {formatTimeLeft(timeLeft)}
                    </div>
                  </div>
                </div>
              </motion.div>}
            </AnimatePresence>
          </div>
          {/* Only show DungeonMap when expanded */}
          <AnimatePresence>
            {(isHovered || isPinned) && (
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
                    {(isHovered || isPinned) && isConnected && isChallenger && !hasSubmittedCurrentCycle && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="absolute bottom-4 right-4 pixel-button flex items-center justify-center gap-2"
                      >
                        {language === 'en' ? 'Submit Blog' : '提交博客'}
                      </motion.button>
                    )}
                    {(isHovered || isPinned) && isConnected && hasSubmittedCurrentCycle && (
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
          {(isHovered || isPinned) && (
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
                  {(isHovered || isPinned) && isConnected && participatable && !isParticipant && !isChallenger && (
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
