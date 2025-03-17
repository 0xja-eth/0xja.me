'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage } from '@/i18n/context';
import { BLOG_CHALLENGE_ABI } from '@/contracts/BlogChallenge';
import { parseEther } from 'ethers';
import DynamicBackground from '@/components/DynamicBackground';
import { DungeonMap } from './DungeonMap';
import './crystal-overlay.css';

// Contract addresses
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BLOG_CHALLENGE_ADDRESS;
const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS;

// 类型定义
interface BlogSubmission {
  url: string;
  timestamp: number;  // 提交时间戳（秒）
  cycleIndex: number;  // 第几个周期 (0-based)
}

interface ChallengeForm {
  startTime: string;  // 开始时间
  cycle: string;      // 周期长度（秒）
  numberOfCycles: string;  // 总周期数
  penaltyAmount: string;   // 惩罚金额
}

interface MOCK_DATA_TYPE {
  currentCycle: string;    // 当前周期索引
  participants: string[];  // 参与者列表
  checkSuccess: boolean;   // 是否检查成功
  depositAmount: string;   // 押金金额
  challenger: string;      // 挑战者地址
  currentDeposit: string;  // 当前押金
  challengeForm: ChallengeForm;
  blogUrl: string;
  blogSubmissions: BlogSubmission[];
}

// 示例数据
const MOCK_DATA: MOCK_DATA_TYPE = {
  currentCycle: '2',  // 当前是第3个周期（0-based）
  participants: [
    '0x1234567890123456789012345678901234567890',
    '0x2345678901234567890123456789012345678901',
    '0x3456789012345678901234567890123456789012',
  ],
  checkSuccess: true,
  depositAmount: '100',
  challenger: '0x1234567890123456789012345678901234567890',
  currentDeposit: '50',
  challengeForm: {
    startTime: '2025-03-20T00:00',
    cycle: '604800',        // 一周 = 7 * 24 * 60 * 60 秒
    numberOfCycles: '10',   // 总共10个周期
    penaltyAmount: '100'
  },
  blogUrl: '',
  blogSubmissions: [
    {
      url: 'https://exermon-blog.notion.site/969fb37861c4439e9786d570294d5805',
      timestamp: Math.floor(Date.parse('2025-03-15T10:00:00') / 1000),
      cycleIndex: 2
    },
    {
      url: 'https://exermon-blog.notion.site/Exermon-React-Redux-React-Redux-8ec7b58875e54645b7a19ef2e91692da',
      timestamp: Math.floor(Date.parse('2025-03-14T15:30:00') / 1000),
      cycleIndex: 2
    },
    {
      url: 'https://exermon-blog.notion.site/ZKSync-230026c7777745f7a8619edb22e5f429',
      timestamp: Math.floor(Date.parse('2025-03-13T09:15:00') / 1000),
      cycleIndex: 1
    }
  ]
};

