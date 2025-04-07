'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/i18n/context';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  const { language } = useLanguage();

  const introduction = language === 'en' ?
    'Blog Challenge is a decentralized platform that helps you build a consistent writing habit through smart contract-powered accountability. Create or join challenges, set your goals, and stay motivated with our unique penalty system.' :
    '博客挑战是一个基于智能合约的去中心化平台，通过监督和惩罚机制帮助你培养持续写作的习惯。创建或加入挑战，设定目标，通过我们独特的惩罚机制保持动力。';
  const steps = language === 'en' ? [
    {
      title: 'Create or Join a Challenge',
      description: 'Click "+ New Challenge" to create your own challenge, or join an existing one by clicking "Join" on any available challenge.'
    },
    {
      title: 'Set Your Goals',
      description: 'When creating a challenge, set the cycle length, number of cycles, and penalty amount. Make sure to choose parameters that motivate you!'
    },
    {
      title: 'Submit Blog Posts',
      description: 'During each cycle, write and submit your blog post. You must submit before the cycle ends to avoid penalties.'
    },
    {
      title: 'Review & Engage',
      description: 'Read and engage with other participants\' blog posts. This creates a supportive community of writers.'
    },
    {
      title: 'Complete Cycles',
      description: 'Continue submitting posts for each cycle. If you miss a cycle, the penalty amount will be distributed among active participants.'
    }
  ] : [
    {
      title: '创建或加入挑战',
      description: '点击"创建博客挑战"来创建你自己的挑战，或者点击现有挑战中的"加入"按钮来参与。'
    },
    {
      title: '设置目标',
      description: '创建挑战时，设置周期长度、周期数量和惩罚金额。请选择能够激励你的参数！'
    },
    {
      title: '提交博客',
      description: '在每个周期内，编写并提交你的博客文章。你必须在周期结束前提交以避免惩罚。'
    },
    {
      title: '阅读与互动',
      description: '阅读并与其他参与者的博客文章互动。这将创建一个互助的写作社区。'
    },
    {
      title: '完成周期',
      description: '继续为每个周期提交文章。如果错过某个周期，惩罚金额将分配给活跃的参与者。'
    }
  ];

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
            className="bg-[#1A1A1A] rounded-xl border border-white/[0.06] shadow-2xl w-full max-w-2xl overflow-hidden"
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
                {language === 'en' ? 'How to Play' : '如何参与'}
              </div>
              <div className="w-16" />
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar font-sans">
              {/* App Introduction */}
              <div className="bg-gradient-to-br from-purple-500/20 to-black/20 rounded-xl p-6 border border-purple-500/20">
                <h2 className="text-xl font-medium text-purple-300 mb-3">
                  {language === 'en' ? 'Blog Challenge' : '博客挑战'}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {introduction}
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-black/30 px-3 py-1.5 rounded-lg text-purple-300 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {language === 'en' ? 'Write Consistently' : '持续写作'}
                  </div>
                  <div className="bg-black/30 px-3 py-1.5 rounded-lg text-purple-300 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {language === 'en' ? 'Community Driven' : '社区驱动'}
                  </div>
                  <div className="bg-black/30 px-3 py-1.5 rounded-lg text-purple-300 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {language === 'en' ? 'Smart Contract Powered' : '智能合约支持'}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-purple-300">{step.title}</h3>
                      <p className="text-gray-400 leading-relaxed mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-6 rounded-lg bg-purple-500/10 border border-purple-500/20 p-4">
                <div className="text-lg text-purple-300 mb-2">
                  {language === 'en' ? 'Important Notes' : '重要提示'}
                </div>
                <ul className="space-y-2 text-gray-400">
                  <li>• {language === 'en' 
                    ? 'Make sure to connect your wallet before participating'
                    : '参与前请确保连接钱包'
                  }</li>
                  <li>• {language === 'en'
                    ? 'All transactions require gas fees on the blockchain'
                    : '所有交易都需要支付区块链gas费用'
                  }</li>
                  <li>• {language === 'en'
                    ? 'Choose your penalty amount carefully - it will be locked in a smart contract'
                    : '请谨慎选择惩罚金额 - 它将被锁定在智能合约中'
                  }</li>
                </ul>
              </div>

              {/* Example Challenge */}
              <div className="rounded-lg bg-black/20 p-4">
                <div className="text-lg text-purple-300 mb-3">
                  {language === 'en' ? 'Example Challenge' : '应用示例'}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {language === 'en'
                        ? 'Challenger must publish at least one technical blog post per week, supervised by participants'
                        : '挑战者每周至少输出一篇技术博客，参与者负责监督'
                      }
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {language === 'en'
                        ? 'Challenge runs for 12 weeks (e.g., May 8, 2023 to July 30, 2023)'
                        : '从2023年5月8日开始，持续12周（2023年7月30日结束）'
                      }
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {language === 'en'
                        ? 'If a post is not published in time, 30 USDT penalty will be distributed equally among participants'
                        : '如果某一周无法成功输出，将扣除挑战者30USDT平分给所有参与者'
                      }
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {language === 'en'
                        ? 'All challenge articles will be displayed on the platform'
                        : '挑战产生的所有文章都将在此展示'
                      }
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-sm text-gray-500 italic">
                    {language === 'en'
                      ? '* Note: In our platform, cycle length, number of cycles, and penalty amount are customizable when creating a challenge.'
                      : '* 注意：在我们的平台中，周期长度、周期数量和惩罚金额都可以在创建挑战时自定义。'
                    }
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-white/[0.06]">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-purple-500 hover:brightness-110 text-black font-medium transition-all"
                >
                  {language === 'en' ? 'Got it!' : '明白了！'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
