import { useState, useMemo, useCallback, useEffect } from 'react'
import { useLanguage } from '@/i18n/context';
import { AnimatePresence, motion } from 'framer-motion'
import { ContractAddresses, useContract } from '@/contracts';
import { useAccount, useBalance, useChains, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { formatUnits, parseEther, parseUnits } from 'ethers/utils';
import { ERC20_ABI } from '@/contracts/ERC20';
import { BLOG_CHALLENGE_ABI } from '@/contracts/BlogChallenge';

interface CreateChallengeModalProps {
  isOpen: boolean
  onClose: () => void
}

// 预设的周期选项（以秒为单位）
const CYCLE_OPTIONS = [
  { value: '259200', label: { en: '3 Days', zh: '3天' } },
  { value: '604800', label: { en: '1 Week', zh: '1周' } },
  { value: '1209600', label: { en: '2 Weeks', zh: '2周' } },
  { value: '2592000', label: { en: '1 Month', zh: '1个月' } }
]

// 预设的周期数选项
const CYCLE_COUNT_OPTIONS = [
  { value: '4', label: { en: '4 Cycles', zh: '4个周期' } },
  { value: '8', label: { en: '8 Cycles', zh: '8个周期' } },
  { value: '12', label: { en: '12 Cycles', zh: '12个周期' } }
]

// 预设的最大参与人数选项
const MAX_PARTICIPANTS_OPTIONS = [
  { value: '3', label: { en: '3 People', zh: '3人' } },
  { value: '5', label: { en: '5 People', zh: '5人' } },
  { value: '10', label: { en: '10 People', zh: '10人' } }
]

// 预设的保证金选项（USDT）
const PENALTY_OPTIONS = [
  { value: '10', label: { en: '10 USDT', zh: '10 USDT' } },
  { value: '20', label: { en: '20 USDT', zh: '20 USDT' } },
  { value: '50', label: { en: '50 USDT', zh: '50 USDT' } },
  { value: '100', label: { en: '100 USDT', zh: '100 USDT' } }
]

const DefaultForm = {
  startTime: new Date().toISOString(),
  cycle: CYCLE_OPTIONS[0].value,
  numberOfCycles: CYCLE_COUNT_OPTIONS[0].value,
  maxParticipants: MAX_PARTICIPANTS_OPTIONS[0].value,
  penaltyAmount: PENALTY_OPTIONS[0].value,
}

export default function CreateChallengeModal({ isOpen, onClose }: CreateChallengeModalProps) {
  const { language } = useLanguage()
  const [step, setStep] = useState(1) // 1: Create, 2: Approve, 3: Deposit
  // const [loading, setLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [form, setForm] = useState(DefaultForm)

  const { isConnected, chainId, address: userAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // const chains = useChains()
  // const chainData = chains.find(chain => chain.id === chainId)
  // const isTestnet = chainData?.testnet

  const { address, abi } = useContract(chainId as number, 'ChallengeFactory');
  const { address: testTokenAddress, abi: testTokenAbi } = useContract(chainId as number, 'TestToken');

  const [createTxHash, setCreateTxHash] = useState<`0x${string}`>()
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}`>()
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}`>()

  const { data: createReceipt } = useWaitForTransactionReceipt({
    hash: createTxHash,
  })
  
  const challengeCreatedEvent = createReceipt?.logs ? createReceipt.logs[createReceipt.logs.length - 1] : null
  const challengeAddress = (challengeCreatedEvent?.topics ? `0x${challengeCreatedEvent.topics[2]?.slice(-40)}` : null) as `0x${string}`

  if (createReceipt) {
    console.log("createReceipt", createReceipt, challengeCreatedEvent, challengeAddress)
  }

  // 计算挑战的开始和结束时间
  const startDate = useMemo(() => {
    const date = new Date(form.startTime)
    date.setHours(0, 0, 0, 0) // 设置为当地时间的0点

    return date
  }, [form.startTime])

  const endDate = useMemo(() => {
    return new Date(startDate.getTime() + Number(form.cycle) * Number(form.numberOfCycles) * 1000)
  }, [startDate, form.cycle, form.numberOfCycles])

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: userAddress,
    token: ContractAddresses[chainId as number].USDT
  })
  const balanceValue = balance?.value
  const balanceDecimals = balance?.decimals

  const { data: approveAmount } = useReadContract({
    address: challengeAddress,
    abi: BLOG_CHALLENGE_ABI,
    functionName: 'approveAmount',
  })

  const depositAmountInt = Number(form.penaltyAmount) * 3 // 3倍罚金
  const approveAmountInt = Number(form.penaltyAmount) * Number(form.numberOfCycles)

  const createChallenge = useCallback(async (data: typeof DefaultForm) => {
    if (!isConnected) return;
    
    try {
      const date = new Date(data.startTime)
      date.setHours(0, 0, 0, 0) // 设置为当地时间的0点

      const startTime = Math.floor(date.getTime() / 1000)
      const penaltyAmount = parseUnits(data.penaltyAmount, balanceDecimals)

      const txHash = await writeContractAsync({
        address, abi, functionName: 'createChallenge',
        args: [
          BigInt(startTime),
          BigInt(data.cycle),
          BigInt(data.numberOfCycles),
          ContractAddresses[chainId as number].USDT,
          penaltyAmount,
          BigInt(data.maxParticipants),
          true, true
        ]
      });
      setCreateTxHash(txHash)
      
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error
    }
  }, [chainId, isConnected, writeContractAsync]);

  const approveUSDT = useCallback(async () => {
    if (!isConnected) return;
    if (!approveAmount) return;

    try {
      const txHash = await writeContractAsync({
        address: ContractAddresses[chainId as number].USDT,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [
          challengeAddress,
          approveAmount
        ]
      });
      setApproveTxHash(txHash)
    } catch (error) {
      console.error('Error approving USDT:', error);
      throw error
    }
  }, [chainId, isConnected, writeContractAsync, challengeAddress, approveAmount]);

  const depositPenalty = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      const txHash = await writeContractAsync({
        address: challengeAddress, 
        abi: BLOG_CHALLENGE_ABI,
        functionName: 'depositPenalty',
      });
      setDepositTxHash(txHash)
    } catch (error) {
      console.error('Error depositing penalty:', error);
      throw error
    }
  }, [chainId, isConnected, writeContractAsync, challengeAddress]);

  const mintTestToken = useCallback(async () => {
    if (!isConnected || !testTokenAddress) return;
    
    try {
      const txHash = await writeContractAsync({
        address: testTokenAddress,
        abi: testTokenAbi,
        functionName: 'mint',
        args: [
          parseEther('100000')
        ]
      } as const);
      console.log('Test token minted:', txHash)

      setTimeout(refetchBalance, 3000);
    } catch (error) {
      console.error('Error minting test token:', error);
      throw error
    }
  }, [chainId, isConnected, writeContractAsync, testTokenAddress, testTokenAbi, userAddress]);

  const close = useCallback(() => {
    setIsCreating(false)
    setStep(1)
    setCreateTxHash(undefined)
    setApproveTxHash(undefined)
    setDepositTxHash(undefined)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isCreating) return
    
    switch (step) {
      case 1:
        if (!createTxHash) createChallenge(form).catch(() => setIsCreating(false))
        else setStep(2)
        break
      case 2:
        if (!approveTxHash) approveUSDT().catch(() => setIsCreating(false))
        else setStep(3)
        break
      case 3:
        if (!depositTxHash) depositPenalty().catch(() => setIsCreating(false))
        else close()
        break
    }
 }, [
  isCreating, createTxHash, approveTxHash, depositTxHash, step, 
  createChallenge, approveUSDT, depositPenalty
])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
  }, [form, onClose])

  // 获取日期选项
  const dateOptions = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextMonday = new Date(today)
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7))

    const nextMonthFirst = new Date(today)
    nextMonthFirst.setMonth(nextMonthFirst.getMonth() + 1)
    nextMonthFirst.setDate(2)

    return [
      { value: tomorrow.toISOString().split('T')[0], label: { en: 'Tomorrow', zh: '明天' } },
      { value: nextMonday.toISOString().split('T')[0], label: { en: 'Next Monday', zh: '下周一' } },
      { value: nextMonthFirst.toISOString().split('T')[0], label: { en: 'Next Month 1st', zh: '下月1日' } }
    ]
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1A1A1A] rounded-xl border border-white/[0.06] shadow-2xl w-full max-w-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Mac Window Title Bar */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] bg-black/30">
              <div className="flex gap-2">
                <button 
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110 transition-all flex items-center justify-center group"
                >
                  <svg className="w-2 h-2 text-[#000000] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E] flex items-center justify-center group">
                  <svg className="w-2 h-2 text-[#000000] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 12H4" />
                  </svg>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#28C840] flex items-center justify-center group">
                  <svg className="w-2 h-2 text-[#000000] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-400 ml-2 flex-1 text-center select-none">
                {language === 'en' ? 'Create New Challenge' : '创建新挑战'}
              </div>
              <div className="w-16" />
            </div>
            
            {/* Content Area */}
            <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar font-sans text-xl">
              <form onSubmit={handleSubmit} className="relative">
                {/* Start Date */}
                <div className="bg-black/10 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="text-lg text-gray-400">
                      {language === 'en' ? 'Start Date' : '开始日期'}
                    </div>
                    <div className="group relative">
                      <button
                        type="button"
                        className="w-5 h-5 rounded-full bg-black/20 hover:bg-purple-500/20 flex items-center justify-center transition-all"
                      >
                        <span className="text-gray-400 text-sm">?</span>
                      </button>
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-2 rounded-lg bg-black/90 text-sm text-gray-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        {language === 'en'
                        ? 'Challenge starts at 00:00 (midnight) in your local timezone'
                        : '挑战从您所在时区的 00:00（午夜）开始'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {dateOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, startTime: option.value }))}
                        className={`p-1 rounded-lg border text-lg transition-all ${
                          form.startTime === option.value
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                            : 'bg-black/20 border-white/5 text-gray-400 hover:bg-purple-500/10'
                        }`}
                      >
                        {option.label[language === 'en' ? 'en' : 'zh']}
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="date"
                      value={form.startTime.split('T')[0]}
                      onChange={e => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full bg-black/20 py-1 px-2.5 rounded-lg border border-white/5 text-gray-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      required
                    />
                  </div>               
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="text-lg text-gray-400">
                        {language === 'en' ? 'Cycle Length' : '周期长度'}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {CYCLE_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, cycle: option.value }))}
                          className={`p-1 rounded-lg border text-lg transition-all ${
                            form.cycle === option.value
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                              : 'bg-black/20 border-white/5 text-gray-400 hover:bg-purple-500/10'
                          }`}
                        >
                          {option.label[language === 'en' ? 'en' : 'zh']}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="text-lg text-gray-400">
                        {language === 'en' ? 'Number of Cycles' : '周期数量'} 
                        <span className="ml-2 text-base text-gray-500">
                          ({language === 'en' ? 'min. 3' : '最少3个'})
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {CYCLE_COUNT_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, numberOfCycles: option.value }))}
                          className={`p-1 rounded-lg border text-lg transition-all ${
                            form.numberOfCycles === option.value
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                              : 'bg-black/20 border-white/5 text-gray-400 hover:bg-purple-500/10'
                          }`}
                        >
                          {option.label[language === 'en' ? 'en' : 'zh']}
                        </button>
                      ))}
                      <input
                        type="number"
                        value={form.numberOfCycles}
                        onChange={e => setForm(prev => ({ ...prev, numberOfCycles: e.target.value }))}
                        min="3"
                        placeholder="3+"
                        className="py-1 px-2.5 rounded-lg border border-white/5 bg-black/20 text-gray-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    {startDate && endDate && (
                      <div className="mt-4 rounded-lg bg-purple-500/10 border border-purple-500/20 p-4">
                        <div className="text-lg text-purple-300 mb-2">
                          {language === 'en' ? 'Challenge Period' : '挑战周期'}
                        </div>
                        <div className="text-gray-300">
                          {startDate.toLocaleString()} → {endDate.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Challenge Settings */}
                <div className="mt-8 bg-black/10 rounded-xl p-5 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="text-lg text-gray-400">
                        {language === 'en' ? 'Max Participants' : '最大参与人数'} 
                        <span className="ml-2 text-base text-gray-500">
                          ({language === 'en' ? 'min. 3' : '最少3个'})
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {MAX_PARTICIPANTS_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, maxParticipants: option.value }))}
                          className={`p-1 rounded-lg border text-lg transition-all ${
                            form.maxParticipants === option.value
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                              : 'bg-black/20 border-white/5 text-gray-400 hover:bg-purple-500/10'
                          }`}
                        >
                          {option.label[language === 'en' ? 'en' : 'zh']}
                        </button>
                      ))}
                      <input
                        type="number"
                        value={form.maxParticipants}
                        onChange={e => setForm(prev => ({ ...prev, maxParticipants: e.target.value }))}
                        min="3"
                        placeholder="3+"
                        className="py-1 px-2.5 rounded-lg border border-white/5 bg-black/20 text-gray-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="text-lg text-gray-400">
                        {language === 'en' ? 'Penalty Amount' : '罚金金额'} 
                        <span className="ml-2 text-base text-gray-500">
                          ({language === 'en' ? 'min. 5 USDT' : '最低5 USDT'})
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {PENALTY_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, penaltyAmount: option.value }))}
                          className={`p-1 rounded-lg border text-lg transition-all ${
                            form.penaltyAmount === option.value
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                              : 'bg-black/20 border-white/5 text-gray-400 hover:bg-purple-500/10'
                          }`}
                        >
                          {option.label[language === 'en' ? 'en' : 'zh']}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2 items-center">
                      <input
                        type="number"
                        value={form.penaltyAmount}
                        onChange={e => setForm(prev => ({ ...prev, penaltyAmount: e.target.value }))}
                        min="5"
                        step="0.1"
                        placeholder="5+"
                        className="flex-1 py-1 px-2.5 rounded-lg border border-white/5 bg-black/20 text-gray-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                      <span className="text-lg text-gray-400">USDT</span>
                    </div>
                  </div>
                  {/* Required Amount Info */}
                  <div className="mt-8 rounded-lg bg-purple-500/10 border border-purple-500/20 p-4">
                    <div className="text-lg text-purple-300 mb-2">
                      {language === 'en' ? 'Required Amount' : '所需金额'}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span className="text-gray-400">{language === 'en' ? 'Penalty' : '罚金'}:</span>
                        <span>{form.penaltyAmount} USDT</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span className="text-gray-400">{language === 'en' ? 'Deposit' : '押金'}:</span>
                        <span>{depositAmountInt} USDT</span>
                      </div>
                      <div className="flex justify-between text-purple-300 font-medium">
                        <span>{language === 'en' ? 'Total Approve' : '总授权'}:</span>
                        <span>{approveAmountInt} USDT</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span className="text-gray-400">{language === 'en' ? 'Your Balance' : '余额'}:</span>
                        <span>{balance ? formatUnits(balanceValue!, balanceDecimals!) : '0'} USDT</span>
                      </div>
                      {/* 如果 testTokenAddress 存在，给一个Mint按钮并给出相应提示：没有测试代币？点击此处进行Mint */}
                      {testTokenAddress && (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={mintTestToken}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            {language === 'en' 
                              ? 'No test tokens? Click here to mint'
                              : '没有测试代币？点击此处进行Mint'
                            }
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col gap-4 mt-8 pt-4 pb-4 border-t border-white/[0.06] bg-[#1A1A1A]">
                  {/* Progress Steps */}
                  <div className="px-4">
                    <div className="flex items-center justify-between">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                            s === step
                              ? 'bg-purple-500 text-white'
                              : s < step
                              ? 'bg-green-500 text-white'
                              : 'bg-white/5 text-gray-400'
                          }`}>
                            {s < step ? '✓' : s}
                          </div>
                          <div className={`text-sm ${
                            s === step ? 'text-purple-300' : s < step ? 'text-green-500' : 'text-gray-400'
                          }`}>
                            {s === 1 && (language === 'en' ? 'Create' : '创建')}
                            {s === 2 && (language === 'en' ? 'Approve' : '授权')}
                            {s === 3 && (language === 'en' ? 'Deposit' : '存入')}
                          </div>
                          {s <= 3 && (
                            <div className={`h-[2px] w-full mt-4 ${
                              s < step ? 'bg-green-500' : 'bg-white/5'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-400 text-center">
                      {step === 1 && (language === 'en' 
                        ? 'Create a new challenge with your settings'
                        : '使用您的设置创建新的挑战'
                      )}
                      {step === 2 && (language === 'en'
                        ? `Approve ${approveAmountInt} USDT for the challenge`
                        : `授权 ${approveAmountInt} USDT 用于挑战`
                      )}
                      {step === 3 && (language === 'en'
                        ? `Deposit ${depositAmountInt} USDT as your stake`
                        : `存入 ${depositAmountInt} USDT 作为您的押金`
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 px-4">
                    <button
                      type="button"
                      onClick={close}
                      className="flex-1 py-1 px-2.5 rounded-lg border border-white/5 text-gray-400 hover:bg-white/5 transition-all"
                      disabled={isCreating}
                    >
                      {language === 'en' ? 'Cancel' : '取消'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-1 px-2.5 rounded-lg bg-purple-500 hover:brightness-110 text-black font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {language === 'en' ? 'Processing...' : '处理中...'}
                        </span>
                      ) : (
                        <>
                          {step === 1 && (language === 'en' ? 'Create Challenge' : '创建挑战')}
                          {step === 2 && (language === 'en' ? 'Approve USDT' : '授权 USDT')}
                          {step === 3 && (language === 'en' ? 'Deposit Stake' : '存入押金')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