export default function BlogChallenge() {
  const { language } = useLanguage();
  const { address, isConnected } = useAccount();
  
  // Contract reads
  const { data: currentChallengeData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'currentChallenge',
  });

  const { data: currentCycleData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'currentCycle',
  });

  const { data: participantsData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'participants',
  });

  const { data: checkSuccessData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'checkSuccess',
  });

  const { data: depositAmountData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'depositAmount',
  });

  const { data: challengerData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'challenger',
  });

  const { data: currentDepositData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'currentDeposit',
  });

  // Contract writes
  const { writeContractAsync: writeParticipate } = useWriteContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'participate',
  });

  const { writeContractAsync: writeExit } = useWriteContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'exit',
  });

  const { writeContractAsync: writeSubmitBlog } = useWriteContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'submitBlog',
  });

  const { writeContractAsync: writeCreateChallenge } = useWriteContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'setChallenge',
  });

  const { writeContractAsync: writeDepositPenalty } = useWriteContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'depositPenalty',
  });

  // Local states
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewChallenge, setShowNewChallenge] = useState(false);
  const [blogUrl, setBlogUrl] = useState('');
  const [currentCycle, setCurrentCycle] = useState<string>('1');
  const [participants, setParticipants] = useState<string[]>([]);
  const [checkSuccess, setCheckSuccess] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string>('0');
  const [challenger, setChallenger] = useState<string>('');
  const [currentDeposit, setCurrentDeposit] = useState<string>('0');
  const [blogSubmissions, setBlogSubmissions] = useState<BlogSubmission[]>([]);

  // 表单状态
  const [challengeForm, setChallengeForm] = useState<ChallengeForm>({
    startTime: '',
    cycle: '',
    numberOfCycles: '',
    penaltyAmount: '',
  });

  // 博客标题缓存
  const blogTitleCache = new Map<string, { title: string; description?: string }>();

  // 获取博客标题
  async function getBlogMetadata(url: string) {
    // 检查缓存
    if (blogTitleCache.has(url)) {
      return blogTitleCache.get(url)!;
    }

    try {
      const response = await fetch(`/api/blog-title?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      // 只缓存成功获取到的元数据
      if (data.title !== url) {
        blogTitleCache.set(url, data);
      }
      return data;
    } catch (error) {
      console.error('获取博客元数据失败:', error);
      return { title: url };
    }
  }

  // 博客标题组件
  function BlogTitle({ url }: { url: string }) {
    const [metadata, setMetadata] = useState<{ title: string; description?: string }>({ title: url });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let mounted = true;

      async function loadMetadata() {
        try {
          setLoading(true);
          const data = await getBlogMetadata(url);
          
          if (mounted) {
            setMetadata(data);
            setLoading(false);
          }
        } catch (error) {
          if (mounted) {
            setMetadata({ title: url });
            setLoading(false);
          }
        }
      }

      loadMetadata();

      return () => {
        mounted = false;
      };
    }, [url]);

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={`transition-opacity duration-300 ${loading ? 'opacity-60' : 'opacity-100'}`}>
            {metadata.title}
          </span>
          {loading && (
            <span className="animate-spin text-xs opacity-60">⟳</span>
          )}
        </div>
        {metadata.description && (
          <p className="text-xs text-white/50 line-clamp-2">
            {metadata.description}
          </p>
        )}
      </div>
    );
  }

  // 博客状态图标组件
  function StatusIcon({ status }: { status: 'completed' | 'current' | 'upcoming' }) {
    const iconClass = {
      completed: 'bg-gradient-to-br from-purple-400 to-purple-600',
      current: 'bg-gradient-to-br from-purple-300/80 to-purple-500/80',
      upcoming: 'bg-gradient-to-br from-purple-200/30 to-purple-400/30'
    }[status];

    const iconContent = {
      completed: (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      current: (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      upcoming: (
        <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      )
    }[status];

    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconClass} shadow-lg`}>
        {iconContent}
      </div>
    );
  }

  // 时间线连接线组件
  function TimelineConnector({ status }: { status: 'completed' | 'current' | 'upcoming' }) {
    const connectorClass = {
      completed: 'bg-gradient-to-b from-purple-500 to-purple-400',
      current: 'bg-gradient-to-b from-purple-400/50 to-purple-300/50',
      upcoming: 'bg-gradient-to-b from-purple-300/20 to-purple-200/20'
    }[status];

    return (
      <div className={`w-0.5 h-full mx-auto ${connectorClass}`} />
    );
  }

  // 博客提交项组件
  function BlogSubmissionItem({ submission, status }: { 
    submission: BlogSubmission; 
    status: 'completed' | 'current' | 'upcoming';
  }) {
    return (
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <StatusIcon status={status} />
            {status !== 'upcoming' && (
              <TimelineConnector status={status} />
            )}
          </div>
          <div className="flex-1 bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10
            hover:border-purple-500/30 transition-all duration-300 group">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-white/40">
                {new Date(submission.timestamp * 1000).toLocaleString()}
              </div>
              <div className="text-white/90">
                <BlogTitle url={submission.url} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 设置示例数据
  useEffect(() => {
    // 开发环境下加载示例数据
    if (process.env.NODE_ENV === 'development') {
      setCurrentCycle(MOCK_DATA.currentCycle);
      setParticipants(MOCK_DATA.participants);
      setCheckSuccess(MOCK_DATA.checkSuccess);
      setDepositAmount(MOCK_DATA.depositAmount);
      setChallenger(MOCK_DATA.challenger);
      setCurrentDeposit(MOCK_DATA.currentDeposit);
      setBlogSubmissions(MOCK_DATA.blogSubmissions);
    }
  }, []);

  // 从合约更新数据
  useEffect(() => {
    if (!currentChallengeData) return;

    // 设置当前周期
    setCurrentCycle(currentChallengeData.currentCycle.toString());

    // 设置参与者列表（创建新数组以避免只读问题）
    setParticipants([...currentChallengeData.participants]);

    // 设置其他数据
    setCheckSuccess(currentChallengeData.checkSuccess);
    setDepositAmount(currentChallengeData.depositAmount.toString());
    setChallenger(currentChallengeData.challenger);
    setCurrentDeposit(currentChallengeData.currentDeposit.toString());

    // 设置博客提交
    const submissions: BlogSubmission[] = [];
    currentChallengeData.blogSubmissions.forEach((urls, cycleIndex) => {
      // 按时间倒序排列
      urls.forEach((url, urlIndex) => {
        submissions.push({
          url,
          timestamp: Date.now() - ((cycleIndex * urls.length + urlIndex) * 24 * 60 * 60 * 1000),
          cycleIndex,
        });
      });
    });

    // 按时间倒序排列
    submissions.sort((a, b) => b.timestamp - a.timestamp);
    setBlogSubmissions(submissions);
  }, [currentChallengeData]);

  // 检查用户是否是参与者
  const isParticipant = useMemo(() => {
    if (!address || !participants) return false;
    return participants.includes(address as `0x${string}`);
  }, [address, participants]);

  // 处理参与挑战
  const handleParticipate = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await writeParticipate();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理退出挑战
  const handleExit = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await writeExit();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理存入押金
  const handleDepositPenalty = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await writeDepositPenalty();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理提交博客
  const handleSubmitBlog = async () => {
    try {
      setError(null);
      setIsLoading(true);
      if (!blogUrl) {
        throw new Error(language === 'en' ? 'Please enter blog URL' : '请输入博客链接');
      }
      await writeSubmitBlog({
        args: [blogUrl],
      });
      setBlogUrl('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理创建挑战
  const handleCreateChallenge = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // 验证表单
      if (!challengeForm.startTime || !challengeForm.cycle || !challengeForm.numberOfCycles || 
          !challengeForm.penaltyAmount) {
        throw new Error(language === 'en' ? 'Please fill in all fields' : '请填写所有字段');
      }

      const startTimestamp = Math.floor(new Date(challengeForm.startTime).getTime() / 1000);
      const cycle = Number(challengeForm.cycle) * 24 * 60 * 60; // 转换为秒
      const penaltyAmount = parseEther(challengeForm.penaltyAmount);

      await writeCreateChallenge({
        args: [
          BigInt(startTimestamp),
          BigInt(cycle),
          BigInt(challengeForm.numberOfCycles),
          penaltyAmount
        ],
      });

      setShowNewChallenge(false);
      setChallengeForm({
        startTime: '',
        cycle: '',
        numberOfCycles: '',
        penaltyAmount: ''
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen mt-20 relative">
      <DynamicBackground />
      
      {/* 全屏地图容器 */}
      <div className="absolute inset-0 w-full h-full">
        <DungeonMap
          submissions={blogSubmissions}
          currentCycle={Number(currentCycle)}
          avatarUrl="/images/player-avatar.svg"
        />
      </div>

      {/* 右上角状态浮层 */}
      <div className="absolute top-4 right-4 crystal-overlay p-4 w-80">
        <h2 className="crystal-title text-lg mb-4">Challenge Status</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="crystal-text">Current Cycle</span>
            <span className="crystal-text">{currentCycle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="crystal-text">Time Left</span>
            <span className="crystal-text">{currentChallengeData?.numberOfCycles - Number(currentCycle) + 1} weeks</span>
          </div>
          <div className="crystal-progress h-2 mt-2">
            <div 
              className="crystal-progress-bar h-full" 
              style={{ width: `${(Number(currentCycle) / Number(currentChallengeData?.numberOfCycles || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 左上角钱包连接浮层 */}
      <div className="absolute top-4 left-4">
        <ConnectButton />
      </div>

      {/* 底部提交博客浮层 */}
      {isConnected && challenger === address && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 crystal-overlay p-4 w-96">
          <div className="flex space-x-2">
            <input
              type="text"
              value={blogUrl}
              onChange={(e) => setBlogUrl(e.target.value)}
              placeholder={language === 'en' ? 'Enter your blog URL' : '输入博客链接'}
              className="crystal-input flex-1 px-3 py-2"
            />
            <button
              onClick={handleSubmitBlog}
              disabled={isLoading}
              className="crystal-button px-4 py-2 disabled:opacity-50"
            >
              {isLoading ? (language === 'en' ? 'Submitting...' : '提交中...') : (language === 'en' ? 'Submit' : '提交')}
            </button>
          </div>
        </div>
      )}

      {/* 右下角操作浮层 */}
      <div className="absolute bottom-4 right-4">
        {isConnected && !challenger && (
          <div className="crystal-overlay p-4">
            <button
              onClick={() => setShowNewChallenge(true)}
              className="crystal-button px-4 py-2 mb-2 w-full"
            >
              {language === 'en' ? 'Create Challenge' : '创建挑战'}
            </button>
            {isParticipant ? (
              <button
                onClick={handleExit}
                disabled={isLoading}
                className="crystal-button px-4 py-2 w-full"
              >
                {isLoading ? (language === 'en' ? 'Exiting...' : '退出中...') : (language === 'en' ? 'Exit Challenge' : '退出挑战')}
              </button>
            ) : (
              <button
                onClick={handleParticipate}
                disabled={isLoading}
                className="crystal-button px-4 py-2 w-full"
              >
                {isLoading ? (language === 'en' ? 'Joining...' : '加入中...') : (language === 'en' ? 'Join Challenge' : '参与挑战')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 创建挑战弹窗 */}
      {showNewChallenge && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="crystal-overlay p-6 max-w-md">
            <h3 className="crystal-title text-lg mb-4">{language === 'en' ? 'Create New Challenge' : '创建新挑战'}</h3>
            <div className="space-y-4">
              <input
                type="datetime-local"
                value={challengeForm.startTime}
                onChange={(e) => setChallengeForm(prev => ({ ...prev, startTime: e.target.value }))}
                className="crystal-input w-full px-3 py-2"
              />
              <input
                type="number"
                value={challengeForm.cycle}
                onChange={(e) => setChallengeForm(prev => ({ ...prev, cycle: e.target.value }))}
                placeholder={language === 'en' ? 'Cycle Length (days)' : '周期长度（天）'}
                className="crystal-input w-full px-3 py-2"
              />
              <input
                type="number"
                value={challengeForm.numberOfCycles}
                onChange={(e) => setChallengeForm(prev => ({ ...prev, numberOfCycles: e.target.value }))}
                placeholder={language === 'en' ? 'Number of Cycles' : '周期数量'}
                className="crystal-input w-full px-3 py-2"
              />
              <input
                type="number"
                value={challengeForm.penaltyAmount}
                onChange={(e) => setChallengeForm(prev => ({ ...prev, penaltyAmount: e.target.value }))}
                placeholder={language === 'en' ? 'Penalty Amount (USDT)' : '惩罚金额（USDT）'}
                className="crystal-input w-full px-3 py-2"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowNewChallenge(false)}
                className="crystal-button px-4 py-2"
              >
                {language === 'en' ? 'Cancel' : '取消'}
              </button>
              <button
                onClick={handleCreateChallenge}
                disabled={isLoading}
                className="crystal-button px-4 py-2"
              >
                {isLoading ? (language === 'en' ? 'Creating...' : '创建中...') : (language === 'en' ? 'Create' : '创建')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="crystal-overlay p-6 max-w-md">
            <h3 className="crystal-title text-lg mb-4">{language === 'en' ? 'Error' : '错误'}</h3>
            <p className="crystal-text mb-4">{error}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setError(null)}
                className="crystal-button px-4 py-2"
              >
                {language === 'en' ? 'Close' : '关闭'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
