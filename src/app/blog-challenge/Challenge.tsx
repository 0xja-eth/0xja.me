'use client';

import { useEffect, useState } from 'react';
import { useAccount, useBalance, useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import { BLOG_CHALLENGE_ABI } from '@/contracts/BlogChallenge';
import { DungeonMap } from './DungeonMap';
import { formatEther, formatUnits, parseEther } from 'ethers';
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

  const [participants, setParticipants] = useState<`0x${string}`[]>([]);
  const [participantBalances, setParticipantBalances] = useState<bigint[]>([]);
  
  const [blogSubmissions, setBlogSubmissions] = useState<BlogSubmission[]>([]);
  const [shareRatio, setShareRatio] = useState(50); // 默认50%
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
    currentCycle, lastUpdatedCycle, started, participatable, 
    participantsCount, blogSubmissionsCount,
    deposit, isChallengerApproved
  ] = state ?? props.state ?? [];

  const { data } = useBalance({
    address: userAddress,
    token: penaltyToken
  })
  const decimals = data?.decimals

  // const { data: lastUpdatedCycle, refetch: refetchLastUpdatedCycle } = useReadContract({
  //   address, abi, functionName: 'lastUpdatedCycle',
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

    setParticipants(participantsData.map(({result}) => result as `0x${string}`));
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

  // 处理参与挑战
  const handleParticipate = async () => {
    if (!isConnected) return;
    try {
      await writeContractAsync({
        address, abi, functionName: 'participate',
        args: [BigInt(shareRatio * 100)] // 转换为基点 (1% = 100)
      });
      setTimeout(refetchState, 3000);
    } catch (error) {
      console.error('Error participating in challenge:', error);
    }
  };

  const getStatus = () => {
    const [, isStarted, , , , deposit, isChallengerApproved] = state ?? [];
    const [, , , , , , penaltyAmount] = props.info ?? [];

    if (!isStarted) return {
      type: 'ended',
      label: language === 'en' ? 'Ended' : '已结束',
      color: 'text-neutral-400',
      bgColor: 'bg-neutral-400/10',
      borderColor: 'border-neutral-400/20',
      dotColor: 'bg-neutral-400'
    }

    if (!isChallengerApproved) return {
      type: 'waiting-approve',
      label: language === 'en' ? 'Waiting for Approve' : '等待授权',
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20',
      dotColor: 'bg-amber-400'
    }

    if (deposit && deposit < (penaltyAmount ?? 0n) * 3n) return {
      type: 'waiting-deposit',
      label: language === 'en' ? 'Waiting for Deposit' : '等待存入',
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20',
      dotColor: 'bg-orange-400'
    }

    return {
      type: 'active',
      label: language === 'en' ? 'Active' : '进行中',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/20',
      dotColor: 'bg-emerald-400'
    }
  }

  const status = getStatus()

  return (
    <div className="relative cursor-pointer" 
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex gap-6 w-full"
        animate={{
          scale: isHovered && !isExpanded ? 1.01 : 1,
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm rounded-xl overflow-hidden 
            border transition-all duration-300 cursor-pointer select-none
            ${isExpanded 
              ? 'border-purple-500/50 shadow-2xl shadow-purple-500/10' 
              : 'border-gray-800/50 hover:border-purple-500/30 shadow-lg hover:shadow-xl'
            }
          `}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Challenge Info */}
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Challenge #{id?.toString()}
                    </h3>
                    {/* Contract Explorer Link */}
                    <div className="relative group">
                      <button
                        onClick={() => viewAddress(address)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-300 border border-white/10"
                        title={language === 'en' ? 'View Contract on Explorer' : '在区块链浏览器中查看合约'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${status.dotColor}`} />
                      <span className="text-xl font-sans text-gray-400">
                        {status.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* USDT Penalty Amount */}
                  <div className="flex text-xl font-sans items-center gap-2 bg-[#26A17B]/10 px-3 py-1.5 rounded-full border border-[#26A17B]/30 shadow-[0_0_15px_rgba(38,161,123,0.1)]">
                    <div className="w-5 h-5 rounded-full bg-[#26A17B] flex items-center justify-center shadow-lg">
                      <span className="text-base text-white">$</span>
                    </div>
                    <span className="text-xl font-bold text-[#26A17B]">
                      {formatEther(penaltyAmount ?? 0n)}
                    </span>
                    <span className="text-xl font-bold text-[#26A17B]/80">USDT</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="flex gap-4 font-sans">

                  {/* Left Column: Challenger */}
                  <div className="w-96 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="text-gray-400 text-base font-bold mb-2">{language === 'en' ? 'Challenger' : '发起者'}</div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-purple-500/20">
                        <Jazzicon diameter={32} seed={jsNumberForAddress(challenger || '')} />
                      </div>
                      <div className="flex-1">
                        <button
                          onClick={() => viewAddress(challenger || '')}
                          className="text- text-gray-300 hover:text-purple-300 transition-colors"
                        >
                          {challenger?.slice(0, 6)}...{challenger?.slice(-4)}
                        </button>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`h-1.5 w-1.5 rounded-full ${status.dotColor}`} />
                          <span className="text-base text-gray-400">
                            {language === 'en' ? 'Created' : '创建于'} {formatDate(Number(startTime))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column: Timeline */}
                  <div className="w-full bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base text-gray-400">{language === 'en' ? 'Timeline' : '时间线'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-purple-400">
                          {language === 'en' ? 'Cycle' : '周期'} {currentCycleIndex + 1}/{totalCycles}
                        </span>
                        <span className="text-base text-gray-500">·</span>
                        <span className="text-base text-gray-400">{formatTimeLeft(Number(cycle))}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-base text-gray-300">{formatDate(Number(startTime))}</span>
                      </div>
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-green-500/20 to-red-500/20" />
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-base text-gray-300">
                          {formatDate(Number(startTime) + Number(cycle) * Number(numberOfCycles))}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-base">
                      <span className="text-gray-400">{language === 'en' ? 'Current Cycle Time Left' : '当前周期剩余时间'}</span>
                      <span className="text-purple-400 font-medium">{formatTimeLeft(timeLeft)}</span>
                    </div>
                  </div>

                  {/* Participants Info - Only visible when not expanded */}
                  {!isExpanded && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                      <div className="text-base font-bold text-gray-400 mb-2 group-hover:text-purple-300 transition-colors">
                        {language === 'en' ? 'Participants' : '参与者'}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          {participantsCount?.toString() || '0'}/{maxParticipants?.toString()}
                        </div>
                        <div className="flex items-center -space-x-2">
                          {[...Array(3)].map((_, index) => {
                            const participant = participants[index];
                            return (
                              <div
                                key={index}
                                className="relative w-[24px] h-[24px]"
                                style={{ opacity: 1 - index * 0.2 }}
                              >
                                {participant ? (
                                  <Jazzicon
                                    diameter={24}
                                    seed={jsNumberForAddress(participant)}
                                    paperStyles={{ borderRadius: '50%' }}
                                  />
                                ) : (
                                  <div
                                    className="w-[24px] h-[24px] rounded-full bg-gray-700/50"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* <div className="col-span-5 grid grid-rows-1 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">{language === 'en' ? 'Participants' : '参与者'}</span>
                        <span className="text-sm font-medium text-purple-400">
                          {participants.length}/{maxParticipants?.toString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {participants.slice(0, 3).map((participant, i) => (
                            <div
                              key={participant}
                              className="w-6 h-6 rounded-full ring-2 ring-black overflow-hidden"
                              title={viewAddress(participant)}
                            >
                              <Jazzicon diameter={24} seed={jsNumberForAddress(participant)} />
                            </div>
                          ))}
                          {participants.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 ring-2 ring-black flex items-center justify-center">
                              <span className="text-xs text-purple-300">+{participants.length - 3}</span>
                            </div>
                          )}
                        </div>
                        {participatable && !isParticipant && !isChallenger && (
                          <button
                            onClick={handleParticipate}
                            className="px-3 py-1 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
                          >
                            {language === 'en' ? 'Join Now' : '立即参与'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Stats Grid - Only show when expanded */}
            {/* <AnimatePresence>
              {(isHovered || isExpanded) && (
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
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
          {/* Only show DungeonMap when expanded */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="h-[500px] relative bg-black/30 border-t border-gray-800">
                  <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
                  <DungeonMap
                    penaltyAmount={formatUnits(penaltyAmount, decimals)}
                    challengeAddress={props.address}
                    challenger={challenger}
                    participants={participants}
                    submissions={blogSubmissions}
                    currentCycle={Number(currentCycle)}
                    lastUpdatedCycle={Number(lastUpdatedCycle)}
                    refetchState={refetchState}
                    // refetchLastUpdatedCycle={refetchLastUpdatedCycle}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Participants List - Only visible when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '288px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
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
                        <Jazzicon diameter={32} seed={jsNumberForAddress(participant)} />
                      </div>
                      <div className="flex-1 min-w-0 flex justify-between items-center">
                        <div className="text-xl text-gray-300 truncate font-sans">
                          {participant.slice(0, 6)}...{participant.slice(-4)}
                        </div>
                        <div className="text-lg font-medium text-gray-400 ml-2 font-sans">
                          {participantPercentages[index]?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <AnimatePresence>
                  {(isHovered || isExpanded) && isConnected && participatable && !isParticipant && !isChallenger && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleParticipate()
                      }}
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

    </div>
  );
}
