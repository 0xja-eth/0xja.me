'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage } from '@/i18n/context';
import { CHALLENGE_FACTORY_ABI } from '@/contracts/ChallengeFactory';
import { parseEther } from 'ethers';
import DynamicBackground from '@/components/DynamicBackground';
import Challenge from './Challenge';
import CreateChallengeModal from './CreateChallengeModal';

import './crystal-overlay.css';
import { ContractAddresses, useContract, SupportedChains } from '@/contracts';
import { addrEq } from '@/utils/address';

// 类型定义
interface ChallengeForm {
  startTime: string;  // 开始时间
  cycle: string;      // 周期长度（秒）
  numberOfCycles: string;  // 总周期数
  penaltyAmount: string;   // 惩罚金额
  maxParticipants: string; // 最大参与人数
}

export type ChallengeInfo = [bigint, `0x${string}`, bigint, bigint, bigint, `0x${string}`, bigint, bigint, boolean];
export type ChallengeState = [bigint, boolean, boolean, bigint, bigint, bigint, boolean];

export default function BlogChallenge() {
  const { language } = useLanguage();
  const { isConnected, chainId, address: userAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // 状态
  const [challenges, setChallenges] = useState<`0x${string}`[]>([]);
  const [challengeInfos, setChallengeInfos] = useState<ChallengeInfo[]>([]);
  const [challengeStates, setChallengeStates] = useState<ChallengeState[]>([]);
  const [challengeBalances, setChallengeBalances] = useState<number[]>([]);

  const [filter, setFilter] = useState('all'); // 'all' | 'participating' | 'created'
  const [filterText, setFilterText] = useState('');
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { address, abi, isValidChain } = useContract(chainId as number, 'ChallengeFactory');

  // 从合约获取数据
  const { data: challengeCount, refetch: fetchChallenges } = useReadContract({
    address, abi, functionName: 'challengeCount'
  });

  const { data: challengesData } = useReadContracts({
    contracts: Array.from({ length: Number(challengeCount) }, (_, i) => ({
      address, abi, functionName: 'challenges',
      args: [BigInt(i)]
    }) as const)
  });

  useEffect(() => {
    if (!challengesData) return;

    setChallenges(challengesData.map(d => d.result as `0x${string}`).filter(Boolean));
  }, [challengesData]);

  const { data: challengeInfosData } = useReadContracts({
    contracts: challenges.map(address => ({
      ...useContract(chainId as number, 'BlogChallenge', address), functionName: 'getInfo',
    }) as const)
  })
  useEffect(() => {
    if (!challengeInfosData) return;
    setChallengeInfos(challengeInfosData.map(d => d.result as ChallengeInfo));
  }, [challengeInfosData]);

  const { data: challengeStatesData } = useReadContracts({
    contracts: challenges.map(address => ({
      ...useContract(chainId as number, 'BlogChallenge', address), functionName: 'getState',
    }) as const)
  })
  useEffect(() => {
    if (!challengeStatesData) return;
    setChallengeStates(challengeStatesData.map(d => d.result as ChallengeState));
  }, [challengeStatesData]);

  const { data: challengeBalancesData } = useReadContracts({
    contracts: challenges.map(address => ({
      ...useContract(chainId as number, 'BlogChallenge', address), functionName: 'balanceOf',
      args: [userAddress!]
    }) as const)
  })
  useEffect(() => {
    if (!challengeBalancesData) return;
    setChallengeBalances(challengeBalancesData.map(d => Number(d.result || 0)));
  }, [challengeBalancesData]);

  console.log({challengeCount, challenges, challengeInfos, challengeStates, challengeBalances});

  // 处理滚动加载
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading) return;
      
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollHeight - scrollTop - clientHeight < 100) {
        setIsLoading(true);
        setDisplayCount(prev => prev + 5);
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  // 过滤挑战
  const filteredChallenges = challenges
    .filter((address, i) => {
      if (!address) return false;
      const [, challenger, , , , , penaltyAmount] = challengeInfos?.[i] ?? [];
      const [, isStarted, , , , deposit, isChallengerApproved] = challengeStates?.[i] ?? [];
      
      let flag = true
      switch (filter) {
        case 'all': flag &&= isStarted && isChallengerApproved && deposit >= (penaltyAmount ?? 0n) * 3n; break;
        case 'participating': flag &&= challengeBalances[i] > 0; break;
        case 'created': flag &&= addrEq(challenger, userAddress!); break;
      }

      if (filterText) flag &&= (addrEq(address, filterText) || addrEq(challenger, filterText))

      return flag;
    })
    .slice()
    .reverse()
    .slice(0, displayCount);

  // // 创建新挑战
  // const createChallenge = async (data: any) => {
  //   if (!isConnected) return;
    
  //   try {
  //     await writeContractAsync({
  //       address, abi, functionName: 'createChallenge',
  //       args: [
  //         BigInt(data.startTime),
  //         BigInt(data.cycle),
  //         BigInt(data.numberOfCycles),
  //         ContractAddresses[chainId as number].USDT,
  //         data.penaltyAmount,
  //         BigInt(data.maxParticipants),
  //         true, true
  //       ]
  //     });
      
  //     setIsCreateModalOpen(false);
  //     fetchChallenges();
  //   } catch (error) {
  //     console.error('Error creating challenge:', error);
  //   }
  // };

  return (
    <main className="min-h-screen p-8 pt-20">
      {/* <DynamicBackground /> */}
      {/* Header */}
      {isValidChain ? <>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center font-sans text-xl font-bold">
            <input
              type="text"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              placeholder={language === 'en' ? 'Search by address...' : '输入地址搜索...'}
              className="bg-black/30 px-4 py-2 rounded-lg text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-96"
            />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-purple-500/30 text-purple-300' 
                  : 'bg-black/30 hover:bg-black/50 text-gray-400'
              }`}
            >
              {language === 'en' ? 'All' : '全部'}
            </button>
            <button
              onClick={() => setFilter('participating')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'participating'
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'bg-black/30 hover:bg-black/50 text-gray-400'
              }`}
            >
              {language === 'en' ? 'Participated' : '我参加的'}
            </button>
            <button
              onClick={() => setFilter('created')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'created'
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'bg-black/30 hover:bg-black/50 text-gray-400'
              }`}
            >
              {language === 'en' ? 'Created' : '我发起的'}
            </button>
          </div>

          {/* New Challenge Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="pixel-button flex items-center justify-center gap-2"
          >
            <span>{language === 'en' ? '+ New Challenge' : '创建博客挑战'}</span>
          </button>
        </div>

        {/* 挑战列表 */}
        <div className="space-y-4 mb-8">
          {filteredChallenges.map((address) => {
            if (!address) return null;
            const index = challenges.indexOf(address);
            return (
              <Challenge
                key={address}
                address={address}
                info={challengeInfos[index]}
                state={challengeStates[index]}
              />
            );
          })}
          {isLoading && (
            <div className="text-center py-4 text-gray-400">
              Loading...
            </div>
          )}
        </div>

        {/* Create Challenge Modal */}
        <CreateChallengeModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            fetchChallenges();
            setIsCreateModalOpen(false)
          }}
          // onSubmit={async (data) => {
          //   try {
          //     await createChallenge({
          //       startTime: new Date(data.startTime).getTime() / 1000,
          //       cycle: Number(data.cycle),
          //       numberOfCycles: Number(data.numberOfCycles),
          //       maxParticipants: Number(data.maxParticipants),
          //       penaltyAmount: parseEther(data.penaltyAmount)
          //     })
          //     setIsCreateModalOpen(false)
          //   } catch (e) {
          //     console.error(e)
          //   }
          // }}
        />

      </> : <>
        <div className="mb-6 bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold font-sans text-purple-400 mb-2">
                {language === 'en' ? 'Invalid Network' : '无效网络'}
              </h3>
              <p className="text-gray-400 mb-4 font-sans">
                {language === 'en' 
                  ? 'Please switch to one of the supported networks:'
                  : '请切换到以下支持的网络之一：'
                }
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(ContractAddresses).map(chainId => {
                  const chain = SupportedChains.find(c => c.id === Number(chainId));
                  return chain ? (
                    <div
                      key={chain.id}
                      className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 text-gray-300 flex items-center gap-2 hover:border-purple-500/20 transition-colors"
                    >
                      {chain.icon && (
                        // @ts-ignore
                        <img src={chain.icon.url} alt={chain.name} className="w-5 h-5" />
                      )}
                      <span className="font-sans">{chain.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </>}
    </main>
  );
}
