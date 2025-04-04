'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage } from '@/i18n/context';
import { CHALLENGE_FACTORY_ABI } from '@/contracts/ChallengeFactory';
import { parseEther } from 'ethers';
import DynamicBackground from '@/components/DynamicBackground';
import Challenge from './Challenge';

import './crystal-overlay.css';
import { ContractAddresses, useContract } from '@/contracts';
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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<ChallengeForm>({
    startTime: '',
    cycle: '',
    numberOfCycles: '',
    penaltyAmount: '',
    maxParticipants: ''
  });

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

  console.log({challenges, challengeInfos, challengeStates, challengeBalances});

  // 过滤挑战
  const filteredChallenges = challenges.filter((address, i) => {
    if (!address) return false;
    const [, challenger] = challengeInfos?.[i] ?? [];
    const [, isStarted] = challengeStates?.[i] ?? [];
    
    let flag = true
    switch (filter) {
      case 'all': flag &&= isStarted; break;
      case 'participating': flag &&= challengeBalances[i] > 0; break;
      case 'created': flag &&= addrEq(challenger, userAddress!); break;
    }

    if (filterText) flag &&= (addrEq(address, filterText) || addrEq(challenger, filterText))

    return flag;
  });
 
  // 创建新挑战
  const handleCreateChallenge = async () => {
    if (!isConnected) return;
    
    try {
      const startTimestamp = Math.floor(new Date(createForm.startTime).getTime() / 1000);
      
      await writeContractAsync({
        address, abi, functionName: 'createChallenge',
        args: [
          BigInt(startTimestamp),
          BigInt(createForm.cycle),
          BigInt(createForm.numberOfCycles),
          ContractAddresses[chainId as number].USDT,
          parseEther(createForm.penaltyAmount),
          BigInt(createForm.maxParticipants),
          true, true
        ]
      });
      
      setIsCreateModalOpen(false);
      fetchChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  return (
    <main className="min-h-screen p-8 pt-20">
      {/* <DynamicBackground /> */}
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold crystal-text">Blog Challenge</h1>
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 mb-6">
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
          {language === 'en' ? 'Participating' : '我参加的'}
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
      </div>

      {/* Create Challenge Button */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-black/50 p-6 rounded-lg hover:bg-black/60 transition flex items-center justify-center w-full"
      >
        <span className="text-xl font-bold crystal-text">+ New Challenge</span>
      </button>

      {/* Create Challenge Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-black/80 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 crystal-text">
              {language === 'en' ? 'Create New Challenge' : '创建新挑战'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 crystal-text">
                  {language === 'en' ? 'Start Time' : '开始时间'}
                </label>
                <input
                  type="datetime-local"
                  value={createForm.startTime}
                  onChange={e => setCreateForm(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full bg-black/50 p-2 rounded crystal-text"
                />
              </div>
              <div>
                <label className="block mb-2 crystal-text">
                  {language === 'en' ? 'Cycle (seconds)' : '周期（秒）'}
                </label>
                <input
                  type="number"
                  value={createForm.cycle}
                  onChange={e => setCreateForm(prev => ({ ...prev, cycle: e.target.value }))}
                  className="w-full bg-black/50 p-2 rounded crystal-text"
                  placeholder="604800 (1 week)"
                />
              </div>
              <div>
                <label className="block mb-2 crystal-text">
                  {language === 'en' ? 'Number of Cycles' : '周期数'}
                </label>
                <input
                  type="number"
                  value={createForm.numberOfCycles}
                  onChange={e => setCreateForm(prev => ({ ...prev, numberOfCycles: e.target.value }))}
                  className="w-full bg-black/50 p-2 rounded crystal-text"
                  placeholder="4"
                />
              </div>
              <div>
                <label className="block mb-2 crystal-text">
                  {language === 'en' ? 'Penalty Amount (USDT)' : '惩罚金额（USDT）'}
                </label>
                <input
                  type="number"
                  value={createForm.penaltyAmount}
                  onChange={e => setCreateForm(prev => ({ ...prev, penaltyAmount: e.target.value }))}
                  className="w-full bg-black/50 p-2 rounded crystal-text"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block mb-2 crystal-text">
                  {language === 'en' ? 'Max Participants' : '最大参与人数'}
                </label>
                <input
                  type="number"
                  value={createForm.maxParticipants}
                  onChange={e => setCreateForm(prev => ({ ...prev, maxParticipants: e.target.value }))}
                  className="w-full bg-black/50 p-2 rounded crystal-text"
                  placeholder="10"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="crystal-button px-4 py-2"
              >
                {language === 'en' ? 'Cancel' : '取消'}
              </button>
              <button
                onClick={handleCreateChallenge}
                className="crystal-button px-4 py-2"
              >
                {language === 'en' ? 'Create' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
