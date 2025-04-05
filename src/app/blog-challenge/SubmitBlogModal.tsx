import { useState, useCallback } from 'react'
import { useLanguage } from '@/i18n/context';
import { AnimatePresence, motion } from 'framer-motion'
import { useContract } from '@/contracts';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { BLOG_CHALLENGE_ABI } from '@/contracts/BlogChallenge';

interface SubmitBlogModalProps {
  isOpen: boolean
  onClose: () => void
  challengeAddress: `0x${string}`
}

const DefaultForm = {
  title: '',
  description: '',
  url: '',
}

export default function SubmitBlogModal({ isOpen, onClose, challengeAddress }: SubmitBlogModalProps) {
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState(DefaultForm)

  const { isConnected, chainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { abi, isValidChain } = useContract(chainId as number, 'BlogChallenge');

  const [submitTxHash, setSubmitTxHash] = useState<`0x${string}`>()
  const { data: submitReceipt } = useWaitForTransactionReceipt({
    hash: submitTxHash,
  })

  const fetchBlogInfo = useCallback(async (url: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/blog-title?url=${encodeURIComponent(url)}`)
      const data = await response.json()
      
      if (data.title || data.description) {
        setForm(prev => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
        }))
      }
    } catch (error) {
      console.error('Error fetching blog info:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !isValidChain) return

    try {
      setIsSubmitting(true)

      const tx = await writeContractAsync({
        address: challengeAddress,
        abi: BLOG_CHALLENGE_ABI,
        functionName: 'submitBlog',
        args: [form.title, form.description, form.url],
      })

      setSubmitTxHash(tx)
      onClose()
      setForm(DefaultForm)

    } catch (error) {
      console.error('Error submitting blog:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [isConnected, isValidChain, challengeAddress, form, submitReceipt, onClose])

  const close = () => {
    if (!isSubmitting) {
      onClose()
      setForm(DefaultForm)
    }
  }

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
                {language === 'en' ? 'Submit Blog' : '提交博客'}
              </div>
              <div className="w-16" />
            </div>
            
            {/* Content Area */}
            <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar font-sans">
              <form onSubmit={handleSubmit} className="relative space-y-4">
                {/* Blog Information */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg text-gray-400">URL</div>
                    <div className="group relative">
                      <button
                        type="button"
                        className="w-5 h-5 rounded-full bg-black/20 hover:bg-purple-500/20 flex items-center justify-center transition-all"
                      >
                        <span className="text-gray-400 text-sm">?</span>
                      </button>
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-2 rounded-lg bg-black/90 text-sm text-gray-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        {language === 'en'
                          ? 'Enter your blog post URL. Title and description will be auto-filled.'
                          : '输入您的博客文章链接，标题和描述将自动填充。'
                        }
                      </div>
                    </div>
                  </div>
                  <div>
                    <input
                      type="url"
                      value={form.url}
                      onChange={e => {
                        setForm(prev => ({ ...prev, url: e.target.value }))
                        if (e.target.value) fetchBlogInfo(e.target.value)
                      }}
                      className="w-full bg-black/20 py-1 px-2.5 rounded-lg border border-white/5 text-gray-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder={language === 'en' ? 'Enter blog URL' : '输入博客链接'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                  <div className="text-lg text-gray-400">
                      {language === 'en' ? 'Title' : '标题'}
                    </div>
                    {isLoading && (
                      <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-black/20 py-1 px-2.5 rounded-lg border border-white/5 text-gray-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder={language === 'en' ? 'Enter blog title' : '输入博客标题'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                  <div className="text-lg text-gray-400">
                      {language === 'en' ? 'Description' : '描述'}
                    </div>
                  </div>
                  <div className="mt-2">
                    <textarea
                      value={form.description}
                      onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-black/20 py-1 px-2.5 rounded-lg border border-white/5 text-gray-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder={language === 'en' ? 'Enter blog description' : '输入博客描述'}
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 text-lg">
                  <button
                    type="button"
                    onClick={close}
                    className="flex-1 py-1 px-2.5 rounded-lg border border-white/5 text-gray-400 hover:bg-white/5 transition-all"
                    disabled={isSubmitting}
                  >
                    {language === 'en' ? 'Cancel' : '取消'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1 px-2.5 rounded-lg bg-purple-500 hover:brightness-110 text-black font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || !form.title || !form.description || !form.url}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {language === 'en' ? 'Processing...' : '处理中...'}
                      </span>
                    ) : (
                      <>{language === 'en' ? 'Submit Blog' : '提交博客'}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
